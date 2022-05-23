# eShop-back
backend for a generic eShop app. Serves as proven coding experience and testing purposes.

instructions:
1_import the postman collection located in the postman folder.
2_Add the {{eShopHeroku}} global variable with the value https://eshopbackend1.herokuapp.com
3_in the postman collection, run the authenticate API inside the Users folder with the following user:
{
    "email": "demo2@eShop.com",
    "password": "Demo2022"
}
4_from the result, copy the "token" field and create the global variable {{token}} with the recieved token as the value. You can now operate all APIs with that token.