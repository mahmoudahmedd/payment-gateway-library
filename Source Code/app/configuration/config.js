const env = process.env;

/**
 * Environment Configuration
 * It is often helpful to have different configuration values based on the needs.
 * For example, you may wish to use a different payment gateways.
 *
 * APP
 * Those values are used when the application need to initialize any variable as required by the application.
 * ----------------------------------------------------------------------
 * PORT       For example, 3000 => http://localhost:3000/
 *
 * DB
 * Default Database Connection is MySQL
 * ----------------------------------------------------------------------
 * HOST       `HOST-NAME`
 * USER       `USERNAME`
 * PASSWORD   `PASSWORD`
 * NAME       `DATABASE-NAME`
 *
 * PAYMENTS
 * Here are each of the payment gateways credentials for your application.
 * -----------------------------------------------------------------------
 * [1] PAYPAL 
 * CLIENT_ID      `PAYPAL-CLIENT-ID`
 * CLIENT_SECRET  `PAYPAL-CLIENT-SECRET`
 * ENVIRONMENT    in test use `sandbox`. In production, use `live`
 * To generate PayPal REST API credentials for the sandbox and live environments: 
 * @see {@link https://developer.paypal.com/docs/api/overview/}
 *
 * @return an array of key-value 
 */
 
const CONFIG =
{
	APP: 
	{
		PORT: env.PORT || 3000,
	},
	DB: 
	{
		HOST: env.DB_HOST || "localhost",
		USER: env.DB_USER || "root",
		PASSWORD: env.DB_PASSWORD || "",
		NAME: env.DB_NAME || "spoken"
	},
	PAYMENTS:
	{
		'PAYPAL': 
		{
			CLIENT_ID: env.PAYPAL_CLIENT_ID || "Ac5EsbEwf8ekC70vThh3bUG5271vBomALtNIWTgv5zLJbEKRizMUm6bkYHYkU7JI6faI0K0uZSO7lnGV",
			CLIENT_SECRET: env.PAYPAL_CLIENT_SECRET || "EIvnELvpgqq3-71a0bFPdng5LVisqWSj7wDhXY0RxZUv68749CVOFc2c8O-iSjquQMeau_wXrkwZQtO5",
			ENVIRONMENT: env.PAYPAL_ENVIRONMENT || "sandbox"
		}
	}
	
};
  
module.exports = CONFIG;