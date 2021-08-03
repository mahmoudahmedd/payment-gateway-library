const request = require("supertest");
const app = require('../app');

describe("POST /orders", () => 
{
    test("It responds with the newly created order", async () => 
    {
        const newOrder = await request(app)
        .post("/orders")
        .send(
        {
            customer_name: "Mahmoud Ahmed",
            price: 4500,
            currency_code: "USD",
            payment_type: "PAYPAL"
        });

        expect(newOrder.body).toHaveProperty("id");
        expect(newOrder.body).toHaveProperty("customer_name");
        expect(newOrder.body).toHaveProperty("price");
        expect(newOrder.body).toHaveProperty("currency_code");
        expect(newOrder.body).toHaveProperty("status");
        expect(newOrder.body).toHaveProperty("payment_type");
        expect(newOrder.body).toHaveProperty("created");
        expect(newOrder.body).toHaveProperty("updated");
        expect(newOrder.body).toHaveProperty("order_data");

        expect(newOrder.body.customer_name).toBe("Mahmoud Ahmed");
        expect(newOrder.body.price).toBe(4500);
        expect(newOrder.body.currency_code).toBe("USD");
        expect(newOrder.body.payment_type).toBe("PAYPAL");

        expect(newOrder.statusCode).toBe(201);
    });
});

describe("PUT /orders/capture/1", () => 
{
    test("should status code be 400 error if the input object is invalid", async () => 
    {
        const updatedOrder = await request(app)
        .put("/orders/capture/1")
        .send(
        {
            payment_type:"PAYPAL"
        });

        expect(updatedOrder.body).toHaveProperty("errors");

        expect(updatedOrder.statusCode).toBe(400);
    });
});