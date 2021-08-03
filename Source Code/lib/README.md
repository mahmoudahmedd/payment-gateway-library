## Introduction
A Payment gateway library, that can handle payments easily for Node JS.

## Examples
* To generate PayPal REST API credentials for the sandbox and live environments: 
* @see {@link https://developer.paypal.com/docs/api/overview/}

```

var credentials =
{
  CLIENT_ID: "Ac5EsbEwf8ekC70vThh3bUG5271vBomALtNIWTgv5zLJbEKRizMUm6bkYHYkU7JI6faI0K0uZSO7lnGV",
  CLIENT_SECRET: "EIvnELvpgqq3-71a0bFPdng5LVisqWSj7wDhXY0RxZUv68749CVOFc2c8O-iSjquQMeau_wXrkwZQtO5",
  ENVIRONMENT: "sandbox"
};

// Creating payment gateway object without having to specify, The exact gateway's class of the object that will be created.
var gatewayFactory = Lib.create("PAYPAL", credentials);

# Creates an order
var data = 
{
  price:300,
  currency_code :"USD"
};

paypal.createOrder(data, (err, gatewayResponse) =>
{
    console.log(gatewayResponse);
});


# Captures a payment for an order.
var data = 
{
  token: "26X235628N8100253"
};


paypal.captureOrder(data, (err, gatewayResponse) =>
{
    console.log(gatewayResponse);
});
```

## Contributing
to easily add additional payment gateways must implement Gateway interface for basic functionality. than implement those functions

<b>createOrder(data, result)</b>
Here, creates a new order request to the payment gateway as needed and retrun the gateway's response.

<b>captureOrder(data, result)</b>
Here, Call payment gateway to capture the order's data to confirm the payment made by the user.

## Available Payment Gateways
The following gateways are available:
Paypal - <a href="https://github.com/paypal/Checkout-NodeJS-SDK">paypal/Checkout-NodeJS-SDK</a> for v2/checkout/orders and v2/payments APIs.

## TODO
* Add more payment gateways
* Function to get your client token for Paypal gateway.
