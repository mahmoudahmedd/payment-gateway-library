const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const Config = require("./configuration/config");

// Create express app
const app = express();

// Call all the root folders
app.use(express.static(__dirname + "/public"));

// Parse requests of content-type: application/json
app.use(bodyParser.json());

// Order route
require("./routes/order.routes.js")(app);

// Root route
app.get("/", (req, res) => 
{
	res.sendFile(path.join(__dirname + "/index.html"));
});


// Set port, listen for requests
app.listen(Config.APP.PORT, () =>
{
	console.log("Server is running on port " + Config.APP.PORT);
});

module.exports = app;
