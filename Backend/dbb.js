// const mysql = require ('pg');

const Api10000Error = require('./errorHandler/api10000Error')

const {Pool,Client} = require('pg');

const pool = new Pool()

const client = new Client({
 
  user: 'postgres',
  database: 'memoria2',
  password: 'admin',
  //host: 'localhost',
  port: 5432
})
/*
try{
  await client.connect()
}catch(error){
  throw new Api10000Error(`Conexión refusada, el servidor está caído o sobrecargado.`)
}
*/

/*
client.connect((err)=>{
  if(err){
    console.log("acá")
    console.log(err)
    let error = new Api10000Error(`Conexión refusada, el servidor está caído o sobrecargado.`)
    return res.status(400).send(error)
  }

})*/
client.connect();



module.exports = client;