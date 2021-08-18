const express = require('express');
var router = express.Router()
const client = require ('../dbb');

const Api400Error = require('../errorHandler/api400Error')
const Api10000Error = require('../errorHandler/api10000Error')
const Api503Error = require('../errorHandler/api503Error')
const Api404Error = require('../errorHandler/api404Error')



router.get('/getCategorias/:id',(req,res)=>{ 
    let id_indicador = req.params.id; 
    
    let select_query=`SELECT c.id_categoria, c.nombre FROM indicadorcategorizado as ic, categoria as c where ic.id_indicador = $1 and ic.id_categoria = c.id_categoria`;

    client.query(select_query,[id_indicador],(err,result)=>{
        
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

router.get('/getFormatos/:id',(req,res)=>{ 
    let id_documento = req.params.id; 
    let select_query=`SELECT f.id_formato, f.formato FROM formatodocumento as fd, formato as f where fd.id_documento = $1 and fd.id_formato = f.id_formato`;

    client.query(select_query,[id_documento],(err,result)=>{
    
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

router.get('/getGranularidades/:id',(req,res)=>{ 
    let id_documento = req.params.id; 
    let select_query=`SELECT g.id_granularidad, g.granularidad FROM granularidadocumento as gd, granularidad as g where gd.id_documento = $1 and gd.id_granularidad = g.id_granularidad`;

    client.query(select_query,[id_documento],(err,result)=>{

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

router.get('/getServicios/:id',(req,res)=>{ 
    let id_documento = req.params.id; 
    
    let select_query=`
    SELECT sf.id_servicio, sf.institucion 
    FROM documentogenerado as dg, serviciofuente as sf 
    where dg.id_documento = $1 and dg.id_servicio = sf.id_servicio`;

    client.query(select_query,[id_documento],(err,result)=>{
        
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





router.get('/getDocumentosFuentes/:id',(req,res)=>{ 
    let id_indicador = req.params.id; 

    let select_query =

    `
    SELECT df.id_documento, df.nombre, df.url
    FROM obtencionindicador as oi, documentofuente as df
    WHERE oi.id_indicador = $1 and oi.id_documento = df.id_documento
    `


    client.query(select_query,[id_indicador],(err,result)=>{
        
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

router.get('/getCSV/:id',(req,res)=>{ 
    let id_indicador = req.params.id; 


    let select_query =
    `
    SELECT ar.nombre, ar.id
    FROM archivo as ar, indicadorarchivo as ia
    where ia.id_indicador = $1 and ia.id_archivo = ar.id
    `

    


    client.query(select_query,[id_indicador],(err,result)=>{
        
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

router.get('/getRegiones/:id',(req,res)=>{ 
    let id_indicador = req.params.id; 

    

    let select_query = 
    `   
        SELECT r.cod, r.nombre
        FROM(
            SELECT distinct(id_zona) as id_zona
            FROM indicadorobtencionfecha as iof
            WHERE iof.id_indicador = $1) AS dz, region as r
        WHERE r.cod = dz.id_zona
    `


    client.query(select_query,[id_indicador],(err,result)=>{
        
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

router.get('/getProvincias/:id',(req,res)=>{ 
    let id_indicador = req.params.id; 

    let select_query = 
    `   
        SELECT p.cod, p.nombre
        FROM(
            SELECT distinct(id_zona) as id_zona
            FROM indicadorobtencionfecha as iof
            WHERE iof.id_indicador = $1) AS dz, provincia as p
        WHERE p.cod = dz.id_zona
    `



    client.query(select_query,[id_indicador],(err,result)=>{
        
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

router.get('/getComunas/:id',(req,res)=>{ 
    let id_indicador = req.params.id; 

    let select_query = 
    `   
        SELECT c.cod, c.nombre
        FROM(
            SELECT distinct(id_zona) as id_zona
            FROM indicadorobtencionfecha as iof
            WHERE iof.id_indicador = $1) AS dz, comuna as c
        WHERE c.cod = dz.id_zona
    `



    client.query(select_query,[id_indicador],(err,result)=>{
        
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

router.get('/getServiciosFuentesOfDocumento/:id',(req,res)=>{ 
    let id_documento = req.params.id; 
    
    let select_query=`
    SELECT sf.id_servicio, sf.institucion 
    FROM documentogenerado as dg, serviciofuente as sf 
    where dg.id_documento = $1 and dg.id_servicio = sf.id_servicio`;

    client.query(select_query,[id_documento],(err,result)=>{
        
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

router.get('/getDocumentosServicio/:id',(req,res)=>{ 
    let id_servicio = req.params.id; 
    
    let select_query=`
    select d.id_documento, d.nombre 
    from documentogenerado as dg, documentofuente as d 
    where dg.id_servicio = $1 and d.id_documento = dg.id_documento;`;

    client.query(select_query,[id_servicio],(err,result)=>{
        
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

router.get('/getCategoriaAportadaOfDocumento/:id',(req,res)=>{ 
    let id_documento = req.params.id; 
    
    let select_query=`
    SELECT distinct(c.nombre)
    FROM documentogenerado as dg, indicadorcategorizado as ic, categoria as c, obtencionindicador as oi
    WHERE dg.id_documento = $1 and oi.id_documento = $1 and oi.id_indicador = ic.id_indicador and ic.id_categoria = c.id_categoria
    `;

    client.query(select_query,[id_documento],(err,result)=>{
        
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




router.post('/getCategoriasRestantes',(req,res)=>{

    let body = req.body

    

    let categorias = body.categoriasPertenecientes


    var array_categorias = JSON.parse(categorias)

    var n_categorias = array_categorias.length


    if(n_categorias>=1){
        text_categorias = ""

        for(var i=0;i<n_categorias;i++){
            if(i+1 >= n_categorias){
                text_categorias+= "" + array_categorias[i] + ""
            }else{
                text_categorias+= "" + array_categorias[i] + ","
            }
            
        }

        select_query = `
            SELECT c.id_categoria, c.nombre
            FROM categoria as c
            WHERE c.id_categoria  not in (${text_categorias})
        `

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

        })
    }
   

    


    

    


})


router.post('/getFormatosRestantes',(req,res)=>{

    let body = req.body


    let formatos = body.formatosPertenecientes


    var array_formatos = JSON.parse(formatos)

    var n_formatos = array_formatos.length


    if(n_formatos>=1){
        text_formatos = ""

        for(var i=0;i<n_formatos;i++){
            if(i+1 >= n_formatos){
                text_formatos+= "" + array_formatos[i] + ""
            }else{
                text_formatos+= "" + array_formatos[i] + ","
            }
            
        }

        select_query = `
            SELECT f.id_formato, f.formato
            FROM formato as f
            WHERE f.id_formato not in (${text_formatos})
        `

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

        })
    }
   

    


    

    


})

router.post('/getGranularidadesRestantes',(req,res)=>{

    let body = req.body


    let granularidades = body.granularidadesPertenecientes


    var array_granularidades = JSON.parse(granularidades)

    var n_granularidades = array_granularidades.length


    if(n_granularidades>=1){
        text_granularidades = ""

        for(var i=0;i<n_granularidades;i++){
            if(i+1 >= n_granularidades){
                text_granularidades+= "" + array_granularidades[i] + ""
            }else{
                text_granularidades+= "" + array_granularidades[i] + "," 
            }
            
        }

        select_query = `
            SELECT g.id_granularidad, g.granularidad
            FROM granularidad as g
            WHERE g.id_granularidad not in (${text_granularidades})
        `

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

        })
    }
   

    


    

    


})

router.post('/getDocumentosRestantes',(req,res)=>{

    let body = req.body


    let documentos = body.documentosPertenecientes


    var array_documentos = JSON.parse(documentos)

    var n_documentos = array_documentos.length


    if(n_documentos>=1){
        text_documentos = ""

        for(var i=0;i<n_documentos;i++){
            if(i+1 >= n_documentos){
                text_documentos+= "" + array_documentos[i] + ""
            }else{
                text_documentos+= "" + array_documentos[i] + "," 
            }
            
        }

        select_query = `
            SELECT df.id_documento, df.nombre
            FROM documentofuente as df
            WHERE df.id_documento not in (${text_documentos})
        `

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

        })
    }
   

    


    

    


})





router.post('/getDocumentosRestantesInstitucion',(req,res)=>{

    let body = req.body

    
    let documentos = body.documentos_actuales


    var array_documentos = JSON.parse(documentos)

    var n_documentos = array_documentos.length

    
    if(n_documentos>=1){
        text_documentos = ""

        for(var i=0;i<n_documentos;i++){
            if(i+1 >= n_documentos){
                text_documentos+= "" + array_documentos[i] + ""
            }else{
                text_documentos+= "" + array_documentos[i] + ","
            }
            
        }

        

        select_query = `
            SELECT d.id_documento, d.nombre
            FROM documentofuente as d
            WHERE d.id_documento not in (${text_documentos})
        `

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

        })
    }

    


    

    


})


router.post('/getInstitucionesRestantesDocumento',(req,res)=>{

    let body = req.body

    
    let instituciones = body.instituciones_actuales

    
    var array_instituciones = JSON.parse(instituciones)

    var n_instituciones = array_instituciones.length

    
    if(n_instituciones>=1){
        text_instituciones = ""

        for(var i=0;i<n_instituciones;i++){
            if(i+1 >= n_instituciones){
                text_instituciones+= "" + array_instituciones[i] + ""
            }else{
                text_instituciones+= "" + array_instituciones[i] + ","
            }
            
        }

        select_query = `
            SELECT s.id_servicio, s.institucion
            FROM serviciofuente as s
            WHERE s.id_servicio not in (${text_instituciones})
        `

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

        })
    }

    


    

    


})


router.post('/getCategoriasRestantesIndicador',(req,res)=>{

    let body = req.body

    
    let categorias = body.categoriactual

    
    var array_categorias = JSON.parse(categorias)

    var n_categorias = array_categorias.length

    

    
    if(n_categorias>=1){
        text_categorias = ""

        for(var i=0;i<n_categorias;i++){
            if(i+1 >= n_categorias){
                text_categorias+= "" + array_categorias[i] + ""
            }else{
                text_categorias+= "" + array_categorias[i] + ","
            }
            
        }

        select_query = `
            SELECT c.id_categoria, c.nombre
            FROM categoria as c
            WHERE c.id_categoria not in (${text_categorias})
        `

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

        })
    }

    


    

    


})

router.get('/getIntervalos2/:id/:granularidad',(req,res)=>{
    let id_categoria = req.params.id; 
    let granularidad = req.params.granularidad
    let select_query;

    if(granularidad == 1){
        select_query=`
    
    
    SELECT cartodb.cdb_jenksbins(array_agg(resultado.n_indicadores::NUMERIC),5) as jenks
            FROM (select id_zona as cod, count(*) as n_indicadores
                from(
                    select distinct id_indicador, id_zona
                    from indicadorobtencionfecha) as distintos, 
                regionesCoordenadas as reg,
                indicadorcategorizado as ic
                WHERE distintos.id_zona = reg.id and ic.id_indicador = distintos.id_indicador and ic.id_categoria=$1
                group by id_zona

                UNION

                select codigos.id, '0' as n_indicadores
                from(
                    SELECT id
                    FROM regionesCoordenadas

                    EXCEPT

                    SELECT distinct(id_zona)
                    FROM indicadorobtencionfecha) as codigos) as resultado
    
    
    `;

    }else if(granularidad == 2){
        select_query=`
    
    
        SELECT cartodb.cdb_jenksbins(array_agg(resultado.n_indicadores::NUMERIC),5) as jenks
                FROM (select id_zona as cod, count(*) as n_indicadores
                    from(
                        select distinct id_indicador, id_zona
                        from indicadorobtencionfecha) as distintos, 
                    provinciasCoordenadas as prov,
                    indicadorcategorizado as ic
                    WHERE distintos.id_zona = prov.id and ic.id_indicador = distintos.id_indicador and ic.id_categoria=$1
                    group by id_zona
    
                    UNION
    
                    select codigos.id, '0' as n_indicadores
                    from(
                        SELECT id
                        FROM provinciasCoordenadas
    
                        EXCEPT
    
                        SELECT distinct(id_zona)
                        FROM indicadorobtencionfecha) as codigos) as resultado
        
        
        `;
    }else if(granularidad == 3){
        select_query=`
    
    
        SELECT cartodb.cdb_jenksbins(array_agg(resultado.n_indicadores::NUMERIC),5) as jenks
                FROM (select id_zona as cod, count(*) as n_indicadores
                    from(
                        select distinct id_indicador, id_zona
                        from indicadorobtencionfecha) as distintos, 
                    comunasCoordenadas as com,
                    indicadorcategorizado as ic
                    WHERE distintos.id_zona = com.id and ic.id_indicador = distintos.id_indicador and ic.id_categoria=$1
                    group by id_zona
    
                    UNION
    
                    select codigos.id, '0' as n_indicadores
                    from(
                        SELECT id
                        FROM comunasCoordenadas
    
                        EXCEPT
    
                        SELECT distinct(id_zona)
                        FROM indicadorobtencionfecha AS iof, indicadorcategorizado as ic
                        WHERE iof.id_indicador = ic.id_indicador and ic.id_categoria=$1) as codigos) as resultado
        
        
        `;
    }
   
    client.query(select_query,[id_categoria],(err,result)=>{
        
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


router.get('/getIntervalos/:id/:granularidad',(req,res)=>{ 
    let id_categoria = req.params.id; 
    let granularidad = req.params.granularidad
    let select_query;

    

    if(granularidad == 1){
        select_query=`
    
        
        SELECT unnest(resultado3.intervalos) as intervalo
FROM
(
    SELECT
    CASE 
        WHEN array_length(resultado2.jenks,1) = 0 THEN ARRAY['[]']
        WHEN array_length(resultado2.jenks,1) = 1 THEN ARRAY['[]']
        WHEN array_length(resultado2.jenks,1) = 2 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],']')]
        WHEN array_length(resultado2.jenks,1) = 3 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['), 
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],']')]
        WHEN array_length(resultado2.jenks,1) = 4 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['),
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],'['),
                                                                    CONCAT('[',resultado2.jenks[3],' - ',resultado2.jenks[4],']')]
        WHEN array_length(resultado2.jenks,1) = 5 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['),
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],'['),
                                                                    CONCAT('[',resultado2.jenks[3],' - ',resultado2.jenks[4],'['),
                                                                    CONCAT('[',resultado2.jenks[4],' - ',resultado2.jenks[5],']')]
        WHEN array_length(resultado2.jenks,1) = 6 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['),
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],'['),
                                                                    CONCAT('[',resultado2.jenks[3],' - ',resultado2.jenks[4],'['),
                                                                    CONCAT('[',resultado2.jenks[4],' - ',resultado2.jenks[5],'['),
                                                                    CONCAT('[',resultado2.jenks[5],' - ',resultado2.jenks[6],']')]
    END as intervalos
    FROM(
        SELECT cartodb.cdb_jenksbins(array_agg(resultado.n_indicadores::NUMERIC),6) as jenks
        FROM (
            select id_zona as cod, count(*) as n_indicadores
            from(
                select distinct id_indicador, id_zona
                from indicadorobtencionfecha) as distintos, 
                regionesCoordenadas as reg,
                indicadorcategorizado as ic
            WHERE distintos.id_zona = reg.id and ic.id_indicador = distintos.id_indicador and ic.id_categoria=$1
            group by id_zona

            UNION

            select codigos.id, '0' as n_indicadores
            from(
                SELECT id
                FROM regionesCoordenadas

                EXCEPT

                SELECT distinct(id_zona)
                FROM indicadorobtencionfecha as iof, indicadorcategorizado as ic
                WHERE iof.id_indicador = ic.id_indicador and ic.id_categoria = $1) as codigos) as resultado) AS resultado2) AS resultado3
        
    
    
    `;

    }else if(granularidad == 2){
        select_query=`
    
    

        SELECT unnest(resultado3.intervalos) as intervalo
FROM
(
    SELECT
    CASE 
        WHEN array_length(resultado2.jenks,1) = 0 THEN ARRAY['[]']
        WHEN array_length(resultado2.jenks,1) = 1 THEN ARRAY['[]']
        WHEN array_length(resultado2.jenks,1) = 2 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],']')]
        WHEN array_length(resultado2.jenks,1) = 3 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['), 
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],']')]
        WHEN array_length(resultado2.jenks,1) = 4 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['),
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],'['),
                                                                    CONCAT('[',resultado2.jenks[3],' - ',resultado2.jenks[4],']')]
        WHEN array_length(resultado2.jenks,1) = 5 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['),
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],'['),
                                                                    CONCAT('[',resultado2.jenks[3],' - ',resultado2.jenks[4],'['),
                                                                    CONCAT('[',resultado2.jenks[4],' - ',resultado2.jenks[5],']')]
        WHEN array_length(resultado2.jenks,1) = 6 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['),
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],'['),
                                                                    CONCAT('[',resultado2.jenks[3],' - ',resultado2.jenks[4],'['),
                                                                    CONCAT('[',resultado2.jenks[4],' - ',resultado2.jenks[5],'['),
                                                                    CONCAT('[',resultado2.jenks[5],' - ',resultado2.jenks[6],']')]
    END as intervalos
    FROM(
        SELECT cartodb.cdb_jenksbins(array_agg(resultado.n_indicadores::NUMERIC),6) as jenks
        FROM (
            select id_zona as cod, count(*) as n_indicadores
            from(
                select distinct id_indicador, id_zona
                from indicadorobtencionfecha) as distintos, 
                provinciasCoordenadas as prov,
                indicadorcategorizado as ic
            WHERE distintos.id_zona = prov.id and ic.id_indicador = distintos.id_indicador and ic.id_categoria=$1
            group by id_zona

            UNION

            select codigos.id, '0' as n_indicadores
            from(
                SELECT id
                FROM provinciasCoordenadas

                EXCEPT

                SELECT distinct(id_zona)
                FROM indicadorobtencionfecha as iof, indicadorcategorizado as ic
                WHERE iof.id_indicador = ic.id_indicador and ic.id_categoria = $1) as codigos) as resultado) AS resultado2) AS resultado3
        
        
        `;
    }else if(granularidad == 3){
        select_query=`
    
    
        SELECT unnest(resultado3.intervalos) as intervalo
FROM
(
    SELECT
    CASE 
        WHEN array_length(resultado2.jenks,1) = 0 THEN ARRAY['[]']
        WHEN array_length(resultado2.jenks,1) = 1 THEN ARRAY['[]']
        WHEN array_length(resultado2.jenks,1) = 2 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],']')]
        WHEN array_length(resultado2.jenks,1) = 3 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['), 
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],']')]
        WHEN array_length(resultado2.jenks,1) = 4 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['),
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],'['),
                                                                    CONCAT('[',resultado2.jenks[3],' - ',resultado2.jenks[4],']')]
        WHEN array_length(resultado2.jenks,1) = 5 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['),
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],'['),
                                                                    CONCAT('[',resultado2.jenks[3],' - ',resultado2.jenks[4],'['),
                                                                    CONCAT('[',resultado2.jenks[4],' - ',resultado2.jenks[5],']')]
        WHEN array_length(resultado2.jenks,1) = 6 THEN ARRAY[CONCAT('[',resultado2.jenks[1],' - ',resultado2.jenks[2],'['),
                                                                    CONCAT('[',resultado2.jenks[2],' - ',resultado2.jenks[3],'['),
                                                                    CONCAT('[',resultado2.jenks[3],' - ',resultado2.jenks[4],'['),
                                                                    CONCAT('[',resultado2.jenks[4],' - ',resultado2.jenks[5],'['),
                                                                    CONCAT('[',resultado2.jenks[5],' - ',resultado2.jenks[6],']')]
    END as intervalos
    FROM(
        SELECT cartodb.cdb_jenksbins(array_agg(resultado.n_indicadores::NUMERIC),6) as jenks
        FROM (
            select id_zona as cod, count(*) as n_indicadores
            from(
                select distinct id_indicador, id_zona
                from indicadorobtencionfecha) as distintos, 
                comunasCoordenadas as com,
                indicadorcategorizado as ic
            WHERE distintos.id_zona = com.id and ic.id_indicador = distintos.id_indicador and ic.id_categoria=$1
            group by id_zona

            UNION

            select codigos.id, '0' as n_indicadores
            from(
                SELECT id
                FROM comunasCoordenadas

                EXCEPT

                SELECT distinct(id_zona)
                FROM indicadorobtencionfecha as iof, indicadorcategorizado as ic
                WHERE iof.id_indicador = ic.id_indicador and ic.id_categoria = $1) as codigos) as resultado) AS resultado2) AS resultado3
        
        
        `;
    }
   
    client.query(select_query,[id_categoria],(err,result)=>{
        
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


router.get('/nIndicadoresByPeriod/:id/:id2',(req,res)=>{ 
    let id_periodo = req.params.id; 

    let orden = req.params.id2;
    var fecha_actual = getLastPeriod(1)

    var mes = fecha_actual.getMonth() + 1;
    var mes_string
    var dia = fecha_actual.getDate()
    var dia_string;

    mes_string = concatenateFecha(mes)

    dia_string = concatenateFecha(dia)

    var fecha_actual_string = fecha_actual.getFullYear() + '-' + mes_string + '-' + dia_string
    

    
    var texto_consulta;

    if(id_periodo == 1){
        texto_consulta = "bi.fecha = '" + fecha_actual_string + "'"
    }else if(id_periodo == 2){
        var fecha_ultima_semana = getLastPeriod(2)

        var mes_ultima_semana = fecha_ultima_semana.getMonth() + 1
        var mes_ultima_semana_string

        var dia_ultima_semana = fecha_ultima_semana.getDate()
        var dia_ultima_semana_string

        mes_ultima_semana_string = concatenateFecha(mes_ultima_semana)
        dia_ultima_semana_string = concatenateFecha(dia_ultima_semana)

        var fecha_ultima_semana_string = fecha_ultima_semana.getFullYear() + '-' + mes_ultima_semana_string + '-' + dia_ultima_semana_string




        texto_consulta = "bi.fecha >= '" + fecha_ultima_semana_string + "' and bi.fecha <= '" + fecha_actual_string + "'"
    }else if(id_periodo == 3){

        var fecha_ultimo_mes = getLastPeriod(3)

        var mes_ultimo_mes = fecha_ultimo_mes.getMonth() + 1
        var mes_ultimo_mes_string

        var dia_ultimo_mes = fecha_ultimo_mes.getDate()
        var dia_ultimo_mes_string

        mes_ultimo_mes_string = concatenateFecha(mes_ultimo_mes)
        dia_ultimo_mes_string = concatenateFecha(dia_ultimo_mes)

        var fecha_ultimo_mes_string = fecha_ultimo_mes.getFullYear() + '-' + mes_ultimo_mes_string + '-' + dia_ultimo_mes_string

        
     

        texto_consulta = "bi.fecha >= '" + fecha_ultimo_mes_string + "' and bi.fecha <= '" + fecha_actual_string + "'"

    }else if(id_periodo == 4){
        var fecha_ultimo_anyo = getLastPeriod(4)

        var mes_ultimo_anyo = fecha_ultimo_anyo.getMonth() + 1
        var mes_ultimo_anyo_string

        var dia_ultimo_anyo = fecha_ultimo_anyo.getDate()
        var dia_ultimo_anyo_string

        mes_ultimo_anyo_string = concatenateFecha(mes_ultimo_anyo)
        dia_ultimo_anyo_string = concatenateFecha(dia_ultimo_anyo)

        var fecha_ultimo_anyo_string = fecha_ultimo_anyo.getFullYear() + '-' + mes_ultimo_anyo_string + '-' + dia_ultimo_anyo_string

        
        

        texto_consulta = "bi.fecha >= '" + fecha_ultimo_anyo_string + "' and bi.fecha <= '" + fecha_actual_string + "'"


    }else if(id_periodo == 5){
        texto_consulta = "bi.fecha IS NOT NULL"
    }

    
    let select_query
    let orden_texto
    if(orden == 1){
        orden_texto = "desc"
    }else if(orden == 2){
        orden_texto = "asc"
    }

    
    select_query = 
    `

        select i.id_indicador, i.nombre, busquedas.n_busquedas
        from (

            select bi.id_indicador, count(*) as n_busquedas
            from busquedaindicador as bi
            where ${texto_consulta}
            group by bi.id_indicador
            ) as busquedas,
            indicador as i
        where busquedas.id_indicador = i.id_indicador
        order by n_busquedas ${orden_texto}
    `
            /*
    select_query = 
        `
            
            select bi.id_indicador, count(*) as n_busquedas, i.nombre
            from busquedaindicador as bi, indicador as i
            where ${texto_consulta}
            group by bi.id_indicador, i.nombre
            order by n_busquedas ${orden_texto}

        `
            */
    
    

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

        //
        
        
        

    });

    
})

router.get('/getIndicadoresByYears/:id/:id2',(req,res)=>{ 
    
    let anyo_in = req.params.id;
    let anyo_fin = req.params.id2

    let texto_consulta
    texto_consulta = "fecha_inicio >= '" + anyo_in + "' and fecha_fin <= '" + anyo_fin + "'"
    /*
    if(anyo_in == anyo_fin){
        texto_consulta = "fecha_inicio >= '" + anyo_in + "' or fecha_fin <= '" + anyo_fin+"'"
    }else{
        
    }
    */
    
    
    select_query = 
    `
    select i.id_indicador, i.nombre
    from(
        select distinct(id_indicador)
        from indicadorobtencionfecha 
        where ${texto_consulta}) as distintos,
        indicador as i
    where i.id_indicador = distintos.id_indicador
    
    `
    
    
    
    
    client.query(select_query,(err,result)=>{
        
        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            
            if(result.rows.length > 0){
                res.json({
                    ok: true,
                    result: result.rows
                });
            }else{

                
                /*
                let mas_cercano_inicio = parseInt(anyo_in) - 4
                let mas_cercano_fin = parseInt(anyo_fin) + 4
                texto_consulta = "fecha_inicio >= '" + mas_cercano_inicio + "' and fecha_fin <= '" + mas_cercano_fin+"'"
                */

                let select_query2 = `
                select minimos.id_indicador, i.nombre, MIN(minimos.minimdif) as minimosfin
                from(

                    select id_indicador,
                    CASE WHEN dif1 < dif2 then dif1 
                        WHEN dif2 <= dif1 then dif2
                        end as minimdif
                    from(

                        select id_indicador, abs(iof.fecha_inicio - $1) as dif1,  iof.fecha_inicio, abs(iof.fecha_fin - $2) as dif2, iof.fecha_fin
                        from indicadorobtencionfecha iof
                        ) diferencias) as minimos, indicador as i
                where i.id_indicador = minimos.id_indicador
                GROUP BY minimos.id_indicador, i.nombre
                order by minimosfin
                limit 10
                `
                        /*
                select_query2 = 
                `
                select i.id_indicador, i.nombre
                from(
                    select distinct(id_indicador)
                    from indicadorobtencionfecha 
                    where ${texto_consulta}) as distintos,
                    indicador as i
                where i.id_indicador = distintos.id_indicador
                
                `
                    */
                
                client.query(select_query2,[anyo_in,anyo_fin],(err2,result2)=>{
                    if (err2) {
                        let error = new Api503Error(`Error en el servidor.`)
                        return res.status(503).send(error)
                    }else{
                        
                        //
                        
                        if(result2.rows.length > 0){
                            
                            res.json({
                                ok: true,
                                message: '1',
                                result: result2.rows
                            });
                        }else{
                            let error = new Api404Error(`No hay resultados cercanos.`)
                            return res.status(404).send(error)
                        }
                       
                    }
                })


            }
           
        
        }

        //
        

    });
    
    
})


router.get('/nIndicadoresByPeriod2/:id/:id2',(req,res)=>{ 
    let id_periodo = req.params.id; 

    let orden = req.params.id2;
    var fecha_actual = getLastPeriod(1)

    var mes = fecha_actual.getMonth() + 1;
    var mes_string
    var dia = fecha_actual.getDate()
    var dia_string;

    mes_string = concatenateFecha(mes)

    dia_string = concatenateFecha(dia)

    var fecha_actual_string = fecha_actual.getFullYear() + '-' + mes_string + '-' + dia_string
    

    
    var texto_consulta;

    if(id_periodo == 1){
        texto_consulta = "fzi.fecha = '" + fecha_actual_string + "'"
    }else if(id_periodo == 2){
        var fecha_ultima_semana = getLastPeriod(2)

        var mes_ultima_semana = fecha_ultima_semana.getMonth() + 1
        var mes_ultima_semana_string

        var dia_ultima_semana = fecha_ultima_semana.getDate()
        var dia_ultima_semana_string

        mes_ultima_semana_string = concatenateFecha(mes_ultima_semana)
        dia_ultima_semana_string = concatenateFecha(dia_ultima_semana)

        var fecha_ultima_semana_string = fecha_ultima_semana.getFullYear() + '-' + mes_ultima_semana_string + '-' + dia_ultima_semana_string




        texto_consulta = "fzi.fecha >= '" + fecha_ultima_semana_string + "' and fzi.fecha <= '" + fecha_actual_string + "'"
    }else if(id_periodo == 3){

        var fecha_ultimo_mes = getLastPeriod(3)

        var mes_ultimo_mes = fecha_ultimo_mes.getMonth() + 1
        var mes_ultimo_mes_string

        var dia_ultimo_mes = fecha_ultimo_mes.getDate()
        var dia_ultimo_mes_string

        mes_ultimo_mes_string = concatenateFecha(mes_ultimo_mes)
        dia_ultimo_mes_string = concatenateFecha(dia_ultimo_mes)

        var fecha_ultimo_mes_string = fecha_ultimo_mes.getFullYear() + '-' + mes_ultimo_mes_string + '-' + dia_ultimo_mes_string

        
     

        texto_consulta = "fzi.fecha >= '" + fecha_ultimo_mes_string + "' and fzi.fecha <= '" + fecha_actual_string + "'"

    }else if(id_periodo == 4){
        var fecha_ultimo_anyo = getLastPeriod(4)

        var mes_ultimo_anyo = fecha_ultimo_anyo.getMonth() + 1
        var mes_ultimo_anyo_string

        var dia_ultimo_anyo = fecha_ultimo_anyo.getDate()
        var dia_ultimo_anyo_string

        mes_ultimo_anyo_string = concatenateFecha(mes_ultimo_anyo)
        dia_ultimo_anyo_string = concatenateFecha(dia_ultimo_anyo)

        var fecha_ultimo_anyo_string = fecha_ultimo_anyo.getFullYear() + '-' + mes_ultimo_anyo_string + '-' + dia_ultimo_anyo_string

        
        

        texto_consulta = "fzi.fecha >= '" + fecha_ultimo_anyo_string + "' and fzi.fecha <= '" + fecha_actual_string + "'"


    }else if(id_periodo == 5){
        texto_consulta = "fzi.fecha IS NOT NULL"
    }

    
    let select_query
    let orden_texto
    if(orden == 1){
        orden_texto = "desc"
    }else if(orden == 2){
        orden_texto = "asc"
    }

    

    select_query = 
    `
    select i.id_indicador, i.nombre, zonas.n_zonas
    from(

        select fzi.id_indicador, count(*) as n_zonas
        from(
            select distinct fzi.id_indicador, fzi.id_zona
            from fechazonaindicador as fzi
            where ${texto_consulta}) as fzi
        group by fzi.id_indicador) as zonas,
        indicador as i
    where zonas.id_indicador = i.id_indicador
    order by n_zonas ${orden_texto}
    `
    /*
    select_query = 
    `

        select i.id_indicador, i.nombre, busquedas.n_busquedas
        from (

            select bi.id_indicador, count(*) as n_busquedas
            from busquedaindicador as bi
            where ${texto_consulta}
            group by bi.id_indicador
            ) as busquedas,
            indicador as i
        where busquedas.id_indicador = i.id_indicador
        order by n_busquedas ${orden_texto}
    `*/
            /*
    select_query = 
        `
            
            select bi.id_indicador, count(*) as n_busquedas, i.nombre
            from busquedaindicador as bi, indicador as i
            where ${texto_consulta}
            group by bi.id_indicador, i.nombre
            order by n_busquedas ${orden_texto}

        `
            */
    
    
            
    client.query(select_query,(err,result)=>{
        
        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            //
            
            res.json({
                ok: true,
                result: result.rows
            });
        }

        
        

    });
    
    
})

router.get('/getnCSV/:id',(req,res)=>{ 
 
    let orden = req.params.id;
    let orden_texto
    if(orden == 1){
        orden_texto = "desc"
    }else if(orden == 2){
        orden_texto = "asc"
    }


    
    let select_query
    select_query = 
    `
    select i.id_indicador, i.nombre, csv.n_csv
    from(
        select ia.id_indicador, count(*) as n_csv
        from indicadorarchivo as ia
        group by id_indicador) as csv, indicador as i
    where i.id_indicador = csv.id_indicador
    order by n_csv ${orden_texto}
    `
    /*
    select_query = 
    `

        select i.id_indicador, i.nombre, busquedas.n_busquedas
        from (

            select bi.id_indicador, count(*) as n_busquedas
            from busquedaindicador as bi
            where ${texto_consulta}
            group by bi.id_indicador
            ) as busquedas,
            indicador as i
        where busquedas.id_indicador = i.id_indicador
        order by n_busquedas ${orden_texto}
    `*/
            /*
    select_query = 
        `
            
            select bi.id_indicador, count(*) as n_busquedas, i.nombre
            from busquedaindicador as bi, indicador as i
            where ${texto_consulta}
            group by bi.id_indicador, i.nombre
            order by n_busquedas ${orden_texto}

        `
            */
    
    
            
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

        //
        
        

    });
    
    
})


router.get('/nDocumentosByPeriod/:id/:id2',(req,res)=>{ 
    let id_periodo = req.params.id; 

    let orden = req.params.id2;
    var fecha_actual = getLastPeriod(1)

    var mes = fecha_actual.getMonth() + 1;
    var mes_string
    var dia = fecha_actual.getDate()
    var dia_string;

    mes_string = concatenateFecha(mes)

    dia_string = concatenateFecha(dia)

    var fecha_actual_string = fecha_actual.getFullYear() + '-' + mes_string + '-' + dia_string
    

    
    var texto_consulta;

    if(id_periodo == 1){
        texto_consulta = "bd.fecha = '" + fecha_actual_string + "'"
    }else if(id_periodo == 2){
        var fecha_ultima_semana = getLastPeriod(2)

        var mes_ultima_semana = fecha_ultima_semana.getMonth() + 1
        var mes_ultima_semana_string

        var dia_ultima_semana = fecha_ultima_semana.getDate()
        var dia_ultima_semana_string

        mes_ultima_semana_string = concatenateFecha(mes_ultima_semana)
        dia_ultima_semana_string = concatenateFecha(dia_ultima_semana)

        var fecha_ultima_semana_string = fecha_ultima_semana.getFullYear() + '-' + mes_ultima_semana_string + '-' + dia_ultima_semana_string




        texto_consulta = "bd.fecha >= '" + fecha_ultima_semana_string + "' and bd.fecha <= '" + fecha_actual_string + "'"
    }else if(id_periodo == 3){

        var fecha_ultimo_mes = getLastPeriod(3)

        var mes_ultimo_mes = fecha_ultimo_mes.getMonth() + 1
        var mes_ultimo_mes_string

        var dia_ultimo_mes = fecha_ultimo_mes.getDate()
        var dia_ultimo_mes_string

        mes_ultimo_mes_string = concatenateFecha(mes_ultimo_mes)
        dia_ultimo_mes_string = concatenateFecha(dia_ultimo_mes)

        var fecha_ultimo_mes_string = fecha_ultimo_mes.getFullYear() + '-' + mes_ultimo_mes_string + '-' + dia_ultimo_mes_string

        
     

        texto_consulta = "bd.fecha >= '" + fecha_ultimo_mes_string + "' and bd.fecha <= '" + fecha_actual_string + "'"

    }else if(id_periodo == 4){
        var fecha_ultimo_anyo = getLastPeriod(4)

        var mes_ultimo_anyo = fecha_ultimo_anyo.getMonth() + 1
        var mes_ultimo_anyo_string

        var dia_ultimo_anyo = fecha_ultimo_anyo.getDate()
        var dia_ultimo_anyo_string

        mes_ultimo_anyo_string = concatenateFecha(mes_ultimo_anyo)
        dia_ultimo_anyo_string = concatenateFecha(dia_ultimo_anyo)

        var fecha_ultimo_anyo_string = fecha_ultimo_anyo.getFullYear() + '-' + mes_ultimo_anyo_string + '-' + dia_ultimo_anyo_string

        
        

        texto_consulta = "bd.fecha >= '" + fecha_ultimo_anyo_string + "' and bd.fecha <= '" + fecha_actual_string + "'"


    }else if(id_periodo == 5){
        texto_consulta = "bd.fecha IS NOT NULL"
    }

    
    let select_query
    let orden_texto
    if(orden == 1){
        orden_texto = "desc"
    }else if(orden == 2){
        orden_texto = "asc"
    }

    
    select_query = 
    `

        select df.id_documento, df.nombre, busquedas.n_busquedas, df.url
        from (
        
            select bd.id_documento, count(*) as n_busquedas
            from busquedadocumento as bd
            where ${texto_consulta}
            group by bd.id_documento) as busquedas,
            documentofuente as df
            where busquedas.id_documento = df.id_documento
        order by n_busquedas ${orden_texto}
                
    `
            /*
    select_query = 
        `
            
            select bi.id_indicador, count(*) as n_busquedas, i.nombre
            from busquedaindicador as bi, indicador as i
            where ${texto_consulta}
            group by bi.id_indicador, i.nombre
            order by n_busquedas ${orden_texto}

        `
            */
    
    

    client.query(select_query,(err,result)=>{
        
        if (err) {
            console.log(err)
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            res.json({
                ok: true,
                result: result.rows
            });
        }

        //
        
        
        

    });
    
    
})

router.get('/getnAportesDocumento/:id',(req,res)=>{ 
 
    let orden = req.params.id;
    let orden_texto
    if(orden == 1){
        orden_texto = "desc"
    }else if(orden == 2){
        orden_texto = "asc"
    }


    
    let select_query
    select_query = 
    `
    
        select df.id_documento, df.nombre, aportes.n_indicadores, df.url
        from(
            select oi.id_documento, count(*) as n_indicadores
            from obtencionindicador as oi 
            group by id_documento
        ) as aportes, documentofuente as df
        where df.id_documento = aportes.id_documento
        order by n_indicadores ${orden_texto}
    `
    /*
    select_query = 
    `

        select i.id_indicador, i.nombre, busquedas.n_busquedas
        from (

            select bi.id_indicador, count(*) as n_busquedas
            from busquedaindicador as bi
            where ${texto_consulta}
            group by bi.id_indicador
            ) as busquedas,
            indicador as i
        where busquedas.id_indicador = i.id_indicador
        order by n_busquedas ${orden_texto}
    `*/
            /*
    select_query = 
        `
            
            select bi.id_indicador, count(*) as n_busquedas, i.nombre
            from busquedaindicador as bi, indicador as i
            where ${texto_consulta}
            group by bi.id_indicador, i.nombre
            order by n_busquedas ${orden_texto}

        `
            */
    
    
    
    client.query(select_query,(err,result)=>{
        
        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            //
            
            res.json({
                ok: true,
                result: result.rows
            });
        }

        
        

    });
    
    
})

router.post('/getUserInfo/',(req,res)=>{ 


    let correo = JSON.parse(req.body.correo); 

    

    let select_query = 
    `   
       select telefono, nombre, apellidop, apellidom, tipo
       from personalcapacitado
       where mail = $1
    `


    client.query(select_query,[correo],(err,result)=>{
        
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

function concatenateFecha(fecha){
    let fecha_string
    if(fecha >=0 && fecha <10){
        fecha_string = '0' + fecha.toString()
    }else{
        fecha_string = fecha.toString()
    }

    return fecha_string
}


function getLastPeriod(tipo){
    var lastPeriod;
    let today = new Date();
    if(tipo == 1){
        lastPeriod = today
    }else if(tipo == 2){
        
        lastPeriod = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7)
    }else if(tipo == 3){
        lastPeriod = new Date(today.getFullYear(), today.getMonth()-1, today.getDate())
    }else if(tipo == 4){
        lastPeriod = new Date(today.getFullYear()-1, today.getMonth(), today.getDate())
    }

    return lastPeriod
}


module.exports = router;






