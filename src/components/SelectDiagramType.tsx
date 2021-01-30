import React, { useEffect, useState, useRef, SyntheticEvent } from 'react';
import { createButtonObserver, getTextTreeByBlockUid, runExtension, TreeNode } from '../entry-helpers'
import ReactDOM from 'react-dom';
import { addButtonListener, getParentUidByBlockUid, getOrderByBlockUid, getUidsFromButton } from "roam-client";
import diagramEngine from 'diagram-codes-engine-client'
import templates, { DiagramTypeItem } from './diagrams/templates'
import './SelectDiagramType.css';
diagramEngine.setEnginePath('https://web-engine-demo-dev.diagram.codes/apirender/')



const SelectDiagramType = ({ onItemSelected }: { onItemSelected: (diagramTypeId:string, item: DiagramTypeItem) => void }) => {

    const DiagramTypes = Object.keys(templates);
    const [show, setShow] = useState(true);

    const handleItemSelect = (dtype: string, diagramType: DiagramTypeItem, ev:SyntheticEvent) => {
        onItemSelected(dtype, diagramType)
        setShow(false);
        ev.preventDefault();
    }

    if (!show) {
        return null;
    }

    return (
        <div className="diagram-type-selector">
            <span className="diagram-type-label"> What type of diagram do you want? </span>
            <div className="diagram-type-list">
            {DiagramTypes.map((dtype: string) => (
                <a className="diagram-type-item" href="#" onClick={handleItemSelect.bind(this, dtype, templates[dtype])}>
                    {templates[dtype].name}
                </a>
            ))}
            </div>
        </div>
    )
}



export const render = ({ blockId, parent, onItemSelected }: {
    blockId: string;
    parent: HTMLElement;
    onItemSelected:  (diagramTypeId:string, item: DiagramTypeItem) => void 
}): void => {

    const container = document.createElement('div')
    parent.appendChild(container);


    ReactDOM.render(<SelectDiagramType onItemSelected={onItemSelected} />, container);

    /* Nota: Creo que no necesitamos React */
};
