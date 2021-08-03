module.exports = app =>
{
  const orderController = require("../controllers/order.controller.js");

  /**
	* @api {post} /orders Create order
	* @apiName Create new order
	*
	* @apiParam  {String} [customer_name] Customer Name
	* @apiParam  {Double} [price] price
	* @apiParam  {Enum}   [currency_code] Currency Code
	* @apiParam  {Enum}   [payment_type] Payment Type
	*
	* @apiSuccess (201) {Object} mixed `order` object
	*/
  app.post("/orders", orderController.validate('createOrder'), orderController.create);

  /**
	* @api {put} /orders/capture Capture order
	* @apiName Capture an order
	*
	* @apiParam  {Object} [data] Data
	* @apiParam  {Enum}   [payment_type] Payment Type
	*
	* @apiSuccess (200) {Object}
	*/
  app.put("/orders/capture/:id", orderController.validate('captureOrder'), orderController.capture);
};