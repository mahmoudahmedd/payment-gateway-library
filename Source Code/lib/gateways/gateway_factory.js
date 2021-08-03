const Paypal = require('./paypal');


const GatewaysMapping = 
{
    'PAYPAL' : Paypal 
};

/**
 create a factory which will create the different gateways objects.
 **/
class GatewayFactory
{
    create(type, configuration)
    {
        if(GatewaysMapping[type] !== undefined)
            return new GatewaysMapping[type](configuration);
        else
            throw 'Unknown Gateway type...';
    }
}

module.exports = new GatewayFactory();