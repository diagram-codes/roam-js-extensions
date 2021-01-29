import { createButtonObserver, runExtension } from "../entry-helpers";
import { render } from "../components/DiagramCodes";
import { addButtonListener, getParentUidByBlockUid,getOrderByBlockUid  } from "roam-client";

import diagramEngine from 'diagram-codes-engine-client'
diagramEngine.setEnginePath('https://web-engine-demo-dev.diagram.codes/apirender/')

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

  /* Use alpha api to create the block with the diagram code*/
  window.roamAlphaAPI.createBlock({
    block: {
      string: code,
    },
    location: {
      "parent-uid": blockUid,
      order: getOrderByBlockUid(blockUid)+1,
    },
  });

  window.roamAlphaAPI.createBlock({
    block: {
      string: "{{Refresh Diagram}}",
    },
    location: {
      "parent-uid": blockUid,
      order: getOrderByBlockUid(blockUid),
    },
  });

  
}
runExtension("diagram-codes", () => {
    console.log('prueba extension diagram codes')
    diagramEngine.setEnginePath('https://web-engine-demo-dev.diagram.codes/apirender/')
    addButtonListener("Add Diagram", createDiagram)
});
