
const express = require('express');
var router = express.Router()
const client = require ('../dbb');


const Api400Error = require('../errorHandler/api400Error')
const Api10000Error = require('../errorHandler/api10000Error')
const Api503Error = require('../errorHandler/api503Error')
const Api404Error = require('../errorHandler/api404Error')


router.post('/searchByName',(req,res)=>{  

    
    var name_indicador = req.body.indicador; 
    
    let select_query=`
    
    select *
    from(
        select *, similarity(nombre, $1) as similaridad
        from indicador
        order by similaridad desc
        ) as parecidos
    where parecidos.similaridad > 0.07
    
    `

    
    client.query(select_query,[name_indicador],(err,result)=>{
        
        if (err) {
            
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            
            
          
            if(result.rows[0].similaridad == 1){
                response = [result.rows[0]]
                
                //var new_date = new Date();
                let random = Math.random();
                var new_date

                
                if(random <= 0.1){
                    new_date = randomDate(new Date(2020, 0, 1), new Date(2020, 0, 31))
                }else if(random > 0.1 && random <= 0.3){
                    new_date = randomDate(new Date(2021, 0, 1), new Date())
                }else if(random>0.3 && random <0.5){
                    new_date = randomDate(new Date(2021, 5, 1), new Date())
                }else{
                    new_date = randomDate(new Date(2021, 5, 17), new Date())
                }
                


                var mes = new_date.getMonth() + 1;
                var mes_string
                var dia = new_date.getDate()
                var dia_string;
                if(mes >= 0 && mes <10){
                    mes_string = '0' + mes.toString() 
                }else{
                    mes_string = mes.toString()
                }

                if(dia >=0 && dia <10){
                    dia_string = '0' + dia.toString()
                }else{
                    dia_string = dia.toString()
                }

                var new_date_string = new_date.getFullYear() + '-' + mes_string + '-' + dia_string
                let id_indicador = result.rows[0].id_indicador;
                
                
                let insert_query = 
                `
                    insert into busquedaindicador(id_indicador, fecha) values($1,$2)
                `

                
                client.query(insert_query, [id_indicador, new_date_string],(err2,result2)=>{
                    if(err2){
                        let error = new Api503Error(`Error en el servidor.`)
                        return res.status(503).send(error)
                    }else{
                        res.json({
                            ok: true,
                            result: response
                        });
                    }
                })
               
             
                
                
            }else{
                res.json({
                    ok: true,
                    result: result.rows
                });
            }
            
            
        }

        

    });




})

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

router.post('/searchDocumentByName',(req,res)=>{  

    
    var name_documento = req.body.documento; 

    
    
    let select_query=`

    select *
    from(
        select *, similarity(nombre, $1) as similaridad
        from documentofuente
        order by similaridad desc
        ) as parecidos
    where parecidos.similaridad > 0.07
    
    
    
    `

    
    client.query(select_query,[name_documento],(err,result)=>{
        
        if (err) {
            
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            
            
            if(result.rows.length>0){
                if(result.rows[0].similaridad >= 0.9 ){
                    response = [result.rows[0]]
    
                    //var new_date = new Date();
                    let random = Math.random();
                    var new_date
    
                    
                    if(random <= 0.1){
                        new_date = randomDate(new Date(2020, 0, 1), new Date(2020, 0, 31))
                    }else if(random > 0.1 && random <= 0.3){
                        new_date = randomDate(new Date(2021, 0, 1), new Date())
                    }else if(random>0.3 && random <0.5){
                        new_date = randomDate(new Date(2021, 5, 1), new Date())
                    }else{
                        new_date = randomDate(new Date(2021, 5, 17), new Date())
                    }
                    
    
    
                    var mes = new_date.getMonth() + 1;
                    var mes_string
                    var dia = new_date.getDate()
                    var dia_string;
                    if(mes >= 0 && mes <10){
                        mes_string = '0' + mes.toString() 
                    }else{
                        mes_string = mes.toString()
                    }
    
                    if(dia >=0 && dia <10){
                        dia_string = '0' + dia.toString()
                    }else{
                        dia_string = dia.toString()
                    }
    
                    var new_date_string = new_date.getFullYear() + '-' + mes_string + '-' + dia_string
                    let id_documento = result.rows[0].id_documento;
                    
                    let insert_query = 
                    `
                        insert into busquedadocumento(id_documento, fecha) values($1,$2)
                    `
    
                    
                    client.query(insert_query, [id_documento, new_date_string],(err2,result2)=>{
                        if(err2){
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }else{
                            res.json({
                                ok: true,
                                result: response
                            });
                        }
                    })
                   
    
    
                    
                }else{
                    res.json({
                        ok: true,
                        result: result.rows
                    });
                }
            }else{
                
                let error = new Api404Error(`No hay resultados.`)
                return res.status(404).send(error)
            }
            
            
            
        }

        

    });




})

router.get('/allIndicadores',(req,res)=>{  

    
    let select_query=`SELECT * FROM indicador ORDER BY nombre asc`;

    client.query(select_query,(err,result)=>{

        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }

        res.json({
            ok: true,
            result: result.rows
        });
        

    });


})




router.get('/allCategorias',(req,res)=>{
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

router.get('/allFormatos',(req,res)=>{
    let select_query=`SELECT * FROM formato order by formato asc`;

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

router.get('/allGranularidades',(req,res)=>{
    let select_query=`SELECT * FROM granularidad order by granularidad asc`;

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


router.get('/allServiciosFuentes',(req,res)=>{
    let select_query=`SELECT * FROM serviciofuente order by institucion asc`;

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



router.get('/allDocumentosFuentes',(req,res)=>{
    let select_query=`SELECT * FROM documentofuente order by nombre asc`;

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

router.get('/allDocumentosGenerados',(req,res)=>{
    let select_query=`SELECT * FROM documentogenerado`;

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

router.get('/getDocumentosServicio/:id',(req,res)=>{
    let id_servicio = req.params.id; 
    let select_query=`
    SELECT df.id_documento, df.nombre
    FROM documentogenerado as dg, documentofuente as df
    where dg.id_servicio = $1 and dg.id_documento = df.id_documento`;

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






router.post('/getDocumentosFiltrados',(req,res)=>{

    let body = req.body


    var formatos = body.formatosSeleccionados

    var granularidades = body.granularidadesSeleccionadas

    var servicios = body.serviciosFuentesSeleccionados

    

    var array_formatos = JSON.parse(formatos)

    var array_granularidades = JSON.parse(granularidades)

    var array_servicios = JSON.parse(servicios)


    var n_formatos = array_formatos.length

    var n_granularidades = array_granularidades.length

    var n_servicios = array_servicios.length;


    var documentos_filtrados_formato= new Set()

    var documentos_filtrados_granularidad= new Set()

    var documentos_filtrados_servicio= new Set()




  
    let select_query, select_query2, select_query3, select_query4, select_query5

    if(n_formatos>=1){
        text_formatos = ""
        for(var i=0;i<n_formatos;i++){
            if(i+1 >= n_formatos){
                text_formatos+= "" + array_formatos[i] + ""
            }else{
                text_formatos+= "" + array_formatos[i] + ","
            }
            
        }

        select_query = `SELECT resultado.id_documento
                        FROM (
                            SELECT id_documento, count(*) as n_formatos 
                            FROM formatodocumento 
                            WHERE id_documento IN (${text_formatos})
                            GROUP BY id_documento) AS resultado
                        WHERE resultado.n_formatos = ${n_formatos}`
    }else{
        select_query = `SELECT distinct(id_documento) from formatodocumento`
    }
    
    client.query(select_query,(err,result)=>{
        
        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }
        if(result.rows.length == 0){
            let error = new Api404Error(`No hay resultados.`)
            return res.status(404).send(error)

        }else{
            
            for(let i=0;i<result.rows.length;i++){
                documentos_filtrados_formato.add(result.rows[i].id_documento)
            }

            if(n_granularidades>=1){
                text_granularidades = ""
                for(var i=0;i<n_granularidades;i++){
                    if(i+1 >= n_granularidades){
                        text_granularidades+= "" + array_granularidades[i] + ""
                    }else{
                        text_granularidades+= "" + array_granularidades[i] + ","
                    }
                    
                }
        
                select_query2 = `SELECT resultado.id_documento
                                FROM (
                                    SELECT id_documento, count(*) as n_granularidades 
                                    FROM granularidadocumento 
                                    WHERE id_granularidad IN (${text_granularidades})
                                    GROUP BY id_documento) AS resultado
                                WHERE resultado.n_granularidades = ${n_granularidades}`
            }else{
                select_query2 = `SELECT distinct(id_documento) from granularidadocumento`
            }



            client.query(select_query2,(err2,result2)=>{
                
                if (err2) {
                    let error = new Api503Error(`Error en el servidor.`)
                    return res.status(503).send(error)
                }
                if(result2.rows.length == 0){
                    let error = new Api404Error(`No hay resultados.`)
                    return res.status(404).send(error)
                }else{

                    
                    for(let i=0;i<result2.rows.length;i++){
                        documentos_filtrados_granularidad.add(result2.rows[i].id_documento)
                        
                    }

                    if(n_servicios>=1){
                        text_servicios = ""
                        for(var i=0;i<n_servicios;i++){
                            if(i+1 >= n_servicios){
                                text_servicios+= "" + array_servicios[i] + ""
                            }else{
                                text_servicios+= "" + array_servicios[i] + ","
                            }
                            
                        }
                
                        select_query3 = `SELECT id_documento
                        FROM documentofuente
                        WHERE id_documento IN(
                            SELECT resultado.id_documento
                            FROM (
                                select id_documento, count(*) as n_servicios
                                from documentogenerado
                                WHERE id_servicio IN (${text_servicios})
                                GROUP BY id_documento) as resultado
                            WHERE resultado.n_servicios = ${n_servicios})`

                        
                        
                        
                    }else{
                        select_query3 = `SELECT distinct(id_documento) FROM documentogenerado`
                    }

          

                    
                    client.query(select_query3,(err3,result3)=>{
                        
                        if (err3) {
                            let error = new Api503Error(`Error en el servidor.`)
                            return res.status(503).send(error)
                        }
                        if(result3.rows.length == 0){
                            let error = new Api404Error(`No hay resultados.`)
                            return res.status(404).send(error)
                        }else{
                            for(let i=0;i<result3.rows.length;i++){
                                documentos_filtrados_servicio.add(result3.rows[i].id_documento)
                            }
                            let inter1 = new Set([...documentos_filtrados_formato].filter(i => documentos_filtrados_granularidad.has(i)));
                            let inter2 = new Set([...inter1].filter(i => documentos_filtrados_servicio.has(i)));
                            var array_final = [...inter2];

                            let texto_final = ""
                            let n_final = array_final.length
                            for(var i=0;i<n_final;i++){
                                if(i+1 >= n_final){
                                    texto_final+= "'" + array_final[i] + "'"
                                }else{
                                    texto_final+= "'" + array_final[i] + "',"
                                }
                            }
                                        
                                        

                                        

                            let select_query4=
                                `
                                SELECT * 
                                FROM documentofuente
                                WHERE id_documento IN (${texto_final})
                                 `
                            client.query(select_query4,(err4,result4)=>{
                                            
                                            if (err4) {
                                                let error = new Api503Error(`Error en el servidor.`)
                                                return res.status(503).send(error)
                                            }else{
                                                res.json({
                                                    ok: true,
                                                    response: result4.rows
                                                });
                                            }
                            })
                        }
                                })



                            

                        

        

                }

                


            })
        }



    })

    



    

    


})

router.post('/getProvinciasYComunas', (req,res)=>{
    let body = req.body;

    let regiones = body.regionesSeleccionadas

    var array_regiones = JSON.parse(regiones)

    text_regiones = ""

    var n_regiones = array_regiones.length


    for(var i=0;i<n_regiones;i++){
           

        if(i+1>=n_regiones){
            text_regiones+= "region = " + "'" + array_regiones[i] + "'"
        }else{
            text_regiones+= "region = " + "'" + array_regiones[i] + "' OR "
        }
    }

    let select_query =
    `
        select cod 
        from provincia
        where ${text_regiones}
    `

    client.query(select_query,(err,result)=>{
        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            
            var array_response = []
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
                    return res.json({
                        ok: true,
                        response: array_response
                    });

                }

            })


            
            
        }
    })


})

router.post('/getComunasByProvincia', (req,res)=>{
    let body = req.body;

    let provincias = body.provinciasSeleccionadas

    var array_provincias = JSON.parse(provincias)

    text_provincias = ""

    var n_provincias = array_provincias.length


    
    for(var i=0;i<n_provincias;i++){
           

        if(i+1>=n_provincias){
            text_provincias+= "provincia = " + "'" + array_provincias[i] + "'"
        }else{
            text_provincias+= "provincia = " + "'" + array_provincias[i] + "' OR "
        }
    }

    let select_query =
    `
        select cod 
        from comuna
        where ${text_provincias}
    `

    client.query(select_query,(err,result)=>{
        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            
            var array_response = []
            for(let i=0;i<result.rows.length;i++){
                array_response.push(result.rows[i].cod)
            }

            
            return res.json({
                ok: true,
                response: array_response
            });

                

            


            
            
        }
    })


})


router.post('/getIndicadoresFiltrados', (req,res)=>{

    let body = req.body

    
    let categorias = body.categoriasSeleccionadas

    var servicios = body.serviciosFuentesSeleccionados

    var granularidades = body.granularidadesSeleccionadas

    var anyo_in = body.anyo_in 
    var anyo_fin = body.anyo_fin
    
    var array_categorias = JSON.parse(categorias)


    var array_servicios = JSON.parse(servicios)

    var array_granularidades = JSON.parse(granularidades)


    var n_categorias = array_categorias.length

    var n_servicios = array_servicios.length;

    var n_granularidades = array_granularidades.length;


    var indicadores_filtrados_categoria = new Set()

    var indicadores_filtrados_servicio= new Set()

    var indicadores_filtrados_granularidad= new Set()

    var indicadores_filtrados_fecha = new Set()
    



  
    let select_query, select_query2, select_query3;

    
    if(n_categorias>=1){

        text_categorias = ""

        for(var i=0;i<n_categorias;i++){
           

            if(i+1>=n_categorias){
                text_categorias+= "id_categoria = " + array_categorias[i] 
            }else{
                text_categorias+= "id_categoria = " + array_categorias[i] + " OR "
            }
        }

       

        /*
        for(var i=0;i<n_categorias;i++){
            if(i+1 >= n_categorias){
                text_categorias+= "'" + array_categorias[i] + "'"
            }else{
                text_categorias+= "'" + array_categorias[i] + "'" + ","
            }
            
        }
        */
        /*
        select_query = `SELECT resultado.id_indicador
        
                            FROM (
                                SELECT id_indicador, count(*) as n_categorias 
                                FROM indicadorcategorizado 
                                WHERE id_categoria IN (${text_categorias})
                                GROUP BY id_indicador) AS resultado
                            WHERE resultado.n_categorias = ${n_categorias}`

        */
        
        select_query = `
            SELECT distinct(id_indicador)
            FROM indicadorcategorizado 
            WHERE ${text_categorias}
        `
    }else{
        select_query = `SELECT distinct(id_indicador) from indicadorcategorizado`
    }
    
    client.query(select_query,(err,result)=>{
        
        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }
        if(result.rows.length == 0){
            let error = new Api404Error(`No hay resultados.`)
            return res.status(404).send(error)
        }else{
            
            for(let i=0;i<result.rows.length;i++){
                indicadores_filtrados_categoria.add(result.rows[i].id_indicador)
            }
                if(n_servicios>=1){
                    text_servicios = ""

                    for(var i=0;i<n_servicios;i++){
           

                        if(i+1>=n_servicios){
                            text_servicios+= "id_servicio = " + array_servicios[i]
                        }else{
                            text_servicios+= "id_servicio = " + array_servicios[i] + " OR "
                        }
                        
                    }

                    
                        /*
                        for(var i=0;i<n_servicios;i++){
                            if(i+1 >= n_servicios){
                                text_servicios+= "'" + array_servicios[i] + "'"
                            }else{
                                text_servicios+= "'" + array_servicios[i] + "',"
                            }
                                    
                        }
                        
                        select_query2 = 
                        `
                        SELECT id_indicador
                        FROM obtencionindicador
                        WHERE id_documento IN(
                            SELECT resultado.id_documento
                            FROM (
                                select id_documento, count(*) as n_servicios
                                from documentogenerado
                                WHERE id_servicio IN (${text_servicios})
                                GROUP BY id_documento) as resultado
                            WHERE resultado.n_servicios = ${n_servicios})
                        `
                        */
                        select_query2 = `
                        SELECT distinct(id_indicador)
                        FROM obtencionindicador
                        WHERE id_documento IN(
                            SELECT id_documento
                            FROM documentogenerado 
                            WHERE ${text_servicios}
                            GROUP BY id_documento
                        )
                        `


                }else{
                    select_query2 = `SELECT distinct(id_indicador) FROM obtencionindicador`
                }
                client.query(select_query2,(err2,result2)=>{
                    
                    if (err2) {
                        let error = new Api503Error(`Error en el servidor.`)
                        return res.status(503).send(error)
                    }else{
                        if(result2.rows.length == 0){
                            let error = new Api404Error(`No hay resultados.`)
                            return res.status(404).send(error)
                        }else{
                                       
                            for(let i=0;i<result2.rows.length;i++){                                            
                                indicadores_filtrados_servicio.add(result2.rows[i].id_indicador)
                            }
                            let select_query4;
                            if(n_granularidades >=1){
                                text_granularidades = ""
                                for(var i=0;i<n_granularidades;i++){
           

                                    if(i+1>=n_granularidades){
                                        text_granularidades+= "id_zona = " + "'" + array_granularidades[i] + "'"
                                    }else{
                                        text_granularidades+= "id_zona = " + "'" + array_granularidades[i] + "' OR "
                                    }
                                    
                                }

                                select_query4=
                                `
                                    select distinct(id_indicador)
                                    from indicadorobtencionfecha
                                    where ${text_granularidades}
                                `

                            }else{
                                select_query4 = 
                                `
                                    select id_indicador FROM indicador;
                                `
                            }

                            client.query(select_query4,(err4,result4)=>{
                                if (err4) {
                                    
                                    let error = new Api503Error(`Error en el servidor.`)
                                    return res.status(503).send(error)

                                }else{
                                    for(let i=0;i<result4.rows.length;i++){                                            
                                        indicadores_filtrados_granularidad.add(result4.rows[i].id_indicador)
                                    }
                                    let select_query5
                                    if(anyo_in == -1 && anyo_fin == -1){
                                        select_query5 = 
                                        `
                                            select id_indicador FROM indicador
                                        `
                                    }else{
                                        texto_consulta = "fecha_inicio >= '" + anyo_in + "' and fecha_fin <= '" + anyo_fin + "'"
                                        /*
                                        if(anyo_in == anyo_fin){
                                            texto_consulta = "fecha_inicio >= '" + anyo_in + "' or fecha_fin <= '" + anyo_fin+"'"
                                        }else{
                                            
                                        }
                                        */
                                        
                                        
                                        select_query5 = 
                                        `
                                        select i.id_indicador
                                        from(
                                            select distinct(id_indicador)
                                            from indicadorobtencionfecha 
                                            where ${texto_consulta}) as distintos,
                                            indicador as i
                                        where i.id_indicador = distintos.id_indicador
                                        
                                        `


                                    }

                                    client.query(select_query5,(err5,result5)=>{
                                        if (err5) {
                                            
                                            let error = new Api503Error(`Error en el servidor.`)
                                            return res.status(503).send(error)
                                        }else{

                                            for(let i=0;i<result5.rows.length;i++){                                            
                                                indicadores_filtrados_fecha.add(result5.rows[i].id_indicador)
                                            }

                                            let inter1 = new Set([...indicadores_filtrados_categoria].filter(i => indicadores_filtrados_servicio.has(i)));
                                            //let inter2 = new Set([...inter1].filter(i => indicadores_filtrados_granularidad.has(i)));
                                            let inter2 = new Set([...indicadores_filtrados_fecha].filter(i => indicadores_filtrados_granularidad.has(i)));
                                            let inter3 =  new Set([...inter1].filter(i => inter2.has(i)));           
                                            //var array_final = [...inter3];
                    
                                            var array_final = [...inter3]
                    
                                            let texto_final = ""
                                            let n_final = array_final.length
        
                                            if(array_final.length == 0){
                                                select_query3 =
                                                `
                                                    select * 
                                                    from indicador
                                                    where id_indicador = -1
                                                `
                                            }else{
                                                for(var i=0;i<n_final;i++){
                                                    if(i+1 >= n_final){
                                                        texto_final+= "'" + array_final[i] + "'"
                                                    }else{
                                                        texto_final+= "'" + array_final[i] + "',"
                                                    }           
                                                }             
                                                
                                                select_query3=
                                                `   SELECT * 
                                                    FROM indicador
                                                    WHERE id_indicador IN (${texto_final})`
                                                                
                                            }
                                            
                                            client.query(select_query3,(err3,result3)=>{
                                                
                                                if (err3) {
                                                    
                                                    let error = new Api503Error(`Error en el servidor.`)
                                                    return res.status(503).send(error)
                                                }else{
                                                    if(result3.rows.length == 0){
                                                        let error = new Api404Error(`No hay resultados.`)
                                                        return res.status(404).send(error)
                                                    }else{
                                                        res.json({
                                                            ok: true,
                                                            response: result3.rows
                                                        });
                                                    }
                                                    
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


router.post('/getDocumentosFiltrados2', (req,res)=>{

    
    let body = req.body

    let categorias = body.categoriasSeleccionadas



    var servicios = body.serviciosFuentesSeleccionados

    var formatos = body.formatosSeleccionados

    
    var array_categorias = JSON.parse(categorias)


    var array_servicios = JSON.parse(servicios)


    var array_formatos = JSON.parse(formatos)

    var n_categorias = array_categorias.length

    var n_servicios = array_servicios.length;

    var n_formatos = array_formatos.length



    var documentos_filtrados_categoria = new Set()

    var documentos_filtrados_servicio= new Set()

    var documentos_filtrados_formato = new Set() 


  
    let select_query, select_query2, select_query3, select_query4;


    
    
    if(n_categorias>=1){

        text_categorias = ""

        for(var i=0;i<n_categorias;i++){
           

            if(i+1>=n_categorias){
                text_categorias+= "id_categoria = " + array_categorias[i]
            }else{
                text_categorias+= "id_categoria = " + array_categorias[i] + " OR "
            }
        }

        

       

        /*
        for(var i=0;i<n_categorias;i++){
            if(i+1 >= n_categorias){
                text_categorias+= "'" + array_categorias[i] + "'"
            }else{
                text_categorias+= "'" + array_categorias[i] + "'" + ","
            }
            
        }
        */
        /*
        select_query = `SELECT resultado.id_indicador
        
                            FROM (
                                SELECT id_indicador, count(*) as n_categorias 
                                FROM indicadorcategorizado 
                                WHERE id_categoria IN (${text_categorias})
                                GROUP BY id_indicador) AS resultado
                            WHERE resultado.n_categorias = ${n_categorias}`

        */
        
        select_query = `

            SELECT id_documento 
            FROM(
                select distinct oi.id_documento, ic.id_categoria
                from obtencionindicador as oi, indicadorcategorizado as ic
                where oi.id_indicador = ic.id_indicador) as distintos
            WHERE ${text_categorias}

        `
    }else{
        select_query = `SELECT distinct(id_documento) from documentofuente`
    }
    
    client.query(select_query,(err,result)=>{
        
        if (err) {
            
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }
        if(result.rows.length == 0){
            let error = new Api404Error(`No hay resultados.`)
            return res.status(404).send(error)
        }else{
            
            for(let i=0;i<result.rows.length;i++){
                documentos_filtrados_categoria.add(result.rows[i].id_documento)
            }
                if(n_servicios>=1){
                    text_servicios = ""

                    for(var i=0;i<n_servicios;i++){
           

                        if(i+1>=n_servicios){
                            text_servicios+= "id_servicio = " + array_servicios[i]
                        }else{
                            text_servicios+= "id_servicio = " + array_servicios[i] + " OR "
                        }
                        
                    }

                    

                    
                        /*
                        for(var i=0;i<n_servicios;i++){
                            if(i+1 >= n_servicios){
                                text_servicios+= "'" + array_servicios[i] + "'"
                            }else{
                                text_servicios+= "'" + array_servicios[i] + "',"
                            }
                                    
                        }
                        
                        select_query2 = 
                        `
                        SELECT id_indicador
                        FROM obtencionindicador
                        WHERE id_documento IN(
                            SELECT resultado.id_documento
                            FROM (
                                select id_documento, count(*) as n_servicios
                                from documentogenerado
                                WHERE id_servicio IN (${text_servicios})
                                GROUP BY id_documento) as resultado
                            WHERE resultado.n_servicios = ${n_servicios})
                        `
                        */
                        select_query2 = `
                        select id_documento
                        from documentogenerado as dg 
                        where ${text_servicios}
                        `


                }else{
                    select_query2 = `SELECT distinct(id_documento) from documentofuente`
                }
                client.query(select_query2,(err2,result2)=>{
                    
                    if (err2) {
                        
                        let error = new Api503Error(`Error en el servidor.`)
                        return res.status(503).send(error)
                    }else{
                        if(result2.rows.length == 0){
                            let error = new Api404Error(`No hay resultados.`)
                            return res.status(404).send(error)
                        }else{
                                        
                            for(let i=0;i<result2.rows.length;i++){                                            
                                documentos_filtrados_servicio.add(result2.rows[i].id_documento)
                            }


                        if(n_formatos>=1){
                            text_formatos = ""

                            
                            for(var i=0;i<n_formatos;i++){
                

                                if(i+1>=n_formatos){
                                    text_formatos+= "id_formato = " + array_formatos[i]
                                }else{
                                    text_formatos+= "id_formato = " + array_formatos[i] + " OR "
                                }

                                
                                
                            }
                            
                            select_query3 = `
                                    select id_documento
                                    from formatodocumento as fd
                                    where ${text_formatos}
                                `
                                
                        }else{
                            select_query3 = `
                                SELECT distinct(id_documento) from documentofuente

                            `
                        }
                        
                        client.query(select_query3,(err3,result3)=>{
                            if (err3) {
                                
                                let error = new Api503Error(`Error en el servidor.`)
                                return res.status(503).send(error)
                            }

                            if(result3.rows.length == 0){
                                console.log("adios")
                                let error = new Api404Error(`No hay resultados.`)
                                return res.status(404).send(error)
                            }else{
                                for(let i=0;i<result3.rows.length;i++){                                            
                                    documentos_filtrados_formato.add(result3.rows[i].id_documento)
                                }
                                let inter1 = new Set([...documentos_filtrados_categoria].filter(i => documentos_filtrados_servicio.has(i)));
                                let inter2 = new Set([...inter1].filter(i => documentos_filtrados_formato.has(i)));

                                var array_final = [...inter2]


                                
                                
                                console.log(documentos_filtrados_categoria)
                                console.log(documentos_filtrados_servicio)
                                console.log(documentos_filtrados_formato)
                                let texto_final = ""
                                let n_final = array_final.length
                                for(var i=0;i<n_final;i++){
                                    if(i+1 >= n_final){
                                        texto_final+= "'" + array_final[i] + "'"
                                    }else{
                                        texto_final+= "'" + array_final[i] + "',"
                                    }           
                                }  
                                
                                if(texto_final.length > 0){
                                    select_query4=
                                    `   SELECT * 
                                        FROM documentofuente
                                        WHERE id_documento IN (${texto_final}) order by nombre asc`
                                }else{
                                    select_query4=
                                    `   SELECT * 
                                        FROM documentofuente
                                        WHERE id_documento = '-1'`
                                }

                                client.query(select_query4,(err4,result4)=>{
                                    
                                    if (err4) {
                                        
                                        let error = new Api503Error(`Error en el servidor.`)
                                        return res.status(503).send(error)
                                    }else{
                                        
                                        res.json({
                                            ok: true,
                                            response: result4.rows
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







module.exports = router;