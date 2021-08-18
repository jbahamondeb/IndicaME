const express = require('express');
var router = express.Router()
const client = require ('../dbb');

const storage = require('../multer')
const multer = require('multer')
const upload = multer({storage})

const fs = require('fs'); 


const path = require('path')

var format = require('pg-format');

var async = require("async");


const Api400Error = require('../errorHandler/api400Error')
const Api10000Error = require('../errorHandler/api10000Error')
const Api503Error = require('../errorHandler/api503Error')
const Api404Error = require('../errorHandler/api404Error')

router.post('/deleteIndicador',(req,res)=>{ 
    let body = req.body

    let id_indicador = JSON.parse(body.id_indicador)

    let select_query =
    `
        select distinct(id_archivo)
        from indicadorobtencionfecha
        where id_indicador = $1
    `
    client.query('BEGIN', err =>{

        if(err){
             
             
            client.query('ROLLBACK', err => {
                 
                if(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }
            })
        }else{
            client.query(select_query,[id_indicador],(err,result)=>{
                if (err) {
                    client.query('ROLLBACK', err => {
                         
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
                }else{
        
                    if(result.rows.length > 0){
                        const ids_archivos = result.rows;
        
                    
                        var text_archivos = ""
                        for(var i=0;i<result.rows.length;i++){
                            if(i+1>=result.rows.length){
                                text_archivos+= result.rows[i].id_archivo
                                                //text_documentos+= "id_documento = " + "'" + result.rows[i].id_documento + "'"
                            }else{
                                text_archivos+= result.rows[i].id_archivo + ","
                                                //text_documentos+= "id_documento = " + "'" + result.rows[i].id_documento + "' OR "
                            }
                        }
    
                        console.log(text_archivos)
    
                        let select_query2 = 
                        `
                            select nombre
                            from archivo
                            where id IN (${text_archivos})
                        
                        `
                        
                        client.query(select_query2,(err,result)=>{
                            if (err) {
                                console.log(err)
                                client.query('ROLLBACK', err => {
                                     
                                    if(err){
                                        let error = new Api503Error(`Error en el servidor.`)
                                        return res.status(503).send(error)
                                    }else{
                                        let error = new Api503Error(`Error en el servidor.`)
                                        return res.status(503).send(error)
                                    }
                                })
                            }else{
    
                                let result_archivos = result.rows;
    
                                let del_query_archivos = 
                                `
                                    delete from archivo where id IN (${text_archivos})
                                
                                `
                                client.query(select_query2,(err,result)=>{
                                    if (err) {
                                        
                                        client.query('ROLLBACK', err => {
                                             
                                            if(err){
                                                let error = new Api503Error(`Error en el servidor.`)
                                                return res.status(503).send(error)
                                            }else{
                                                let error = new Api503Error(`Error en el servidor.`)
                                                                    return res.status(503).send(error)
                                            }
                                        })
                                    }else{
                                        console.log(result_archivos)
                                         
                                            async.forEachOf(result_archivos, (value, key, callback)=>{
    
                                                fs.unlink('./uploads/' + value.nombre, (err) => {
                        
                                                    if (err) {
                                                        client.query('ROLLBACK', err => {
                                         
                                                            if(err){
                                                                let error = new Api503Error(`Error en el servidor.`)
                                                                return res.status(503).send(error)
                                                            }else{
                                                                let error = new Api503Error(`Error en el servidor.`)
                                                                return res.status(503).send(error)
                                                            }
                                                        })
    
                                                        /*
                                                        console.log(err)
                                                        let error = new Api503Error(`Error en el servidor.`)
                                                        return res.status(503).send(error)
                                                        */
                                                      //return 
                                                    }
                                                    
                                                    client.query(del_query_archivos,(err,result)=>{
                                                        if (err) {
                                                            client.query('ROLLBACK', err => {
                                             
                                                                if(err){
                                                                    let error = new Api503Error(`Error en el servidor.`)
                                                                    return res.status(503).send(error)
                                                                }else{
                                                                    let error = new Api503Error(`Error en el servidor.`)
                                                                    return res.status(503).send(error)
                                                                }
                                                            })
    
                                                            
                                                        }else{

                                                            let del_query2 = 
                                                            `
                                                                delete from indicador where id_indicador = $1
                                                            `

                                                            client.query(del_query2,[id_indicador],(err,result)=>{
                                                                if (err) {
                                                                    client.query('ROLLBACK', err => {
                                                     
                                                                        if(err){
                                                                            let error = new Api503Error(`Error en el servidor.`)
                                                                            return res.status(503).send(error)
                                                                        }else{
                                                                            let error = new Api503Error(`Error en el servidor.`)
                                                                            return res.status(503).send(error)
                                                                        }
                                                                    })
                                                                }else{
                                                                    client.query('COMMIT', err =>{
                                                                        if (err) {
                                                                             
                                                                             
                                                                            let error = new Api503Error(`Error en el servidor.`)
                                                                            return res.status(503).send(error)
                                                                        }
                                                                        return res.json({
                                                                            ok: true
                                                                        });
                                        
                                                                    })
                                                                }

                                                            })

                                                            
                                                        }
    
                                                    })
    
                                                   
                                            
                                                })
    
    
                                            }, err =>{
                                                let error = new Api503Error(`Error en el servidor.`)
                                                return res.status(503).send(error)
                                            }) 
                                         
                                            
                                        }
    
                                                
                                                /*
                                                for(let i = 0;i<result_archivos.length;i++){
                                                    let path = './uploads/' + result_archivos[i].nombre 
                            
                            
                                                    fs.unlink(path, (err) => {
                            
                                                        if (err) {
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            return res.status(503).send(error)
                                                          
                                                          //return 
                                                        }
                                                
                                                        
                                                
                                                    })
                                                }
    
                                                return res.json({
                                                    ok: true
                                                });
                                                */
                                            
                                            /*
                                            return res.json({
                                                ok: true
                                            });
                                            */
            
                                        
                                    
    
                                })
                                
    
    
                            }
    
                        })
            
                    }else{

                        let del_query2 = 
                                                            `
                                                                delete from indicador where id_indicador = $1
                                                            `

                                                            client.query(del_query2,[id_indicador],(err,result)=>{
                                                                if (err) {
                                                                    client.query('ROLLBACK', err => {
                                                     
                                                                        if(err){
                                                                            let error = new Api503Error(`Error en el servidor.`)
                                                                            return res.status(503).send(error)
                                                                        }else{
                                                                            let error = new Api503Error(`Error en el servidor.`)
                                                                            return res.status(503).send(error)
                                                                        }
                                                                    })
                                                                }else{
                                                                    client.query('COMMIT', err =>{
                                                                        if (err) {
                                                                             
                                                                             
                                                                            let error = new Api503Error(`Error en el servidor.`)
                                                                            return res.status(503).send(error)
                                                                        }
                                                                        return res.json({
                                                                            ok: true
                                                                        });
                                        
                                                                    })
                                                                }

                                                            })

                       
                    }
                    
                    
        
                    /*
                    client.query(select_query2,(err,result)=>{
        
                        if (err) {
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            
        
                            const nombre_archivos = result.rows
        
                            console.log(nombre_archivos)
        
                            
        
        
        
                        }
                    })*/
        
                    /*
                    let del_query = 
                    `   
                        delete from indicador where id_indicador = $1
                    `
        
                    return res.json({
                        ok: true
                    }); 
                    */
                }
        
            })
        }

    })
    


    


    
    /*
    client.query(del_query,[id_indicador],(err,result)=>{
        
        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            return res.json({
                ok: true
            }); 
        }

        
    });
    */
    
})

router.post('/deleteDocumentAsociado',(req,res)=>{ 
    let body = req.body

    let id_indicador = JSON.parse(body.id_indicador)
    let id_documento = JSON.parse(body.id_documento)


    let del_query = 
    `   
        delete from obtencionindicador where id_indicador = $1 and id_documento = $2
    `

    

    client.query(del_query,[id_indicador, id_documento],(err,result)=>{
        
        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            return res.json({
                ok: true
            }); 
        }

        
    });

    
})


router.post('/deleteDocumentAsociado2',(req,res)=>{ 
    let body = req.body
    
    let id_institucion = JSON.parse(body.id_institucion)
    let id_documento = JSON.parse(body.id_documento)

    
    

    let del_query = 
    `   
        delete from documentogenerado where id_servicio = $1 and id_documento = $2
    `

    

    client.query(del_query,[id_institucion, id_documento],(err,result)=>{
        
        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            return res.json({
                ok: true
            }); 
        }

        
    });

    
})


router.post('/deleteInstitucion',(req,res)=>{ 
    let body = req.body

    let id_servicio = JSON.parse(body.servicio)


    client.query('BEGIN', err =>{
        if(err){
             
             
            client.query('ROLLBACK', err => {
                 
                if(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }else{
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }
            })

        }else{
            let sel_query = 
            `   
                select distinct(id_documento)
                from documentogenerado
                where id_servicio = $1
            `
    
            client.query(sel_query,[id_servicio],(err,result)=>{
                if(err){
                     
                     
                    client.query('ROLLBACK', err => {
                         
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
        
                }else{
                    var text_documentos = ""
                
                    for(var i=0;i<result.rows.length;i++){
                    
                        
                        if(i+1>=result.rows.length){
                            text_documentos+= "id_documento = " +  + result.rows[i].id_documento
                        }else{
                            text_documentos+= "id_documento = " + result.rows[i].id_documento + " OR "
                        }
                    }
        
                    
        
                    let sel_query2 = 
                    `
                        SELECT distinct(id_indicador)
                        from obtencionindicador
                        where ${text_documentos}
                    `
                    client.query(sel_query2, (err,result2)=>{
                        if(err){
                             
                             
                            client.query('ROLLBACK', err => {
                                 
                                if(err){
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }
                            })
                
                        }else{
                            
                            var text_indicadores = ""
                            for(var i=0;i<result2.rows.length;i++){
                    
                        
                                if(i+1>=result2.rows.length){
                                    text_indicadores+= result2.rows[i].id_indicador
                                    //text_documentos+= "id_documento = " + "'" + result.rows[i].id_documento + "'"
                                }else{
                                    text_indicadores+= result2.rows[i].id_indicador + ","
                                    //text_documentos+= "id_documento = " + "'" + result.rows[i].id_documento + "' OR "
                                }
                            }

                            let del_query = 
                            `
                                delete from indicador where id_indicador IN (${text_indicadores})
                            `
                            
                            client.query(del_query, (err,result3)=>{
                                if(err){
                                    
                  
                                    client.query('ROLLBACK', err => {
                                         
                                        if(err){
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)
                                        }else{
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)
                                        }
                                    })
                        
                                }else{
                                    let del_query2 = 
                                    `
                                        delete from documentofuente where ${text_documentos}
                                    `
                
                                    client.query(del_query2, (err,result4)=>{
                                        if(err){
                                             
                                             
                                            client.query('ROLLBACK', err => {
                                                 
                                                if(err){
                                                    let error = new Api503Error(`Error en el servidor.`)
                                                    return res.status(503).send(error)
                                                }else{
                                                    let error = new Api503Error(`Error en el servidor.`)
                                                    return res.status(503).send(error)
                                                }
                                            })
                                
                                        }else{
                                            let del_query3 = 
                                            `
                                                delete from serviciofuente where id_servicio = $1
                                            `
                    
                                            client.query(del_query3, [id_servicio],(err,result4)=>{
                                                if(err){
                                                     
                                                     
                                                    client.query('ROLLBACK', err => {
                                                         
                                                        if(err){
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            return res.status(503).send(error)
                                                        }else{
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            return res.status(503).send(error)
                                                        }
                                                    })
                                        
                                                }else{
                                                    client.query('COMMIT', err =>{
                                                        if (err) {
                                                             
                                                             
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            return res.status(503).send(error)
                                                        }
                                                        return res.json({
                                                            ok: true
                                                        });
                        
                                                    })
                                                    
                                                }
                    
                                                
                    
                    
                    
                                            })
                                        }
                                    })
                
                                }
                                
                            })
            
                        }
        
                        
                    })
        
                }
                
            })
    
        }
        

    })
    
})

router.post('/deleteCategory',(req,res)=>{ 
    let body = req.body

    let id_categoria = JSON.parse(body.categoria)

    client.query('BEGIN', err =>{
        if(err){
            client.query('ROLLBACK', err => {
                if(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }else{
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }
            })

        }else{
            let sel_query = 
            `   
                select distinct(id_indicador)
                from indicadorcategorizado
                where id_categoria = $1
            `
            client.query(sel_query,[id_categoria],(err,result)=>{
                if(err){
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
                }else{
                    var id_indicadores = []
                    for(let i=0;i<result.rows.length;i++){
                        id_indicadores.push(result.rows[i].id_indicador)
                    }
                    let del_query =
                    `
                        delete from categoria where id_categoria = $1
                    ` 
        
                    client.query(del_query, [id_categoria], (err,result2)=>{
                        if(err){
                            client.query('ROLLBACK', err => {
                                if(err){
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }
                            })    
                        }else{
                            var text_indicadores = ""
                
                            for(var i=0;i<id_indicadores.length;i++){
                            
                                
                                if(i+1>=id_indicadores.length){
                                    text_indicadores+= id_indicadores[i]
                                }else{
                                    text_indicadores+= id_indicadores[i] + ","
                                }
                            }

                            let del_query2 = 
                                `
                                    DELETE FROM indicador where id_indicador IN (${text_indicadores})
                                `

                            client.query(del_query2, (err,result3)=>{
                                if(err){
                                    client.query('ROLLBACK', err => {
                                        if(err){
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)
                                        }else{
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)
                                        }
                                    })   
                                }else{
                                    client.query('COMMIT', err =>{
                                        if (err) {
                                             
                                             
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)
                                        }
                                        return res.json({
                                            ok: true
                                        });
        
                                    })
                                    

                                }
                            })
                            
                            
                        }
                    })
                }
            })

        }

    })
        
});



router.post('/deleteDocumento',(req,res)=>{ 
    let body = req.body

    let id_documento = JSON.parse(body.documento)

    client.query('BEGIN', err =>{
        if(err){
            client.query('ROLLBACK', err => {
                if(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }else{
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }
            })
        }else{
            let sel_query = 
            `   
                select count(*) as cuenta, distintos.id_indicador
                from(
                    select distinct(id_indicador)
                    from obtencionindicador
                    where id_documento = $1) as distintos, obtencionindicador as oi
                where oi.id_indicador = distintos.id_indicador
                group by distintos.id_indicador
                
            `
        
            client.query(sel_query,[id_documento],(err,result)=>{
                if (err) {
                     
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
                }else{
                    var text_indicadores = ""
                    for(var i=0;i<result.rows.length;i++){
                        if(i+1>=result.rows.length){
                            text_indicadores+= result.rows[i].id_indicador
                            //text_documentos+= "id_documento = " + "'" + result.rows[i].id_documento + "'"
                        }else{
                            text_indicadores+= result.rows[i].id_indicador + ","
                                    //text_documentos+= "id_documento = " + "'" + result.rows[i].id_documento + "' OR "
                        }
                    }

                    let del_query = 
                    `
                    delete from indicador where id_indicador IN (${text_indicadores})
                    `

                    client.query(del_query, (err,result3)=>{
                        if (err) {
                     
                            client.query('ROLLBACK', err => {
                                if(err){
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }
                            })
                        }else{
                            let del_query2 = 
                            `
                                delete from documentofuente where id_documento = $1
                            
                            `

                            client.query(del_query2, [id_documento], (err, result2)=>{
                                if (err) {
                                     
                                    client.query('ROLLBACK', err => {
                                        if(err){
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)
                                        }else{
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)
                                        }
                                    })
                                }else{
                                    client.query('COMMIT', err =>{
                                        if (err) {
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)        
                                        }else{
                                            return res.json({
                                                ok: true
                                            }); 
                                        }
                                    })
                                   
                                }
                            })

                        }

                    })
                }
            })
        }
    })  
})


router.post('/deleteFile',(req,res)=>{ 
    let body = req.body

    let id_archivo = JSON.parse(body.id_archivo)
    let nombre_archivo = JSON.parse(body.nombre)

    let del_query = 
    `   
        delete from archivo where id = $1
    `



    client.query(del_query,[id_archivo],(err,result)=>{
        
        if (err) {
             
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }

        var path = `./uploads/` + nombre_archivo

        fs.unlink(path, (err2, res2) => {

            if (err2) {
    
              
                return res.status(400).json({
                    ok: false,
                    err2
                });
            }else{
                res.json({
                    ok: true,
                    result: res2
                });
            }

    
        })
    });
})



router.post('/editIndicador',(req,res)=>{ 
    let body = req.body

    let id_indicador = JSON.parse(body.id_indicador)
    let new_nombre_indicador = JSON.parse(body.newName)
    let new_categoria = JSON.parse(body.newCategory)
    let new_documentos = JSON.parse(body.newDocumentos)
    let actual_id_categoria = JSON.parse(body.actual_id_categoria)


    client.query('BEGIN', err =>{
        if(err){
            client.query('ROLLBACK', err => {
                if(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }else{
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }
            })
        }else{
            let upd_query = 
            `   
                update indicador set nombre=$1 where id_indicador = $2
            `
            client.query(upd_query,[new_nombre_indicador, id_indicador],(err,result)=>{
        
                if(err){
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
                }else{
                    let upd_query2 = 
                    `
                        update indicadorcategorizado set id_categoria = $1 where id_indicador = $2 and id_categoria = $3
                    
                    `
        
                    client.query(upd_query2,[new_categoria,id_indicador,actual_id_categoria], (err,result2)=>{
                        if(err){
                            client.query('ROLLBACK', err => {
                                if(err){
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }
                            })
                        }else if(new_documentos.length>0){

                            let values = []
                            for(let i=0;i<new_documentos.length;i++){
                                let new_id_documento = new_documentos[i]
                                let new_array = [new_id_documento, id_indicador]
                                values.push(new_array)
                            }

                            let insert_query = 
                                `
                                    insert into obtencionindicador(id_documento,id_indicador) values %L
                                `
                            
                            client.query(format(insert_query, values),[],(err,result3)=>{
                                if(err){
                                    client.query('ROLLBACK', err => {
                                        if(err){
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)
                                        }else{
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)
                                        }
                                    })
                                }else{  
                                    client.query('COMMIT', err =>{
                                        if (err) {
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)        
                                        }else{
                                            return res.json({
                                                ok: true
                                            }); 
                                        }              
                                    })   
                                }
                            })
        
                           
                        }else{
                            client.query('COMMIT', err =>{
                                if (err) {
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)        
                                }else{
                                    return res.json({
                                        ok: true
                                    }); 
                                }              
                            })  
                        }
                    })
                }
        
                
            });

        }

    })
    
})

router.post('/editCategory',(req,res)=>{ 
    let body = req.body

    let id_categoria = JSON.parse(body.id_categoria)
    let nombre = JSON.parse(body.nombre)
    

    console.log(body)

    client.query('BEGIN', err =>{
        if(err){
            client.query('ROLLBACK', err => {
                if(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }else{
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }
            })
        }else{
            let upd_query = 
            `   
                update categoria set nombre = $1 where id_categoria = $2
            `
    
    
            client.query(upd_query,[nombre,id_categoria],(err,result)=>{
            
                if(err){
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
                }else{
                    client.query('COMMIT', err =>{
                        if (err) {
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)        
                        }else{
                            return res.json({
                                ok: true
                            }); 
                        }
                    })
                    
                }
        
                
            });
        }
        
    })
    

    
})

router.post('/editInstitucion',(req,res)=>{ 
    let body = req.body

     

    let id_institucion = JSON.parse(body.id_institucion)
    let new_nombre = JSON.parse(body.newName)
    let new_documents = JSON.parse(body.documentosNuevos)


    
    
    
    client.query('BEGIN', err =>{
        if(err){
            client.query('ROLLBACK', err => {
                if(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }else{
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }
            })
        }else{
            let upd_query = 
            `   
                update serviciofuente set institucion = $1 where id_servicio = $2
            `
                
            client.query(upd_query,[new_nombre,id_institucion], (err,result)=>{
                
                if(err){
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
                }else if(new_documents.length > 0){


                    let values = []

                    for(let i=0;i<new_documents.length;i++){

                        let new_id_documento = new_documents[i]
                        let new_array = [id_institucion, new_id_documento]
                        values.push(new_array)

                    }

                    let insert_query = 
                        `
                            insert into documentogenerado(id_servicio, id_documento) values %L
                        `
                    client.query(format(insert_query, values), [],(err, result2)=>{
                        if(err){
                            client.query('ROLLBACK', err => {
                                if(err){
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }
                            })
                        }else{
                            client.query('COMMIT', err =>{
                                if (err) {
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    return res.json({
                                        ok: true
                                    }); 
                                }
                                
                                
                            })
                        }
                    })                        
                   
        
                    
                    
                    
                }else{
                    client.query('COMMIT', err =>{
                        if (err) {
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            return res.json({
                                ok: true
                            }); 
                        }
                        
                        
                    })
                }
        
                
            });
        }
    })
    
    

    
})


router.post('/editDocumento',(req,res)=>{ 
    let body = req.body

     

    let id_documento = JSON.parse(body.id_documento)
    let new_nombre = JSON.parse(body.nuevoName)
    let servicios_nuevos = JSON.parse(body.serviciosNuevos)
    //let servicio_antiguo = JSON.parse(body.servicioAntiguo)

    

    client.query('BEGIN', err =>{
        if(err){
            client.query('ROLLBACK', err => {
                if(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }else{
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }
            })
        }else{
            let upd_query = 
            `   
                update documentofuente set nombre = $1 where id_documento = $2
            `
                
            client.query(upd_query,[new_nombre,id_documento], (err,result)=>{
                
                if(err){
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
                }else if(servicios_nuevos.length > 0){

                    let values = []

                    for(let i=0;i<servicios_nuevos.length;i++){

                        let new_id_servicio = servicios_nuevos[i]
                        let new_array = [new_id_servicio,id_documento]
                        values.push(new_array)

                    }

                    let insert_query = 
                        `
                            insert into documentogenerado(id_servicio, id_documento) values %L
                        `
                    client.query(format(insert_query, values), [],(err, result2)=>{
                        if(err){
                            client.query('ROLLBACK', err => {
                                if(err){
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }
                            })
                        }else{
                            client.query('COMMIT', err =>{
                                if (err) {
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    return res.json({
                                        ok: true
                                    }); 
                                }
                                
                                
                            })
                        }
                    })                        
                   

                    /*
                    let upd_query2 = 
                    `
                        update documentogenerado set id_servicio = $1 where id_documento = $2 and id_servicio = $3
                    `

                    client.query(upd_query2, [servicio_nuevo, id_documento,servicio_antiguo ],(err,result)=>{
                        if(err){
                            client.query('ROLLBACK', err => {
                                if(err){
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }
                            })
                        }else{
                            client.query('COMMIT', err =>{
                                if (err) {
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    return res.json({
                                        ok: true
                                    }); 
                                }
                                
                                
                            })
                            
                            
                        }
                    })
                
                    */
                    
                    
                }else{
                    client.query('COMMIT', err =>{
                        if (err) {
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            return res.json({
                                ok: true
                            }); 
                        }
                        
                        
                    })
                }

                
            });
        }
    })

})







module.exports = router;