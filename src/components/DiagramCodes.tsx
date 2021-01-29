import React, { useEffect, useState, useRef } from 'react';
import { createButtonObserver, getTextTreeByBlockUid, runExtension, TreeNode } from '../entry-helpers'
import ReactDOM from 'react-dom';
import { addButtonListener, getParentUidByBlockUid, getOrderByBlockUid, getUidsFromButton } from "roam-client";
import diagramEngine from 'diagram-codes-engine-client'

diagramEngine.setEnginePath('https://web-engine-demo-dev.diagram.codes/apirender/')


const DiagramPreview = ({ blockId, targetElem }: { blockId: string, targetElem:HTMLElement}) => {
  const [code, setCode] = useState('')
  const containerRef = useRef<HTMLElement>()

 

  //Get code from Code Block and render diagram
  useEffect(() => {
    /* Every second, check for updates */
    const interval = setInterval(() => {
      const parentId = getParentUidByBlockUid(blockId)
      const tree = getTextTreeByBlockUid(parentId)
      console.log('tree', tree)
      //Asumimos que el primer bloque es el diagrama
      const codeBlock = tree.children.find( c => c.text.trim().startsWith('```'))
      if (codeBlock && isCodeBlock(codeBlock)) {
        const diagramCode = getCodeBlockValue(codeBlock.text);
        console.log('diagram code:', diagramCode)
        
        let diagramParams = {
          container: targetElem,
          type: 'graph',
          code: diagramCode
        }
    
        console.log('Diagram params:', diagramParams)
        diagramEngine.renderDiagram(diagramParams)

      }
    }, 1000);
    return () => clearInterval(interval);

  }, [blockId])


  return (
    <div>{code}</div>
  )
}

const isCodeBlock = (codeBlock: TreeNode): boolean => {
  return codeBlock.text.trim().startsWith('```');
}

//Get the diagram code without the markdown syntax
const getCodeBlockValue = (str: string): string => {
  const contents = str.split('```')
  const contentWithoutTicks = contents[1];
  //Remove first line (language)
  return contentWithoutTicks.split('\n').slice(1).join('\n')
}


export const render = ({ blockId, parent }: {
  blockId: string;
  parent: HTMLElement;
}): void => {
  console.log('parent render:', render)
  const container = document.createElement('div')
  container.style.width = "100%";
  container.style.height = "300px";
  container.style.overflow = "auto";
 
  diagramEngine.init(container);
  parent.appendChild(container);
  const dummy = document.createElement('div')
  parent.appendChild(dummy)
  

  ReactDOM.render(<DiagramPreview blockId={blockId} targetElem={container} />, dummy);

  /* Nota: Creo que no necesitamos React */
};
