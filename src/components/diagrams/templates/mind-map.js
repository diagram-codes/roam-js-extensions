export default `
"Main Idea" as map

# Let's create 4 categories
map->"Category 1" as c1
map->"Category 2" as c2
map->"Category 3" as c3
map->"Category 4" as c4

# Add children to categories
c1->"Item 1","Item 2","Item 3"
c2->"Item 5","Item 6","Item 7"
c3->"Item 8","Item 9","Item 10"

# Add a longer name with the alias "someitem"
c4->"A long item
with a line break" as someitem

# Add children to "someitem"
someitem->a,b,c,d
`