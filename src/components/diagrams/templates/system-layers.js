export default `
# Application architecture
# Start a list with H or V (Horizontal or Vertical layouts)
# Let's start with a horizontal layout.

H[data,logic,presentation] with label "Architecture"

# Let's define the nested layers
data=V["Data access","Integration"] with label "Data"
logic=V["Business logic", "Workflow", "Entities"] with label "Business Logic"
presentation=V[mobile,"Web"] with label "Presentation"

# Let's split mobile into IOS and Android
mobile=H[ios,android] with label "mobile"
`