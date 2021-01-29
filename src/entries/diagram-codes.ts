import { createButtonObserver, getTextTreeByBlockUid, runExtension, TreeNode } from "../entry-helpers";
import { render } from "../components/DiagramCodes";
import { addButtonListener, getParentUidByBlockUid,getOrderByBlockUid, getUidsFromButton  } from "roam-client";
import diagramEngine from 'diagram-codes-engine-client'


import { ContentState } from "draft-js";

/* Create The Code Block*/
const createDiagram = async(_:{
  [key: string]: string;
}, 
blockUid: string
) => {
  const parentUid = getParentUidByBlockUid(blockUid)
  const code = `
  ${"```"}
  # DIAGRAM: graph
  a->b
  b->c,d,e
  e->a
  ${"```"}
  `


  window.roamAlphaAPI.createBlock({
    block: {
      string: "{{diagram.codes}}",
    },
    location: {
      "parent-uid": blockUid,
      order: getOrderByBlockUid(blockUid)+1,
    },
  });

    /* Use alpha api to create the block with the diagram code*/
    window.roamAlphaAPI.createBlock({
      block: {
        string: code,
      },
      location: {
        "parent-uid": blockUid,
        order: getOrderByBlockUid(blockUid)+2,
      },
    });
  

  
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

runExtension("diagram-codes", () => {
   
    addButtonListener("Add Diagram", createDiagram)

    //Observar boton Get Diagram
    createButtonObserver({
      shortcut: "diagram.codes",
      attribute: "diagram-codes",
      render: (b: HTMLButtonElement) => {
        const {blockUid} = getUidsFromButton(b);
        render({ blockId: blockUid, parent: b.parentElement})   
      }    
    });
});
