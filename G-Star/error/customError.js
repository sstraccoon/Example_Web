
module.exports = class custromError extends Error {
    constructor(message) { 
        super(message)
        this.name = 'custromError'
    }

    toString() {
        return this.name + ': ' + this.message
    }
};