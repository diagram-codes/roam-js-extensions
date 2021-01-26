import React from 'react';
import {getUidsFromButton} from 'roam-client'
import {createButtonObserver, getTextTreeByBlockUid, runExtension} from '../entry-helpers'
import ReactDOM from 'react-dom';



export const render = ({blockId, parent}: {
    blockId: string;
    parent: HTMLElement;
  }): void => {
    const container = document.createElement('div')
    parent.appendChild(container);
    ReactDOM.render(<span>heyhey</span>, container);
  };
  