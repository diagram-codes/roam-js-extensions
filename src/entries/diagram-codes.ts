import { createButtonObserver, getTextTreeByBlockUid, runExtension, TreeNode } from "../entry-helpers";
import { render } from "../components/DiagramCodes";
import { addButtonListener, getParentUidByBlockUid,getOrderByBlockUid, getUidsFromButton  } from "roam-client";
import diagramEngine from 'diagram-codes-engine-client'
import {render as renderDiagramSelector} from '../components/SelectDiagramType'

import { ContentState } from "draft-js";
import templates,  { DiagramTypeItem } from "../components/diagrams/templates";


/* Create The Code Block*/
const createDiagram = async(
b: HTMLButtonElement
) => {

  /* Add a button so its button observer can track changes to the
     code block and update the preview */
  const addMonitorButton = (blockUid:string, diagramTypeId:string) => {
        //Change block to display the diagram.codes button (the button that serves as monitor)
        const item = templates[diagramTypeId];
        console.log('item')
        window.roamAlphaAPI.updateBlock({
          block: {
            uid:blockUid,
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
        order: getOrderByBlockUid(blockUid)+2,
      },
    });
  }

  
  const {blockUid, parentUid} =  getUidsFromButton(b)
  renderDiagramSelector({blockId:blockUid, parent: b.parentElement, onItemSelected: (diagramTypeId:string, item:DiagramTypeItem)=>{
    console.log('item', item);
    addMonitorButton(blockUid, diagramTypeId);
    addCodeBlock(blockUid, item.template);
  }})


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

const isCodeBlock = (codeBlock: TreeNode):boolean=>{
  return codeBlock.text.startsWith('```');
}

//Get the diagram code without the markdown syntax
const getCodeBlockValue = (str: string) : string => {
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
    render: (b: HTMLButtonElement) => {
      //Monitor block and update preview
      console.log('process diagram:', item )
    }    
  });
 });
}

runExtension("diagram-codes", () => {
   
   createButtonObserver({
     shortcut: "add diagram",
     attribute:"diagram-codes",
     render: createDiagram
   })

    createButtonObservers();

});
