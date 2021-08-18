const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class Api10000Error extends BaseError {
 constructor (
 name,
 statusCode = httpStatusCodes.ECONNREFUSED,
 description = 'Conexión refusada, el servidor está caído o sobrecargado.',
 isOperational = true
 ) {

    super(name, statusCode, isOperational, description)

 }
}

module.exports = Api10000Error