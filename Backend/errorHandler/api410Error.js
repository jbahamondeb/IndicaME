const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class Api410Error extends BaseError {
 constructor (
 name,
 statusCode = httpStatusCodes.GONE,
 description = 'Ha expirado el tiempo en el cual era válida esta consulta.',
 isOperational = true
 ) {

    super(name, statusCode, isOperational, description)

 }
}

module.exports = Api410Error