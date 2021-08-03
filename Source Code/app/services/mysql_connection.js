const mysql = require("mysql");
const config = require("../configuration/config");


// MySQL details
var MySQLConnection = mysql.createConnection(
{
	host: config.DB.HOST,
	user: config.DB.USER,
	password: config.DB.PASSWORD,
	database: config.DB.NAME
});

MySQLConnection.connect((err) => 
{
	if(!err)
		console.log("MySQL Connection Established Successfully.");
	else
		console.log("Connection Failed! " + JSON.stringify(err, undefined, 2));
});

module.exports = MySQLConnection
