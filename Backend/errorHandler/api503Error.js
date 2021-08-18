const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class Api503Error extends BaseError {
 constructor (
 name,
 statusCode = httpStatusCodes.SERVICE_UNAVAILABLE,
 description = 'El servidor está caído o sobrecargado.',
 isOperational = true
 ) {

    super(name, statusCode, isOperational, description)

 }
}

module.exports = Api503Error