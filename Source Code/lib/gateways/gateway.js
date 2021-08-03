
// Interface
class Gateway 
{
    constructor(name)
    {
        this.name = name;
    }

    showInfo()
    {
		return this.name;
    }
}

module.exports = Gateway;