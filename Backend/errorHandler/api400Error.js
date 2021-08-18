const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class Api400Error extends BaseError {
 constructor (
 name,
 statusCode = httpStatusCodes.BAD_REQUEST,
 description = 'El servidor no pudo procesar la solicitud debido a que presenta un error en el lado del Cliente.',
 isOperational = true
 ) {

    super(name, statusCode, isOperational, description)

 }
}

module.exports = Api400Error