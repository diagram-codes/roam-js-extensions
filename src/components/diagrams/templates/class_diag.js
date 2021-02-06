export default `

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

#class relations reference:

# A-B  (A and B calls and access to each other)  
# A-B: association   (A and B calls and access to each other) (same as previous)
# A-B: strict_association   (A calls and access B but not vice versa)
# A-B: composition   (A has a B and B depends on A)
# A-B: aggregation  (A has B and B can outlive A)
# A-B: dependency    (A depends on B)
# A-B: inheritance   (A inherits B)
# A-B: implementation   (A implements B)

#you can add multiplicity to any relation by adding ["anytext","anytext"] eg:
# A-B: implementation["anytext","anytext"]

#example:
# a simple class relation
Customer-Order

# class relation with explicit type:
Payment-Order: dependency
Credit-Payment: implementation
Cash-Payment: implementation
Check-Payment: implementation

# class relation with explicit type AND multiplicity
Order-OrderDetail: composition["1..*","1"]
Cash-Bill: aggregation["0..*","1"]
OrderDetail-Item: strict_association["0..*","1"]


`