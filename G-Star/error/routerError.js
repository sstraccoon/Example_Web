const custromError = require('./customError');

module.exports = class RouterError extends custromError {
    constructor(message) { 
        super(message)
        this.name = 'routerError'
    }

    toString() {
        return this.name + ': ' + this.message
    }
};