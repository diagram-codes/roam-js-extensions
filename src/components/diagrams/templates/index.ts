const diagramTypes =  {
  ['flowchart']:{name:"Flowchart", template:require('./flowchart').default } ,
  ['graph']: {name: "Graph", template: require('./graph').default},
  ['stack']: {name: "Stack", template: require('./layer-stack').default},
  ['onion-layers']: {name: "Onion", template:require('./onion-layers').default},
  ['sequence']: {name: "Sequence", template: require('./sequence').default},
  ['system-layers']: {name: "System Layers", template:require('./system-layers').default},
  ['tree-left-to-right']: {name: "Tree (Horizontal)", template:require('./tree-horizontal').default},
  ['mind-map']: {name: "Mindmap", template: require('./mind-map').default},
  ['tree']: {name: "Tree(Vertical)", template: require('./tree').default},
  ['timeline']: {name: "Timeline", template: require('./timeline').default},
  ['state-machine']: {name: "State Machine", template: require('./state-machine').default},
  ['entity-relationship']: {name: "Entity-relashionship", template: require('./entity-relationship').default},
  ['class_diag']: {name: "Class", template: require('./class_diag').default},
}

export interface DiagramTypeItem {
  name: string;
  template: string
}
export interface IDiagramTypeDictionary {
  [index: string]: {name:string, template:string};
}


export default diagramTypes as IDiagramTypeDictionary;


