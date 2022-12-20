const custromError = require('./customError');

module.exports = class ControllerError extends custromError {
    constructor(message) { 
        super(message)
        this.name = 'constrollerError'
    }

    toString() {
        return this.name + ': ' + this.message
    }
};