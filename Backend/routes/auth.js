const express = require('express');
var router = express.Router()
const client = require ('../dbb');


const Api400Error = require('../errorHandler/api400Error')
const Api10000Error = require('../errorHandler/api10000Error')
const Api503Error = require('../errorHandler/api503Error')
const Api404Error = require('../errorHandler/api404Error')


const jwt = require('jsonwebtoken')
const expressjwt = require('express-jwt')


const config = require('../auth.config')
//const secret_key = '4ABE65665A31A6C323DB72988386757D90ABDBDF920BF8C1BC4264E8B17563B1'


router.use(express.json()) // Express has already a method to parse json
router.use(express.urlencoded({ extended: false })) //Allso for the url encoded

router.post('/login',(req,res)=>{ 
    
    
    let body = req.body; 

    let email = body.correo;
    
    let pass = body.pass;


    var email2 = JSON.parse(email)
    email2 = email2.toLowerCase()

    var pass2 = JSON.parse(pass)

    let select_query = 
    `
        select tipo
        from personalcapacitado
        where mail = $1 and pass = crypt($2, pass);
    `

    client.query(select_query,[email2, pass2],(err,result)=>{
        if(err){
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            
            if(result.rows.length>0){
                
                var usuario = {
                    "correo": email,
                    "tipo" : result.rows[0].tipo
                }

    
                

                let token_response = {
                    
                    token:jwt.sign(usuario, config.secret)
                }

                res.json({
                    ok: true,
                    token: token_response.token
                });
            }else{
                let error = new Api404Error(`Usuario y/o contraseña incorrectos.`)
                return res.status(404).send(error)
                
            }
        }
    });
})










module.exports = router;
