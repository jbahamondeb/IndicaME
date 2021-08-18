const express = require('express');
var router = express.Router()
const client = require ('../dbb');


var format = require('pg-format');

const Api400Error = require('../errorHandler/api400Error')
const Api10000Error = require('../errorHandler/api10000Error')
const Api503Error = require('../errorHandler/api503Error')

router.post('/addCategorie',(req,res)=>{  

    
    var name_categorie = req.body.categoria; 

    name_categorie = JSON.parse(name_categorie)

    //name_categorie = name_categorie.replace('"','')



    // 


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
            let select_query2=
            `
                SELECT *
                FROM categoria
                WHERE nombre = $1
            `


            client.query(select_query2, [name_categorie], (err,result3)=>{
                if(err){
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
        
                }else{
                    if(result3.rows.length == 1){
                        let error = new Api400Error(`La categoría ${name_categorie} ya existe.`)
                            
                        return res.status(400).send(error)
                            
                    }else{
                        
                
                    
                          
                      
                    
                                let insert_query = 
                                    `
                                        INSERT INTO categoria(nombre) values($1)
                                    `
                    
                                client.query(insert_query,[name_categorie],(err,result4)=>{
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
                                                    ok: true,
                                                    response: "Categoría añadida correctamente."
                                                });
                                            }
                                                        
                                                        
                                        })    
                                    }
                                            
                                                
                                               
                                })  
                            
                                    
                                    
                            
                        
                    }   
                }
                    
                
            })
        }

        
        
    })
})


router.post('/addService',(req,res)=>{  
    var name_servicio = req.body.servicio; 

    name_servicio = JSON.parse(name_servicio)

    //name_categorie = name_categorie.replace('"','')

    


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
            let select_query2=
            `
                SELECT *
                FROM serviciofuente
                WHERE institucion = $1
            `
            client.query(select_query2, [name_servicio], (err,result3)=>{
                if(err){
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
        
                }else{
                    if(result3.rows.length == 1){
                        let error = new Api400Error(`La institución ${name_servicio} ya existe.`)
                            
                        return res.status(400).send(error)
    
                    }else{
                       
                    
                            
                               
                                let insert_query = 
                                    `
                                        INSERT INTO serviciofuente(institucion) values($1)
                                    `
        
                                client.query(insert_query,[name_servicio],(err,result2)=>{
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
                                                    ok: true,
                                                    response: "Institución añadida correctamente."
                                                });
                                                    
                                            }
                                                    
                                        })  
                                    }          
                                             
                                })
                                  
                            
                                    
                        
                    }
                }

                
                
            })
        }

       
        
    })
})

router.post('/addDocument',(req,res)=>{  

   
    var name_documento = req.body.documento; 
    
    name_documento = JSON.parse(name_documento)


    var name_institucion = req.body.institucion

    name_institucion = JSON.parse(name_institucion)

    var url_documento = req.body.url

    url_documento = JSON.parse(url_documento)

    //var formatos_documento = req.body.formatos 
    var formatos_documento = req.body.formatos
    
    formatos_documento = JSON.parse(formatos_documento)

    //name_categorie = name_categorie.replace('"','')

  
    client.query('BEGIN', err =>{
        if(err){
            client.query('ROLLBACK', err => {
                if(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }
            })

        }else{
            let select_query2=
            `
                SELECT *
                FROM documentofuente
                WHERE nombre = $1
            `
        
            client.query(select_query2, [name_documento], (err,result3)=>{
                if(err){
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
        
                }else{
                    if(result3.rows.length == 1){
                        let error = new Api400Error(`El Documento ${name_documento} ya existe.`)
                        return res.status(400).send(error)
                    }else{
                        
                           
                
                            let insert_query = 
                                `
                                    INSERT INTO documentofuente(nombre,url) values($1, $2) RETURNING id_documento
                                `
                
                            client.query(insert_query,[name_documento, url_documento],(err,result2)=>{
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
                                    let insert_query2 =
                                    `
                                        INSERT INTO documentogenerado values ($1, $2)      
                                    `
                
                                    client.query(insert_query2, [name_institucion, result2.rows[0].id_documento], (err, result3)=>{
                                        if(err){
                                            client.query('ROLLBACK', err => {
                                                if(err){
                                                    let error = new Api503Error(`Error en el servidor.`)
                                                    return res.status(503).send(error)
                                                }
                                            })
                                
                                        }
        
                                        let values = []
                                        for(let i=0;i<formatos_documento.length;i++){
                                            let id_formato = formatos_documento[i]
                                            let new_array = [result2.rows[0].id_documento, id_formato]
                                            values.push(new_array)
                                        }       
                                        let insert_query3=
                                            `
                                                INSERT INTO formatodocumento values %L
                                            `    
                                        client.query(format(insert_query3, values), [],(err, result4)=>{
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
                                                            ok: true,
                                                            response: "Documento añadido correctamente."
                                                        });
                                                    }
                                                    
                                                    
                                                })
                                            }
                                            
                                        })
        
                                    })
                                } 
                            })
                        
                    }
    
                }


            })
        }
    })
})

router.post('/addIndicador',(req,res)=>{  
    var name_indicador = req.body.indicador; 

    name_indicador = JSON.parse(name_indicador)


    var id_categoria = req.body.categoria

    id_categoria = JSON.parse(id_categoria)

    var documento = req.body.documento

    documento = JSON.parse(documento)


    client.query('BEGIN', err =>{
        if(err){
            client.query('ROLLBACK', err => {
                if(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }
            })

        }else{
            let select_query2=
            `
                SELECT *
                FROM indicador
                WHERE nombre = $1
            `
            client.query(select_query2, [name_indicador], (err,result3)=>{
                if(err){
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                    })
        
                }else{
                    if(result3.rows.length == 1){
                        let error = new Api400Error(`El Indicador ${name_indicador} ya existe.`)
                        return res.status(400).send(error)
                    }else{
                        let insert_query = 
                        `
                            INSERT INTO indicador(nombre) values($1) RETURNING id_indicador
                        `
                        client.query(insert_query,[name_indicador],(err,result2)=>{
                            if(err){
                                client.query('ROLLBACK', err => {
                                    if(err){
                                        let error = new Api503Error(`Error en el servidor.`)
                                        return res.status(503).send(error)
                                    }
                                })
                    
                            }else{
                                let id_indicador = result2.rows[0].id_indicador
                                let insert_query2 =
                                `
                                    INSERT INTO indicadorcategorizado(id_categoria, id_indicador) values ($1, $2)
                                `
                                client.query(insert_query2, [id_categoria, id_indicador], (err,result3)=>{
                                    if(err){
                                        client.query('ROLLBACK', err => {
                                            if(err){
                                                let error = new Api503Error(`Error en el servidor.`)
                                                return res.status(503).send(error)
                                            }
                                        })
                            
                                    }else{
                                        let insert_query3 = `
                                        INSERT INTO obtencionindicador(id_documento,id_indicador) values($1,$2)
                                        `
                                        client.query(insert_query3,[documento, id_indicador],(err, result4)=>{
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
                                                            ok: true,
                                                            response: id_indicador
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
                }

    
            })
        }
        
    })

})



module.exports = router;