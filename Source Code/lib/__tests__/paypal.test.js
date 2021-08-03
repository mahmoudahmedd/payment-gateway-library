const Paypal = require("../gateways/paypal.js");
const Lib = require("../index.js");

var credentials =
{
    CLIENT_ID: "Ac5EsbEwf8ekC70vThh3bUG5271vBomALtNIWTgv5zLJbEKRizMUm6bkYHYkU7JI6faI0K0uZSO7lnGV",
    CLIENT_SECRET: "EIvnELvpgqq3-71a0bFPdng5LVisqWSj7wDhXY0RxZUv68749CVOFc2c8O-iSjquQMeau_wXrkwZQtO5",
    ENVIRONMENT: "sandbox"
};

describe("Library", () => 
{
    test("Should throw Error with environment variables not defined when no credentials were passed", () => 
    {
        try 
        {
            var credentials = {};
            var gatewayFactory = Lib.create("PAYPAL", credentials);
        }
        catch(e)
        {
            expect(e).toBe("Paypal::set(...params) - Environment variables not defined");
        }
    });

    test("Should return Error with currency_code or price variables not defined variables not defined when no order's data were passed", () => 
    {
        try 
        {
            var order = {};
            var paypal = new Paypal(credentials);
            
            paypal.createOrder(order, (err, gatewayResponse) =>
            {
                expect(err).toBe("currency_code or price variables not defined");
            });
        }
        catch(e)
        {
            expect(e).toBe("Paypal::set(...params) - Environment variables not defined");
        }
    });

    test("Should return id because order's data were passed and environment variables defined", () => 
    {
        try 
        {  
            var order = 
            {
                currency_code: "USD",
                price: 300,
            };

            var paypal = new Paypal(credentials);
            
            paypal.createOrder(order, (err, gatewayResponse) =>
            {
                expect(gatewayResponse).toHaveProperty("id");
            });
        }
        catch(e)
        {
            expect(e).toBe("Paypal::set(...params) - Environment variables not defined");
        }
    });
});

