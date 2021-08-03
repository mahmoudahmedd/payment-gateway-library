const Gateway = require('./gateway');
const paypal = require('@paypal/checkout-server-sdk');


class Paypal extends Gateway
{
    constructor(...params)
    {
        super('PAYPAL');

        if(params[0].CLIENT_ID &&
    	   params[0].CLIENT_SECRET &&
    	   params[0].ENVIRONMENT)
    	{

    		this.clientId = params[0].CLIENT_ID;
	        this.clientSecret = params[0].CLIENT_SECRET;
	        this.client = new paypal.core.PayPalHttpClient(this.#environment(params[0].ENVIRONMENT));
    	}
    	else
    	{
    		throw "Paypal::set(...params) - Environment variables not defined";
    	}
    }

    /**
     * if env is equal to `sandbox` will return LiveEnvironment, `live` will return LiveEnvironment
     *
     * @param env    For example, `sandbox` | `live`
     * 
     * @return LiveEnvironment | SandboxEnvironment
     */
    #environment(env)
    {
    	if(env === "sandbox")
    	{
    		return new paypal.core.SandboxEnvironment(this.clientId, this.clientSecret);
	    }
	    else
	    {
			return new paypal.core.LiveEnvironment(this.clientId, this.clientSecret);
	    }
    }

    /**
     * Set desired parameters
     *
     * @param currencyCode  For example, `USD`
     * @param price         For example, 3000
     * 
     * @return {Object}
     */
    #buildRequestBody(currencyCode, price)
    {
    	var body = 
    	{
		  "intent": "CAPTURE",
		  "purchase_units": 
			[
				{
					"amount": 
					{
						"currency_code": currencyCode,
						"value": price
					}
				}
			]
		};

		return body;
	}

    /**
     * Creates an order
     *
     * @param data
     * @param result  Function to called. If there is no error, the first argument will be null
     */
    async createOrder(data, result)
    {
    	if(!data.hasOwnProperty('currency_code') || !data.hasOwnProperty('price'))
    	{
    		result("currency_code or price variables not defined", null);
    		return;
    	}

        // Construct a request object and set desired parameters
        // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
    	let request = new paypal.orders.OrdersCreateRequest();
		request.requestBody(this.#buildRequestBody(data.currency_code, data.price));

    	try
    	{
            // Call API with our this.client and get a response for our call
			let response = await this.client.execute(request);

			result(null, response.result);
    	}
    	catch(e)
    	{
    		result("Some error occurred while creating the Order.", null);
    	}
    }

    /**
     * Captures a payment for an order.
     *
     * @param data
     * @param result  Function to called. If there is no error, the first argument will be null
     */
    async captureOrder(data, result)
    {
    	try
    	{
    		if(!data.hasOwnProperty('token'))
	    	{
	    		result("token variable not defined", null);
	    		return;
	    	}

	    	let request = new paypal.orders.OrdersCaptureRequest(data.token);
			request.requestBody({});

			// Call API with your client and get a response for your call
			let response = await this.client.execute(request);

			result(null, response.result);
    	}
    	catch(e)
    	{
    		result("Some error occurred while capturing the Order.", null);
    	}
    }
}

module.exports = Paypal;