const MySQLConnection = require("../services/mysql_connection");

// Constructor
const Order = function(order)
{
  this.customer_name = order.customer_name;
  this.price = order.price;
  this.currency_code = order.currency_code;
  this.status = order.status;
  this.payment_type = order.payment_type;
  this.created = order.created;
  this.updated = order.updated;
};


/**
 * Creating sql query to the suitable payment gateway as needed  
 * If our application needs to be able to accept payment with other payment gates, 
 * all it has to do is add the statement with the suitable array
 *
 * @param gateway          For example, PAYPAL
 * @param gatewayResponse  Gateway Response
 * 
 * @return array
 */
Order.createQueryMapping = (gateway, gatewayResponse) =>
{
  switch (gateway)
  {
    case 'PAYPAL':
    {
     return [
      "INSERT INTO paypal_payments SET ?",
      {token : gatewayResponse.id}
    ]  
    }
  }
}

/**
 * Creating sql query to update for the suitable payment gateway as needed  
 *
 * @param gateway          For example, PAYPAL
 * @param gatewayResponse  Gateway Response
 * @param orderId          Order ID
 * 
 * @return array
 */
Order.updateQueryMapping = (gateway, gatewayResponse, orderId) =>
{
  switch (gateway)
  {
    case 'PAYPAL':
    {
      var paypalFee = gatewayResponse.purchase_units[0].payments.captures[0].seller_receivable_breakdown.paypal_fee.value;
      var transactionId = gatewayResponse.purchase_units[0].payments.captures[0].id;
     return [
      "UPDATE paypal_payments SET fee=? , token=?, transaction_id=? WHERE id=?",
      [paypalFee, gatewayResponse.id, transactionId, orderId]
    ]  
    }
  }
}


Order.create = (order, paymentType, gatewayResponse, result) => 
{
  var sql = Order.createQueryMapping(paymentType, gatewayResponse)[0];
  var gatewayResponse = Order.createQueryMapping(paymentType, gatewayResponse)[1];

  // A database transaction, to ensure accuracy, completeness, and data integrity.
  MySQLConnection.beginTransaction(function(err) 
  {
    if(err)
    { 
      MySQLConnection.rollback();
      result(err, null);
      return; 
    }

    MySQLConnection.query("INSERT INTO orders SET ?", order, function(err, res) 
    {
      if(err)
      { 
        // Undoing all data changes from the current transaction
        MySQLConnection.rollback();
        result(err, null);
        return; 
      }

      insertId = res.insertId;
      gatewayResponse.id = insertId;


      MySQLConnection.query(sql, gatewayResponse, function(err, res)
      {
        if(err)
        { 
          MySQLConnection.rollback();
          result(err, null);
          return; 
        }

        // Sends a COMMIT statement to the MySQL server
        MySQLConnection.commit(function(err) 
        {
          if(err)
          { 
            MySQLConnection.rollback();
            result(err, null);
            return; 
          }

          order_data = gatewayResponse;
          result(null, {id: insertId, ...order, order_data});
        });
      });
    });
  });
};

Order.update = (orderId, paymentType, gatewayResponse, result) => 
{
  var sql = Order.updateQueryMapping(paymentType, gatewayResponse, orderId)[0];
  var gatewayResponse = Order.updateQueryMapping(paymentType, gatewayResponse, orderId)[1];


  // A database transaction, to ensure accuracy, completeness, and data integrity. 
  MySQLConnection.beginTransaction(function(err) 
  {
    if(err)
    { 
      // Undoing all data changes from the current transaction
      MySQLConnection.rollback();
      result(err, null);
      return; 
    }

    
    MySQLConnection.query("UPDATE orders SET status = ? WHERE id = ?", 
                          ["completed", orderId], function(err, res) 
    {
      
      if(err)
      { 
        MySQLConnection.rollback();
        result(err, null);
        return; 
      }

      MySQLConnection.query(sql, gatewayResponse, function(err, res)
      {
        if(err)
        {
          MySQLConnection.rollback();
          result(err, null);
          return; 
        }

        // Sends a COMMIT statement to the MySQL server
        MySQLConnection.commit(function(err) 
        {
          if(err)
          { 
            MySQLConnection.rollback();
            result(err, null);
            return; 
          }

          result(null, { id: orderId});
        });
      });
    });
  });
};


module.exports = Order;