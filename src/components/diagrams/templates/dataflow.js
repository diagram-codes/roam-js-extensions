export default `
# Use a Data Flow diagram to represent the way data flows in a system

PROCESSES:

"Receive Order" as receive
"Ship Order" as ship
"Handle Invalid Order" as handleinvalid

ENTITIES:

"Customer" as customer

DATA STORES:

"Orders" as orders

FLOWS:

customer->receive "Order product"
receive->orders "Order Details"
receive->ship "Order Details"
ship->customer "Ordered Books"

receive -> handleinvalid "Invalid Order"
handleinvalid -> customer "Clarification"
handleinvalid -> orders "Valid order details"

`
