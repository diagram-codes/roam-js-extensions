export default `
#table definitions

TABLE "Country" as Country:
PK"country_id"
"name"
"latitude"
"longitude"
"code"

TABLE "Person" as Per:
PK"person_id"
FK"company_id"
FK"country_id"
"dni"
"address"
"firstname"
"secondname"
"lastname"
"birthday"

TABLE "Company" as Comp: 
PK"company_id"
"nit"
"name"
"address"
"type"
"location"

TABLE "Product" as Prod:
PK"product_id"
FK"product_type"
"product_name"
"available"

TABLE "Product Categories" as ProdCat:
PK"product_id"
FK"product_type"
"product_name"
"available"

TABLE "Company Supplier" as CompSupp:
PK"company_supplier_id"
"name"
"address"
"type"
"location"


#table relations
Per>-Country
Per>-Comp["1","*"]
Comp>-CompSupp
CompSupp-Prod["1","1"]
Prod>-Comp["*","1"]
Prod-<ProdCat

`