export default `#basic class definition
CLASS "Customer" as Customer:
"name"
"address"
"Customer()"
"EditInfo()"

#basic class definition with field and method grouping
CLASS "Order" as Order:
-"date"
-"status"
+"CalcTax()"
+"CalcTotal()"
+"CalcTotalWeight()"

CLASS "OrderDetail" as OrderDetail:
-"quantity"
-"taxStatus"
+"calcSubTotal()"

CLASS "Item" as Item:
-"shippingWeight"
-"description"
+"getPriceForQuantity()"

CLASS "Payment <<INTERFACE>>" as Payment:
-"ammount"

CLASS "Credit" as Credit:
-"number"
-"type"
+"authorized()"

CLASS "Cash" as Cash:
-"cashTendered"

CLASS "Check" as Check:
-"name"
-"bankId"
+"authorized()"

CLASS "Bill" as Bill:
-"denomination"
-"serial"
+"authorized()"

#class relations

#association (-)
#association (->) left to right
#association (<-) right to left
#dependency (-->) left to right
#dependency (<--) right to left
#inheritance (-|>) left to right
#inheritance (<|-) right to left
#implementation/realization (--|>) left to right
#implementation/realization (<|--) right to left
#aggregation (-<>) left to right
#aggregation (<>-) right to left
#composition (-<<>>) left to right
#composition (<<>>-) right to left

Customer-Order["1","0..*"]
Order<>-OrderDetail["","1..*"]
Order->Payment["1","1..*"]
Credit--|>Payment
Cash--|>Payment
Bill-<<>>Cash
Check--|>Payment
OrderDetail->Item["0..*","1"]
`