
const express = require('express');
var router = express.Router()
const client = require ('../dbb');


const Api400Error = require('../errorHandler/api400Error')
const Api10000Error = require('../errorHandler/api10000Error')
const Api503Error = require('../errorHandler/api503Error')
const Api404Error = require('../errorHandler/api404Error')
router.get('/getCategories',(req,res)=>{
    let select_query=`SELECT * FROM categoria ORDER BY nombre asc`;

    client.query(select_query,(err,result)=>{

        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            res.json({
                ok: true,
                result: result.rows
            });
            
        }

        

    });


})


router.get('/getRegionesCategoriesData/:region',(req,res)=>{
    let region = req.params.region; 
    let select_query=`SELECT * FROM categoria ORDER BY nombre asc`;
    
    client.query(select_query,(err,result)=>{

        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            res.json({
                ok: true,
                result: result.rows
            });
        }

        
        

    });


})


module.exports = router;

