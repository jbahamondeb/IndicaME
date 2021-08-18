
const express = require('express');
var router = express.Router()
const client = require ('../dbb');

const Api400Error = require('../errorHandler/api400Error')
const Api10000Error = require('../errorHandler/api10000Error')
const Api503Error = require('../errorHandler/api503Error')
const Api404Error = require('../errorHandler/api404Error')

router.get('/getIndicadoresPerCategories',(req,res)=>{
    let select_query=`SELECT c.nombre, count(c.nombre) as n_indicadores
    FROM indicadorcategorizado as ic, indicador as i, categoria as c
    WHERE ic.id_indicador = i.id_indicador and c.id_categoria = ic.id_categoria
    group by c.nombre
    order by c.nombre`;

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


function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  }


router.get('/getNIndicadoresPerYearAndCategories/:anyo_in/:anyo_fin',(req,res)=>{
    let anyo_in = parseInt(req.params.anyo_in);
    let anyo_fin = parseInt(req.params.anyo_fin);

    var array_years = range(anyo_in, anyo_fin)

    var n_years = array_years.length;

    text_consulta1 = `
    select *
    from(
    `

    text_consulta = ""

    for(let i = 0;i<n_years;i++){
        if(i+1>=n_years){

            text_consulta+= `
            select *
            from(
                select c.nombre, 
                    CASE WHEN anyo is NULL then ${array_years[i]} ELSE anyo end as anyo,
                        CASE WHEN conteos.n_indicadores is NULL then 0 ELSE conteos.n_indicadores end as n_indicadores
                from(
                    select anyo, ic.id_categoria, count(*) as n_indicadores
                    from(
            
                        Select distinct(T.id_indicador) as id_indicador, ${array_years[i]} as anyo
                        from indicadorobtencionfecha as T
                        WHERE T.fecha_inicio <= ${array_years[i]} and T.fecha_fin >= ${array_years[i]}) as distintos,
                        indicadorcategorizado as ic
                    where distintos.id_indicador = ic.id_indicador
                    group by ic.id_categoria, anyo) as conteos 
                RIGHT JOIN categoria as c 
                on conteos.id_categoria = c.id_categoria
                order by c.nombre) as tabla1
                
                `


           // text_consulta+= "provincia = " + "'" + array_response[i] + "'"
        }else{

            text_consulta+= 
            `
            
            
            select *
            from(
                select c.nombre, 
                        CASE WHEN anyo is NULL then ${array_years[i]} ELSE anyo end as anyo,
                        CASE WHEN conteos.n_indicadores is NULL then 0 ELSE conteos.n_indicadores end as n_indicadores
                from(
                    select anyo, ic.id_categoria, count(*) as n_indicadores
                    from(
            
                        Select distinct(T.id_indicador) as id_indicador, ${array_years[i]} as anyo
                        from indicadorobtencionfecha as T
                        WHERE T.fecha_inicio <= ${array_years[i]} and T.fecha_fin >= ${array_years[i]}) as distintos,
                        indicadorcategorizado as ic
                    where distintos.id_indicador = ic.id_indicador
                    group by ic.id_categoria, anyo) as conteos 
                RIGHT JOIN categoria as c 
                on conteos.id_categoria = c.id_categoria
                order by c.nombre) as tabla1
                
                UNION
            `

            //text_consulta+= "provincia = " + "'" + array_response[i] + "' UNION "
        }
        


    }


    text_consulta_final = text_consulta1 + text_consulta + `
    ) as resultado 
    order by resultado.nombre
    
    `

    

    console.log(text_consulta_final)

    client.query(text_consulta_final,(err,result)=>{
        if (err) {
            
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)

        }else{
            
            res.json({
                ok: true,
                result: result.rows
            });
        }

    })

})



router.get('/getDataRegion/:cod_region/:anyo_in/:anyo_fin',(req,res)=>{


    let cod_region = req.params.cod_region;
    let anyo_in = req.params.anyo_in;
    let anyo_fin = req.params.anyo_fin;


    
    
    

    let flag = true;
    if(anyo_in == -1 && anyo_fin == -1){
        flag = false;

    }

    let select_query = 
    `
        select cod 
        from provincia
        where region = $1

    
    `

    client.query(select_query,[cod_region],(err,result)=>{

        if (err) {
            
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)

        }else{
            var array_response = []
            array_response.push(cod_region)
            for(let i=0;i<result.rows.length;i++){
                array_response.push(result.rows[i].cod)
            }

            var n_provincias = array_response.length;
            text_provincias = ""
            for(var i=0;i<n_provincias;i++){
           

                if(i+1>=n_provincias){
                    text_provincias+= "provincia = " + "'" + array_response[i] + "'"
                }else{
                    text_provincias+= "provincia = " + "'" + array_response[i] + "' OR "
                }
            }

            let select_query2 = 
            `
                select cod
                from comuna
                where ${text_provincias}
            `

            client.query(select_query2,(err,result)=>{
                if (err) {
                    
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }else{

                    for(let i=0;i<result.rows.length;i++){
                        array_response.push(result.rows[i].cod)
                    }
                  

                    var n_zonas = array_response.length;
                    text_zonas = ""

                    for(var i=0;i<n_zonas;i++){
           

                        if(i+1>=n_zonas){
                            text_zonas+= "id_zona = " + "'" + array_response[i] + "'"
                        }else{
                            text_zonas+= "id_zona = " + "'" + array_response[i] + "' OR "
                        }
                    }
                    
                    if(flag){
                        texto_consulta = "fecha_inicio >= '" + anyo_in + "' and fecha_fin <= '" + anyo_fin + "'"
                        /*
                        if(anyo_in == anyo_fin){
                            texto_consulta = "fecha_inicio >= '" + anyo_in + "' or fecha_fin <= '" + anyo_fin+"'"
                        }else{
                            
                        }
                        */
                        
                        let select_query3 =
                        `
                            select c.nombre, 
                            CASE WHEN conteos.n_indicadores is NULL then 0 ELSE conteos.n_indicadores end as n_indicadores
                            from(
                                select ic.id_categoria, count(*) as n_indicadores
                                from(
                                    select distinct(id_indicador)
                                    from indicadorobtencionfecha
                                    where (${text_zonas}) and (${texto_consulta})) as i, indicadorcategorizado as ic
                                where i.id_indicador = ic.id_indicador
                                group by ic.id_categoria) as conteos
                            RIGHT JOIN categoria as c 
                            on conteos.id_categoria = c.id_categoria
                            order by c.nombre
                        
                        `

                        client.query(select_query3,(err,result)=>{
                            if (err) {
                                
                                let error = new Api503Error(`Error en el servidor.`)
                                return res.status(503).send(error)
                            }else{
                                
                                res.json({
                                    ok: true,
                                    result: result.rows
                                });
                            }
                        })

                    }else{


                        
                        let select_query3 =
                        `
                            select c.nombre, 
                            CASE WHEN conteos.n_indicadores is NULL then 0 ELSE conteos.n_indicadores end as n_indicadores
                            from(
                                select ic.id_categoria, count(*) as n_indicadores
                                from(
                                    select distinct(id_indicador)
                                    from indicadorobtencionfecha
                                    where ${text_zonas}) as i, indicadorcategorizado as ic
                                where i.id_indicador = ic.id_indicador
                                group by ic.id_categoria) as conteos
                            RIGHT JOIN categoria as c 
                            on conteos.id_categoria = c.id_categoria
                            order by c.nombre
                        
                        `
                        client.query(select_query3,(err,result)=>{
                            if (err) {
                                
                                let error = new Api503Error(`Error en el servidor.`)
                                return res.status(503).send(error)
                            }else{
                                
                                res.json({
                                    ok: true,
                                    result: result.rows
                                });
                            }
                        })

                    }

                    



                    /*
                    return res.json({
                        ok: true,
                        response: array_response
                    });*/

                }

            })


        }
    })


    /*
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
    */

})


router.get('/getDataProvincia/:cod_provincia/:anyo_in/:anyo_fin',(req,res)=>{


    let cod_provincia = req.params.cod_provincia;
    let anyo_in = req.params.anyo_in;
    let anyo_fin = req.params.anyo_fin;


    
    
    

    let flag = true;
    if(anyo_in == -1 && anyo_fin == -1){
        flag = false;

    }
    /*
    for(var i=0;i<n_provincias;i++){
           

        if(i+1>=n_provincias){
            text_provincias+= "provincia = " + "'" + array_response[i] + "'"
        }else{
            text_provincias+= "provincia = " + "'" + array_response[i] + "' OR "
        }
    }

    */
    let select_query2 = 
            `
                select cod
                from comuna
                where provincia = $1
            `
    client.query(select_query2,[cod_provincia],(err,result)=>{
        if (err) {
            
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            var array_response = []
            array_response.push(cod_provincia)
            for(let i=0;i<result.rows.length;i++){
                array_response.push(result.rows[i].cod)
            } 

            var n_zonas = array_response.length;
            text_zonas = ""

            for(var i=0;i<n_zonas;i++){
                if(i+1>=n_zonas){
                    text_zonas+= "id_zona = " + "'" + array_response[i] + "'"
                }else{
                    text_zonas+= "id_zona = " + "'" + array_response[i] + "' OR "
                }
            }

            if(flag){
                texto_consulta = "fecha_inicio >= '" + anyo_in + "' and fecha_fin <= '" + anyo_fin + "'"
                /*
                if(anyo_in == anyo_fin){
                    texto_consulta = "fecha_inicio >= '" + anyo_in + "' or fecha_fin <= '" + anyo_fin+"'"
                }else{
                    
                }
                */
                
                let select_query3 =
                `
                    select c.nombre, 
                    CASE WHEN conteos.n_indicadores is NULL then 0 ELSE conteos.n_indicadores end as n_indicadores
                    from(
                        select ic.id_categoria, count(*) as n_indicadores
                        from(
                            select distinct(id_indicador)
                            from indicadorobtencionfecha
                            where (${text_zonas}) and (${texto_consulta})) as i, indicadorcategorizado as ic
                        where i.id_indicador = ic.id_indicador
                        group by ic.id_categoria) as conteos
                    RIGHT JOIN categoria as c 
                    on conteos.id_categoria = c.id_categoria
                    order by c.nombre
                
                `

                client.query(select_query3,(err,result)=>{
                    if (err) {
                        
                        let error = new Api503Error(`Error en el servidor.`)
                        return res.status(503).send(error)
                    }else{
                        
                        res.json({
                            ok: true,
                            result: result.rows
                        });
                    }
                })

            }else{
                let select_query3 =
                `
                    select c.nombre, 
                    CASE WHEN conteos.n_indicadores is NULL then 0 ELSE conteos.n_indicadores end as n_indicadores
                    from(
                        select ic.id_categoria, count(*) as n_indicadores
                        from(
                            select distinct(id_indicador)
                            from indicadorobtencionfecha
                            where ${text_zonas}) as i, indicadorcategorizado as ic
                        where i.id_indicador = ic.id_indicador
                        group by ic.id_categoria) as conteos
                    RIGHT JOIN categoria as c 
                    on conteos.id_categoria = c.id_categoria
                    order by c.nombre
                
                `
                client.query(select_query3,(err,result)=>{
                    if (err) {
                        
                        let error = new Api503Error(`Error en el servidor.`)
                        return res.status(503).send(error)
                    }else{
                        
                        res.json({
                            ok: true,
                            result: result.rows
                        });
                    }
                })
            }
        
        }

    })
})


router.get('/getDataComuna/:cod_comuna/:anyo_in/:anyo_fin',(req,res)=>{


    let cod_comuna = req.params.cod_comuna;
    let anyo_in = req.params.anyo_in;
    let anyo_fin = req.params.anyo_fin;


    
    
    

    let flag = true;
    if(anyo_in == -1 && anyo_fin == -1){
        flag = false;

    }

            if(flag){
                texto_consulta = "fecha_inicio >= '" + anyo_in + "' and fecha_fin <= '" + anyo_fin + "'"
                /*
                if(anyo_in == anyo_fin){
                    texto_consulta = "fecha_inicio >= '" + anyo_in + "' or fecha_fin <= '" + anyo_fin+"'"
                }else{
                    
                }
                */
                
                let select_query3 =
                `
                    select c.nombre, 
                    CASE WHEN conteos.n_indicadores is NULL then 0 ELSE conteos.n_indicadores end as n_indicadores
                    from(
                        select ic.id_categoria, count(*) as n_indicadores
                        from(
                            select distinct(id_indicador)
                            from indicadorobtencionfecha
                            where (id_zona = $1) and (${texto_consulta})) as i, indicadorcategorizado as ic
                        where i.id_indicador = ic.id_indicador
                        group by ic.id_categoria) as conteos
                    RIGHT JOIN categoria as c 
                    on conteos.id_categoria = c.id_categoria
                    order by c.nombre
                
                `

                client.query(select_query3,[cod_comuna], (err,result)=>{
                    if (err) {
                        
                        let error = new Api503Error(`Error en el servidor.`)
                        return res.status(503).send(error)
                    }else{
                        
                        res.json({
                            ok: true,
                            result: result.rows
                        });
                    }
                })

            }else{
                let select_query3 =
                `
                    select c.nombre, 
                    CASE WHEN conteos.n_indicadores is NULL then 0 ELSE conteos.n_indicadores end as n_indicadores
                    from(
                        select ic.id_categoria, count(*) as n_indicadores
                        from(
                            select distinct(id_indicador)
                            from indicadorobtencionfecha
                            where id_zona = $1) as i, indicadorcategorizado as ic
                        where i.id_indicador = ic.id_indicador
                        group by ic.id_categoria) as conteos
                    RIGHT JOIN categoria as c 
                    on conteos.id_categoria = c.id_categoria
                    order by c.nombre
                
                `
                client.query(select_query3,[cod_comuna],(err,result)=>{
                    if (err) {
                        
                        let error = new Api503Error(`Error en el servidor.`)
                        return res.status(503).send(error)
                    }else{
                        
                        res.json({
                            ok: true,
                            result: result.rows
                        });
                    }
                })
            }
        
        

    
})


module.exports = router;