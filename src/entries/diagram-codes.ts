import { createButtonObserver,createHTMLObserver, createHTMLObserverForTarget, getTextTreeByBlockUid, runExtension, TreeNode } from "../entry-helpers";
import { render } from "../components/DiagramCodes";
import { addButtonListener, getParentUidByBlockUid, getOrderByBlockUid, getUidsFromButton } from "roam-client";
import diagramEngine from 'diagram-codes-engine-client'
import { render as renderDiagramSelector } from '../components/SelectDiagramType'

import { ContentState } from "draft-js";
import templates, { DiagramTypeItem } from "../components/diagrams/templates";
import './diagram-codes.css';

if(!process.env.REACT_APP_ENGINE_URL) {
  throw new Error('Diagram Codes Extension for Roam - REACT_APP_ENGINE_URL not set')
}

diagramEngine.setEnginePath(process.env.REACT_APP_ENGINE_URL)

/* Create The Code Block*/
const createDiagramBlocks = async (
  b: HTMLButtonElement
) => {

  /* Add a button so its button observer can track changes to the
     code block and update the preview */
  const addMonitorButton = (blockUid: string, diagramTypeId: string) => {
    //Change block to display the diagram.codes button (the button that serves as monitor)
    const item = templates[diagramTypeId];
    console.log('item')
    window.roamAlphaAPI.updateBlock({
      block: {
        uid: blockUid,
        string: `{{Diagram Type - ${item.name}}}`,
      },
    });

  }

  const addCodeBlock = (blockUid: string, code: string) => {
    window.roamAlphaAPI.createBlock({
      block: {
        string: `${"```"}${code}${"```"}`,
      },
      location: {
        "parent-uid": blockUid,
        order: getOrderByBlockUid(blockUid) + 2,
      },
    });
  }


  const { blockUid, parentUid } = getUidsFromButton(b)
  renderDiagramSelector({
    blockId: blockUid, parent: b.parentElement, onItemSelected: (diagramTypeId: string, item: DiagramTypeItem) => {
      console.log('item', item);
      addMonitorButton(blockUid, diagramTypeId);
      addCodeBlock(blockUid, item.template);
    }
  })


  /*

  window.roamAlphaAPI.createBlock({
    block: {
      string: "{{diagram.codes}}",
    },
    location: {
      "parent-uid": blockUid,
      order: getOrderByBlockUid(blockUid)+1,
    },
  });

    window.roamAlphaAPI.createBlock({
      block: {
        string: code,
      },
      location: {
        "parent-uid": blockUid,
        order: getOrderByBlockUid(blockUid)+2,
      },
    });
  
    */

}

const isCodeBlock = (codeBlock: TreeNode): boolean => {
  return codeBlock.text.startsWith('```');
}

//Get the diagram code without the markdown syntax
const getCodeBlockValue = (str: string): string => {
  const contents = str.split('```')
  const contentWithoutTicks = contents[1];
  //Remove first line (language)
  return contentWithoutTicks.split('\n').slice(1).join('\n')
}

/*Create a button observer for every type of diagram 
TODO: Test performance implications because we are creating more than 10 observers
*/
const createButtonObservers = () => {
  const ids = Object.keys(templates);
  ids.forEach(diagramType => {
    const item = templates[diagramType]
    createButtonObserver({
      //Note: this has to match the button created when the "Add diagram" command is executed
      shortcut: `Diagram Type - ${item.name}`,
      attribute: "diagram-codes",
      render: async (b: HTMLButtonElement) => {
        //TODO: este codigo puede correr varias veces, revisar para evitar duplicar operaciones
        const { blockUid, parentUid } = getUidsFromButton(b)
        if (!previewExists(b)) {
          //wait till initialized with diagram codes engine
          const container = await createPreviewContainer(b, item.name);
          connectPreview(container, b, diagramType);
        }

      }
    });
  });
}

/* Initialize the preview iframe */
const createPreviewContainer = async (b: HTMLButtonElement, diagramType: string) => {
  const container = document.createElement('div')
  container.classList.add('diagram-codes-preview-container')
  container.classList.add(diagramType)
  b.parentElement.appendChild(container);
  await diagramEngine.init(container);
  return container;
}
interface CodeMirrorHTMLElement extends Element {
  CodeMirror: any
}
/* Update preview when code block changes */
const connectPreview = (container: HTMLElement,
  b: HTMLButtonElement,
  diagramType: string) => {
  //Get CodeMirror instance
  //TODO: Aqui dependemos de que no cambie rm-block.
  const parentBlock = b.closest('.rm-block') as HTMLElement;
  if (!parentBlock) {
    throw new Error('(diagram-codes) Element not found rm-block')
  }

  const updatePreviewFromCodeMirrorElem = (elem:HTMLElement) => {
    const editorElem = elem as unknown as CodeMirrorHTMLElement
        if (editorElem && editorElem.CodeMirror) {
          //The observer callback is also triggered when the user types
          //But we only need it when the element is created, so let's use a flag
          if(!editorElem.getAttribute('diagram-codes-init')){
            editorElem.CodeMirror.on('change', (instance:any, changeObj:any) => {
              console.log('CodeMirror change event!', diagramType, instance.getValue())
              updatePreview(container, diagramType, instance.getValue());
            })
            editorElem.setAttribute('diagram-codes-init','true')
            //Trigger a render
          updatePreview(container, diagramType, editorElem.CodeMirror.getValue())
          }
          
        } else {
          //No Code block found, maybe the user deleted it? do nothing
          //The user needs to add it manually and refresh
          console.error('(Diagram Codes: CodeMirror not found)')
        }
  }

   /* Add on change handler to codemirror. But we need to check
        when the codemirror component is rendered by react so we observe changes */
  createHTMLObserverForTarget({
    target: parentBlock,
    callback: (elem:HTMLElement) => {
      setTimeout(() => {
        updatePreviewFromCodeMirrorElem(elem);
      }, 800)
    },
    className:"CodeMirror",
    tag:"DIV",
    removeCallback: (elem: HTMLElement) => {
      /* CodeMirror instance removed, remove listener */
    }
  })

  /* Trigger first render */
  const elem = parentBlock.querySelector('.CodeMirror');
  if(elem){
    setTimeout(()=>{
      updatePreviewFromCodeMirrorElem(elem as HTMLElement);
    }, 800)
  }

}

const updatePreview = (container: HTMLElement, diagramType: string, code: string) => {
  let diagramParams = {
    container: container,
    type: diagramType,
    code: code
  }

  console.log('Diagram params:', diagramParams)
  diagramEngine.renderDiagram(diagramParams)
}

/* Check if the preview element is already created */
const previewExists = (b: HTMLButtonElement) => {

  const iframe = b.parentElement.querySelector('iframe[diagram-renderer]')
  return iframe != null;
}

runExtension("diagram-codes", () => {


  createButtonObserver({
    shortcut: "add diagram",
    attribute: "diagram-codes",
    render: createDiagramBlocks
  })

  createButtonObservers();

});
