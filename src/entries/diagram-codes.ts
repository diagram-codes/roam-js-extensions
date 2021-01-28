import { createButtonObserver, runExtension } from "../entry-helpers";
import { render } from "../components/DiagramCodes";
import { addButtonListener, getParentUidByBlockUid,getOrderByBlockUid  } from "roam-client";


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

  
}
runExtension("diagram-codes", () => {
    console.log('prueba extension diagram codes')
    addButtonListener("Add Diagram", createDiagram)
});
