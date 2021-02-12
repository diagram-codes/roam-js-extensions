export default `
"This is the root of the tree" as t
t->"A child element"
t->"Another element with
a line break" as child1
child1->"Item 1","Item 2" as item2
item2->"And a last one"
`