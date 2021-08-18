const express = require('express');
var router = express.Router()
const client = require ('../dbb');

const jwt = require('jsonwebtoken')
const config = require("../auth.config");

const Api400Error = require('../errorHandler/api400Error')
const Api10000Error = require('../errorHandler/api10000Error')
const Api503Error = require('../errorHandler/api503Error')
const Api404Error = require('../errorHandler/api404Error')
const Api410Error = require('../errorHandler/api410Error')

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });


router.post('/newRequest/',(req,res)=>{
    let correo = JSON.parse(req.body.correo)
    correo = correo.toLowerCase()
    let pass = JSON.parse(req.body.pass)
    let nombre = JSON.parse(req.body.nombre)
    let apellidop = JSON.parse(req.body.apellidop)
    let apellidom = JSON.parse(req.body.apellidom)
    let telefono = JSON.parse(req.body.telefono )
    let motivacion = JSON.parse(req.body.motivacion)

    if(telefono[0] == ' '){
        telefono = telefono.replace(' ','+')
    }

   
    

    client.query('BEGIN', err =>{
        let select_query = 
        `
            select * 
            from personalcapacitado
            where mail = $1 
        `
        client.query(select_query,[correo],(err,result)=>{
    
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
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            let error = new Api400Error(`El correo ${correo} ya está en uso.`)
                                
                            return res.status(400).send(error)
                        }
                    })

                    
                    
                }else{
                    let select_query2 = 
                    `
                        select * 
                        from espera
                        where correo = $1 
                    `
    
                    client.query(select_query2,[correo],(err,result2)=>{
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
                            if(result2.rows.length > 0){
                                client.query('ROLLBACK', err => {
                                    if(err){
                                        let error = new Api503Error(`Error en el servidor.`)
                                        return res.status(503).send(error)
                                    }else{
                                        let error = new Api400Error(`El correo ${correo} ya está en uso.`)
                                            
                                        return res.status(400).send(error)
                                    }
                                })

                                
                            }else{
    
                                //const token = jwt.sign({email: correo}, config.secret, { expiresIn: "60s" })
    
                                let insert_query = 
                                `
                                    insert into espera(correo, pass, nombre, apellidop, apellidom, telefono, motivacion, estado)
                                    values ($1,crypt($2, gen_salt('bf')), $3, $4, $5, $6, $7, 1)
                                `
    
    
                                client.query(insert_query, [correo, pass,nombre,apellidop,apellidom,telefono,motivacion],(err, result3)=>{
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
                                                transport.sendMail({
                                                    from: config.user,
                                                    to: correo,
                                                    subject: "[IndicaME] SOLICITUD DE INGRESO EN ESPERA.",
                                                    html: `<p>Hola, </p>
                                                            
                                                            
                                                            <p>Su solicitud para ser parte del proyecto IndicaME, se encuentra en proceso de aceptación. </p>
                                                            
                                                            
                                                            <p>Por favor mantente atento a este correo.</p>
                                                            
                                                            
                                                            <p>Gracias,</p>
                                                            
                                                            
                                                            <p>Equipo de IndicaME</p>
                                                        `,
                                                  }, (errorMail, resultMail)=>{
                                                      if(errorMail){
                                                        let error = new Api400Error(`Error al enviar el correo para informar de estado de la solicitud.`)
                                        
                                                        return res.status(400).send(error)
                                                      }else{
                                                        res.json({
                                                            ok: true,
                                                            message: 'Éxito al enviar correo'
                                                        });
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
                
            }
    
            
            
    
        });
    })
    


    




})


router.get('/getNotifications/',(req,res)=>{

    let select_query=`SELECT * FROM espera where estado = 1`;
    
    client.query(select_query,(err,result)=>{

        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            res.json({
                ok: true,
                result: result.rows.length
            });
        }

        
        

    });


})


router.get('/getAllRequest/',(req,res)=>{

    let select_query=`
    
    
    SELECT id, correo, concat(nombre, ' ', apellidop, ' ', apellidom) as nombre, telefono, motivacion
    FROM espera
    where estado = 1`;
    
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

router.post('/recoverPassword/',(req,res)=>{

    let correo = JSON.parse(req.body.correo)
    correo = correo.toLowerCase()
    let pass = JSON.parse(req.body.pass)

    let select_query =
    `
        select *
        from personalcapacitado
        where mail = $1
    `

    client.query(select_query, [correo],(err2,result2)=>{
        if(err2){
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            if(result2.rows.length>0){


                let select_query2 = 
                `
                    select * 
                    from changepassword
                    where correo = $1
                `

                client.query(select_query2,[correo],(err3,result3)=>{
                    if (err3) {
                        let error = new Api503Error(`Error en el servidor.`)
                        return res.status(503).send(error)
                    }else{
                        if(result3.rows.length>0){

                            let del_query = 
                            `
                                delete from changepassword where correo = $1
                            `

                            client.query(del_query, [correo], (err4,result4)=>{
                                if(err4){
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    const token = jwt.sign({email: correo}, config.secret, { expiresIn: "24h" })

                                    let insert_query=
                                    `
                                        INSERT INTO changepassword(correo,pass,confirmationcode) VALUES ($1,crypt($2, gen_salt('bf')),$3)
                                    
                                    `
                                
                                    client.query(insert_query, [correo, pass, token],(err,result)=>{
                                        if (err) {
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)
                                        }else{
                                            transport.sendMail({
                                                from: config.user,
                                                to: correo,
                                                subject: "[IndicaME] SOLICITUD DE CAMBIO DE CONTRASEÑA.",
                                                html: `<p>Hola, </p>
                                                        
                                                        
                                                        <p>Alguien ha solicitado un cambio de contraseña para la cuenta asociada a este correo. </p>
                                                        
                                                        <p>Ingresa a este link para verificar el cambio de contraseña. Tiene una duración de 24hrs. Si no ingresas en 24hrs, debes solicitar un nuevo cambio de contraseña.</p>
                                        
                                                        <a href=http://localhost:3000/request/confirmChange/${token}>Click acá</a>
                                        
                                                        <p>Si no has sido tu, por favor ignora este correo.</p>
                                                        
                                                        
                                                        <p>Gracias,</p>
                                                        
                                                        
                                                        <p>Equipo de IndicaME</p>
                                                    `,
                                              }, (errorMail, resultMail)=>{
                                                  if(errorMail){
                                                    let error = new Api400Error(`Error al enviar el correo para confirmar cambio de contraseña.`)
                            
                                                    return res.status(400).send(error)
                                                  }else{
                                                    res.json({
                                                        ok: true,
                                                        message: 'Éxito al enviar correo'
                                                    });
                                                  }
                                              })
                                        }
                                    })
                                }
                            })

                            
                        }else{
                            const token = jwt.sign({email: correo}, config.secret, { expiresIn: "24h" })

                            let insert_query=
                            `
                                INSERT INTO changepassword(correo,pass,confirmationcode) VALUES ($1,crypt($2, gen_salt('bf')),$3)
                            
                            `
                        
                            client.query(insert_query, [correo, pass, token],(err,result)=>{
                                if (err) {
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)
                                }else{
                                    transport.sendMail({
                                        from: config.user,
                                        to: correo,
                                        subject: "[IndicaME] SOLICITUD DE CAMBIO DE CONTRASEÑA.",
                                        html: `<p>Hola, </p>
                                                
                                                
                                                <p>Alguien ha solicitado un cambio de contraseña para la cuenta asociada a este correo. </p>
                                                
                                                <p>Ingresa a este link para verificar el cambio de contraseña. Tiene una duración de 24hrs. Si no ingresas en 24hrs, debes solicitar un nuevo cambio de contraseña.</p>
                                
                                                <a href=http://localhost:3000/request/confirmChange/${token}>Click acá</a>
                                
                                                <p>Si no has sido tu, por favor ignora este correo.</p>
                                                
                                                
                                                <p>Gracias,</p>
                                                
                                                
                                                <p>Equipo de IndicaME</p>
                                            `,
                                      }, (errorMail, resultMail)=>{
                                          if(errorMail){
                                            let error = new Api400Error(`Error al enviar el correo para confirmar cambio de contraseña.`)
                            
                                            return res.status(400).send(error)
                                          }else{
                                            res.json({
                                                ok: true,
                                                message: 'Éxito al enviar correo'
                                            });
                                          }
                                      })
                                }
                            })
                        }
                    }
                })


                
            }else{
                let error = new Api404Error(`Correo inexistente en el sistema.`)
                return res.status(404).send(error)
            }
        }
    })

    



    

    /*
    let select_query=`
    
    
    SELECT id, correo, concat(nombre, ' ', apellidop, ' ', apellidom) as nombre, telefono, motivacion
    FROM espera
    where estado = 1`;
    
    client.query(select_query,(err,result)=>{

        if (err) {
            
            return res.status(400).json({
                ok: false,
                err
            });
        }else{
            res.json({
                ok: true,
                result: result.rows
            });
        }

        
        

    });*/


})

router.get('/acceptRequest/:id',(req,res)=>{
    let id_espera = req.params.id

    client.query('BEGIN', err =>{
        let upd_query = 
        `
            update espera set estado = 2 where id = $1
        `

        client.query(upd_query, [id_espera], (err,result)=>{
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

                let select_query = 
                `
                    select correo
                    from espera
                    where id = $1
                `

                client.query(select_query, [id_espera],(err,result2)=>{
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

                        if(result2.rows.length > 0){
                            let user = result2.rows[0]
                            const token = jwt.sign({email: user.correo}, config.secret, { expiresIn: "24h" })

                            let upd_query = 
                            `
                                update espera set confirmationcode = $1 where id = $2
                            `

                            client.query(upd_query, [token, id_espera],(err,result3)=>{
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
                                            transport.sendMail({
                                                from: config.user,
                                                to: user.correo,
                                                subject: "[IndicaME] SOLICITUD DE INGRESO APROBADA.",
                                                html: `<p>Hola, </p>
                                                        
                                                        
                                                        <p>Su solicitud para ser parte del proyecto IndicaME, ha sido aprobada. </p>
                                                        
                                                        
                                                        <p>Ingresa a este link para verificar tu correo. Tiene una duración de 24hrs. Si no ingresas en 24hrs, debes solicitar un registro nuevamente.</p>
                    
                                                        <a href=http://localhost:3000/request/confirm/${token}>Click acá</a>
                    
                                                        <p>Si tu no solicitaste una cuenta para el proyecto IndicaME, por favor ignora este correo.</p>
                                                        
                                                        <p>Gracias,</p>
                                                        
                                                        
                                                        <p>Equipo de IndicaME</p>
                                                    `,
                                            }, (errorMail, resultMail)=>{
                                                if(errorMail){
                                                    let error = new Api400Error(`Error al enviar el correo para informar que se aprobó la solicitud de ingreso..`)
                                    
                                                    return res.status(400).send(error)
                                                  }else{
                                                    res.json({
                                                        ok: true,
                                                        message: 'Éxito al enviar correo'
                                                    });
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
    


})


router.get('/confirmChange/:token',(req,res)=>{



  

    
    let token = req.params.token

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {

            let del_query = 
            `
                delete from changepassword where confirmationcode = $1
            
            `

            client.query(del_query, [token], (errToken, respToken)=>{
                if(errToken){
                    
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)        
        
                   
                }else{
                    
                    let error = new Api410Error(`El correo de confirmación ha expirado`)
                    return res.status(503).send(error) 
                    
                    
                    
                }
            })

            
           

            
        }else{

            client.query('BEGIN', err =>{
                let select_query=
                `
                    select * 
                    from changepassword
                    where confirmationcode = $1
                `
            
                client.query(select_query, [token], (err, result)=>{
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
                        
                        
                        if(result.rows.length>0){
                            let datos_usuarios = result.rows[0]
                            
                            
                            
                            let upd_query = 
                            `
                                update personalcapacitado set pass = $1 where mail = $2
                            `
    
                       
            
                            client.query(upd_query, [datos_usuarios.pass, datos_usuarios.correo],(err,result2)=>{
            
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
                                    
                                    let del_query = 
                                    `
                                        delete from changepassword where id=$1
                                    `
            
                                    client.query(del_query,[datos_usuarios.id],(err,result3)=>{
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
                                                    return res.redirect('http://localhost:4200/pages/dashboard');
                                                }
                                            })
                                            
                                        }
                                    })
                                }
                            })
                        }
            
                        
                       
                    }
                })
            })
            
        }
       
       
    });
    


})

router.get('/confirm/:token',(req,res)=>{



  

    
    let token = req.params.token

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {

            let del_query = 
            `
                delete from espera where confirmationcode = $1 and estado = 2
            
            `

            client.query(del_query, [token], (errToken, respToken)=>{
                if(errToken){
                    
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)   
        
                   
                }else{
                    
                    let error = new Api410Error(`El correo de confirmación ha expirado`)
                    return res.status(503).send(error) 
                    
                    
                }
            })

            
           

            
        }else{

            client.query('BEGIN', err =>{
                let select_query=
                `
                    select * 
                    from espera
                    where confirmationcode = $1 and estado = 2
                `
            
                client.query(select_query, [token], (err, result)=>{
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
                        
                        
                            let datos_usuarios = result.rows[0]
            
                            let insert_query = 
                            `
                                insert into personalcapacitado(pass, mail, nombre, apellidop, apellidom, tipo, telefono)
                                values($1,$2,$3,$4,$5,2,$6)
                            `
            
                            client.query(insert_query, [datos_usuarios.pass, datos_usuarios.correo,datos_usuarios.nombre, 
                                datos_usuarios.apellidop, datos_usuarios.apellidom, datos_usuarios.telefono],(err,result2)=>{
            
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
                                    let del_query = 
                                    `
                                        delete from espera where id=$1
                                    `
            
                                    client.query(del_query,[datos_usuarios.id],(err,result3)=>{
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
                                                    return res.redirect('http://localhost:4200/pages/dashboard');
                                                }
                                                            
                                                            
                                            })    
                                            
                                        }
                                    })
                                }
                            })
                        
            
                        
                       
                    }
                })
            })

            
        }
       
       
    });
    
    
    /*
    let del_query = 
    `
        delete from espera where id=$1
    `

    client.query(del_query,[id_espera],(err3,result3)=>{
        if(err3){
            return res.status(400).json({
                ok: false,
                err3
            });
        }else{
            res.json({
                ok: true,
                result: result3.rows
            });
        }
    })
    */
    


})

router.get('/acceptRequest2/:id',(req,res)=>{
    let id_espera = req.params.id

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
            let select_query=`
            select * 
            from espera
            where id = $1
        
        `;
        
            client.query(select_query,[id_espera],(err,result)=>{
        
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
                    
        
                    
                        let datos_usuarios = result.rows[0]
        
                        let insert_query = 
                        `
                            insert into personalcapacitado(pass, mail, nombre, apellidop, apellidom, tipo, telefono)
                            values($1,$2,$3,$4,$5,2,$6)
                        `
        
                        client.query(insert_query, [datos_usuarios.pass, datos_usuarios.correo,datos_usuarios.nombre, 
                            datos_usuarios.apellidop, datos_usuarios.apellidom, datos_usuarios.telefono],(err,result2)=>{
        
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
                                let del_query = 
                                `
                                delete from espera where id=$1
                                `
        
                                client.query(del_query,[id_espera],(err,result3)=>{
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
                                                res.json({
                                                    ok: true,
                                                    result: result3.rows
                                                });
                                            }
                                                        
                                                        
                                        })  
                                        
                                    }
                                })
                            }
                        })
                    
        
                    
                }
        
                
                
        
            });
        }
    })
    


})



router.post('/denyRequest/',(req,res)=>{

    

    let id_espera = parseInt(JSON.parse(req.body.id))
    let motivo = JSON.parse(req.body.motivo)
    let correo = JSON.parse(req.body.correo)

    
    
    

    let del_query = 
    `
        delete from espera where id=$1
    `

    client.query(del_query,[id_espera],(err3,result3)=>{
        if(err3){
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)        
        }else{

            transport.sendMail({
                from: config.user,
                to: correo,
                subject: "[IndicaME] SOLICITUD DE INGRESO RECHAZADA.",
                html: `<p>Hola, </p>
                        
                        
                        <p>Lamentamos informarte que tu solicitud para ser parte del proyecto IndicaME, ha sido rechazada. </p>
                        
                        
                        <p>Los motivos son los siguientes: </p>
                        
                        <p>" ${motivo} "</p>
                        
                        <p>Lo lamentamos, intentalo nuevamente</p>
                        
                        
                        <p>Equipo de IndicaME</p>
                    `,
              }, (errorMail, resultMail)=>{
                    if(errorMail){
                        let error = new Api400Error(`Error al enviar el correo para informar que se rechazó la solicitud de ingreso..`)
        
                        return res.status(400).send(error)
                    }else{
                        res.json({
                            ok: true,
                            message: 'Éxito al enviar correo'
                        });
                    }
              })

           
        }
    })
    
    


})

module.exports = router;