const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class Api501Error extends BaseError {
 constructor (
 name,
 statusCode = httpStatusCodes.NOT_IMPLEMENTED,
 description = 'No soportado por el servidor. No está implementado.',
 isOperational = true
 ) {

    super(name, statusCode, isOperational, description)

 }
}

module.exports = Api501Error