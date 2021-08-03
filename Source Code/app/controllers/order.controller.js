const Order = require("../models/order.model.js");
const Config = require("../configuration/config");
const Lib = require("../../lib/index.js");
const { body, validationResult } = require('express-validator');

/**
 * express-validator for all server-level validation
 * @see {@link https://express-validator.github.io/docs/index.html}
 *
 * @return array
 */
exports.validate = (method) =>
{
  switch (method) {
    case 'createOrder':
    {
     return [
		  body("customer_name").exists(),
		  body("price").exists(),
		  body("currency_code").exists(),
		  body("payment_type").exists()
		]  
    }
    case 'captureOrder':
    {
     return [
		  body("payment_type").exists(),
		  body("data").exists().isObject(true)
		]  
    }
  }
}

// Create and Save a new Order
exports.create = (req, res) =>
{
	// Finds the validation errors in this request and wraps them in an object
	const errors = validationResult(req);

	// Validate request
	if(!errors.isEmpty())
	{
		return res.status(400).json({ errors: errors.array() })
	}

	// Create a new Order
	const order = new Order(
	{
		customer_name: req.body.customer_name,
		price: req.body.price,	
		currency_code: req.body.currency_code,
		status: "created",
		payment_type: req.body.payment_type,
		created: new Date(),
		updated: new Date()
	});

	try 
	{
		// creating payment gateway object without having to specify
		// The exact gateway's class of the object that will be created.
		var paymentType = order.payment_type;
		var gatewayFactory = Lib.create(paymentType, Config.PAYMENTS[paymentType]);

		// Here, createOrder(order) creates a request to the suitable payment gateway as needed
		// @return err | gatewayResponse
		gatewayFactory.createOrder(order, (err, gatewayResponse) =>
		{
			if(err)
			{
				res.status(500).send({errors: [{"msg": err}]});
			}
			else
			{
				// Here, Order.create saves the order to the database, order.status = `created`
				// @return err | data
				Order.create(order, paymentType, gatewayResponse, (err, data) =>
				{
					if(err)
					{
						res.status(500).send({errors: [{"msg": "Some error occurred while creating the Order."}]});
					}
					else
					{
						res.status(201).send(data);
					}
				});
			}
		});
	}
	catch(e)
	{
		// Executed if an exception is thrown in the try-block.
		res.status(500).send({errors: [{"msg": e}]});
	}
};


// Capture and update the order
exports.capture = (req, res) =>
{
	// Finds the validation errors in this request and wraps them in an object
	const errors = validationResult(req);

	// Validate request
	if(!errors.isEmpty())
	{
		return res.status(400).json({ errors: errors.array() })
	}

	try 
	{
		// puts :id in orderId
		// url: '/orders/capture/123' and orderId will contain 123
		var orderId = req.params.id;

		// The data submitted in the request body.
		var paymentType = req.body.payment_type;
		var data = req.body.data;

		// creating payment gateway object without having to specify the exact gateway's class.
		var gatewayFactory = Lib.create(paymentType, Config.PAYMENTS[paymentType]);

		// Call payment gateway to capture the order
		// We can confirm the payment made by the user
		// @param data
		// @return err | gatewayResponse
		gatewayFactory.captureOrder(data, (err, gatewayResponse) =>
		{
			if(err)
			{
				res.status(500).send({errors: [{"msg": err}]});
			}
			else
			{
				// Here, Order.update updates the order's status, order.status = `completed`
				// Modify some other fields according to each payment gateway
				// @param orderId
				// @param paymentType
				// @param gatewayResponse
				//
				// @return err | data
				Order.update(orderId, paymentType, gatewayResponse, (err, data) =>
				{
					if(err)
					{
						res.status(500).send({errors: [{"msg": "Some error occurred while capturing the Order."}]});
					}
					else
					{
						res.status(200).send(data);
					}
				});
			}
		});
	}
	catch(e)
	{
		// Executed if an exception is thrown in the try-block.
		res.status(500).send({errors: [{"msg": e}]});
	}
};