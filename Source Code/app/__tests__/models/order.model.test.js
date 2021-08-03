const Order = require("../../models/order.model.js");
const Lib = require("../../../lib/index.js");
const Config = require("../../configuration/config");

describe("Order Model", () => 
{
    test("Create a new Order and check if it saved into the database", async () => 
    {
    	// Create a new Order
		const order = new Order(
		{
			customer_name: "Mahmoud Ahmed",
			price: 4500,	
			currency_code: "USD",
			status: "created",
			payment_type: "PAYPAL",
			created: new Date(),
			updated: new Date()
		});

    	var paymentType = "PAYPAL";
		var gatewayFactory = Lib.create(paymentType, Config.PAYMENTS[paymentType]);

		await gatewayFactory.createOrder(order, (err, gatewayResponse) =>
		{
			Order.create(order, paymentType, gatewayResponse, (err, data) =>
			{
				
				expect(data).toHaveProperty("customer_name");
				expect(data).toHaveProperty("price");
				expect(data).toHaveProperty("currency_code");
				expect(data).toHaveProperty("status");

				expect(data.customer_name).toBe("Mahmoud Ahmed");
		        expect(data.price).toBe(4500);
		        expect(data.currency_code).toBe("USD");
		        expect(data.status).toBe("created");
			});
		});
    });
});