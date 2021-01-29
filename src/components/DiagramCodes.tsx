import React, { useEffect, useState, useRef } from 'react';
import { createButtonObserver, getTextTreeByBlockUid, runExtension, TreeNode } from '../entry-helpers'
import ReactDOM from 'react-dom';
import { addButtonListener, getParentUidByBlockUid, getOrderByBlockUid, getUidsFromButton } from "roam-client";
import diagramEngine from 'diagram-codes-engine-client'

diagramEngine.setEnginePath('https://web-engine-demo-dev.diagram.codes/apirender/')


const DiagramPreview = ({ blockId, target }: { blockId: string, target:HTMLElement}) => {
  const [code, setCode] = useState('')
  const containerRef = useRef<HTMLElement>()

 

  //Get code from Code Block and render diagram
  useEffect(() => {
    /* Every second, check for updates */
    const interval = setInterval(() => {
      const tree = getTextTreeByBlockUid(blockId)
      console.log('tree', tree)
      //Asumimos que el primer bloque es el diagrama
      const codeBlock = tree.children[0]
      if (codeBlock && isCodeBlock(codeBlock)) {
        const diagramCode = getCodeBlockValue(codeBlock.text);
        console.log('diagram code:', diagramCode)
        
        let diagramParams = {
          container: target,
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
  return codeBlock.text.startsWith('```');
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
  const container = document.createElement('div')
  container.style.width = "100%";
  container.style.height = "300px";
  container.style.overflow = "auto";
  //const iframe = document.createElement("iframe");
  // iframe.style.width = "100%";
  // iframe.style.height = "400px";
  // iframe.style.border = "none";
  // iframe.style.minWidth = "400px";
  // iframe.style.minHeight = "400px";
  // iframe.style.overflow = "auto";
  // iframe.setAttribute("diagram-renderer", "");
  // iframe.setAttribute("ready", "false");
  // iframe.src = diagramEngine.enginePath;
  // parent.appendChild(iframe)
  parent.appendChild(container);
  diagramEngine.init(container);
  const dummy = document.createElement('div')
  parent.appendChild(dummy)
  

  ReactDOM.render(<DiagramPreview blockId={blockId} target={container} />, dummy);

  /* Nota: Creo que no necesitamos React */
};
