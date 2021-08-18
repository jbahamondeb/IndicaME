const express = require('express');
var router = express.Router()
const client = require ('../dbb');

const storage = require('../multer')
const multer = require('multer')
const upload = multer({storage})

const fs = require('fs'); 
const csv = require('csv-parser');
const fastcsv= require('fast-csv');

const path = require('path')

var format = require('pg-format');

const Api400Error = require('../errorHandler/api400Error')
const Api10000Error = require('../errorHandler/api10000Error')
const Api503Error = require('../errorHandler/api503Error')
const Api404Error = require('../errorHandler/api404Error')
const Api410Error = require('../errorHandler/api410Error')


router.post('/processFile2',upload.any(), async(req,res)=>{
    var anyo_in = req.body.anyo_in
    var anyo_fin = req.body.anyo_fin
    var anyo_solo = req.body.anyo_solo

    var granularidad = req.body.granularidad
    



    
    
    

    if(anyo_in != -1 && anyo_fin != -1){
        return withintervals(req, granularidad, res)
    }else if(anyo_solo != -1){
        return oneyear(req, granularidad, res)
    }else{
        return moreyears(req, granularidad,res)
    }
    


})


function withintervals(req, granularidad, res){

    class Intervalo {
        constructor(identificador) {
          this.identificador = identificador;
          this.min_interval = -1;
          this.max_interval = -1;
        }
      }


    var campoGranularidad = req.body.campoGranularidad 
    var id_indicador =req.body.id_indicador

    
    var path = './uploads/' + req.files[0].filename


    
  
    

        
            
            
    var separator2 = "";
    let fsStream = fs.createReadStream(path);
    let csvStream = csv({})

    fsStream.pipe(csvStream)
    .on('headers', (headers) => {
        let headers_string = String(headers)
    
        if (headers_string.includes(";")){
            separator2 = ";"
        }else if(headers_string.includes(",")){
            separator2 = ","
        }else if(headers_string.includes("\t")){
            separator2 = "\t"
        }else if(headers_string.includes(".")){
            separator2 = "."
        }
        fsStream.unpipe(csvStream);
        csvStream.end();
        fsStream.destroy();    

    })

    setTimeout(readFile, 50);

    async function readFile(){
        const setGranularidades = new Set();
        const mapaGranularidades= new Map();

        var errorMessage;
    
        var FileCleanFlag = true;

        let csvstream = fastcsv.parseFile(path, { headers: true, delimiter: separator2, ignoreEmpty: true})
        .on("headers", function(headers){
                        
            if(!headers.includes(campoGranularidad)){
                let error = new Api400Error(`El nombre del campo de granularidad no está en el archivo.`)
                unlinkDocument(path)           
                res.status(400).send(error)

                
                            
                FileCleanFlag = false;

            }
        })

        .on("data", async function (data) {
            if (!FileCleanFlag) { return; }

            csvstream.pause();
            let dato_granularidad = data[campoGranularidad]
            var identificador;

            if(!setGranularidades.has(dato_granularidad)){
                setGranularidades.add(dato_granularidad)
                let select_query;

                if(granularidad == 1){
                    select_query =
                        `
                            select *, similarity(nombre, $1) as similaridad
                            from region
                            order by similaridad desc
                            limit 1
                        `
                }else if(granularidad == 2){
                    select_query =
                        `
                            select *, similarity(nombre, $1) as similaridad
                            from provincia
                            order by similaridad desc
                            limit 1
                        `
                }else if(granularidad == 3){
                    select_query =
                        `
                            select *, similarity(nombre, $1) as similaridad
                            from comuna
                            order by similaridad desc
                            limit 1
                        `
                }

                var rows;

                try{
                    rows = await client.query(select_query, [dato_granularidad])
                }catch(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    res.status(503).send(error)
                    
                    unlinkDocument(path)
                    
                }

                identificador = rows.rows[0].cod
                similaridad = rows.rows[0].similaridad
                if(similaridad < 0.2 ){
                    let error = new Api400Error(`Los nombres de la granularidad del archivo no son parecidos con ninguno de la base de datos.`)
                    res.status(400).send(error)
                    unlinkDocument(path)
                }else{
                    let new_intervalo = new Intervalo(identificador)
                    mapaGranularidades.set(dato_granularidad,new_intervalo);
                }

                mapaGranularidades.get(dato_granularidad).min_interval = req.body.anyo_in 
                mapaGranularidades.get(dato_granularidad).max_interval = req.body.anyo_fin
                csvstream.resume()

            }else{
                csvstream.resume()
            }
        })

        .on("end", function () {

            client.query('BEGIN', err =>{
                if(err){
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            res.status(503).send(error)
                            unlinkDocument(path)
                        }else{
                            let error = new Api503Error(`Error en el servidor.`)
                            res.status(503).send(error)
                            unlinkDocument(path)
                        }
                    })
                }else{
                    let insert_query = `insert into archivo(nombre) values($1) RETURNING id`
                    client.query(insert_query,[req.files[0].filename],(err, resultado)=>{
                        if (err) {
                            client.query('ROLLBACK', err => {
                                if(err){
                                    let error = new Api503Error(`Error en el servidor.`)
                                    res.status(503).send(error)
                                    unlinkDocument(path)
                                }else{
                                    let error = new Api503Error(`Error en el servidor.`)
                                    res.status(503).send(error)
                                    unlinkDocument(path)
                                }
                            })
                        }else{
                  
                            let insert_archivo_indicador =
                                `
                                    INSERT INTO indicadorarchivo values($1,$2)
                                `
                            client.query(insert_archivo_indicador, [id_indicador, resultado.rows[0].id],async(err)=>{
                                if(err){
                                    client.query('ROLLBACK', err => {
                                        if(err){
                                            let error = new Api503Error(`Error en el servidor.`)
                                            res.status(503).send(error)
                                            unlinkDocument(path)
                                        }else{
                                            let error = new Api503Error(`Error en el servidor.`)
                                            res.status(503).send(error)
                                            unlinkDocument(path)
                                        }
                                    })
                                }else{
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

                                    let values = []
                                    let values2 = []
                                    for (let [key, value] of mapaGranularidades) {
                                        let new_id_indicador = id_indicador 
                                        let new_identificador = value.identificador 
                                        let new_min_interval = value.min_interval
                                        let new_max_interval = value.max_interval 
                                        let new_archivo = resultado.rows[0].id
                                        let new_array = [new_id_indicador, new_identificador, new_min_interval, new_max_interval, 'TRUE', new_archivo]
                                        let new_array2 = [new_id_indicador,new_identificador,new_date_string]
                                        
                                        values.push(new_array)
                                        values2.push(new_array2)
                                    
                                    }

                                    let insert_query_v2 = 
                                    `
                                        INSERT INTO indicadorobtencionfecha(id_indicador, id_zona, fecha_inicio, fecha_fin,interval,id_archivo) VALUES %L
                                    `

                                    client.query(format(insert_query_v2, values), [],(err, result4)=>{
                                        if(err){
                                            client.query('ROLLBACK', err => {
                                                if(err){
                                                    let error = new Api503Error(`Error en el servidor.`)
                                                    res.status(503).send(error)
                                                    unlinkDocument(path)
                                                }else{
                                                    let error = new Api503Error(`Error en el servidor.`)
                                                    res.status(503).send(error)
                                                    unlinkDocument(path)
                                                }
                                            })
                                        }else{
                                            let insert_query2 = 
                                                `
                                                    INSERT INTO fechazonaindicador(id_indicador,id_zona,fecha) values %L
        
                                            
                                                `

                                            client.query(format(insert_query2, values2),[],(err,result4)=>{
                                                if(err){
                                                    client.query('ROLLBACK', err => {
                                                        if(err){
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            res.status(503).send(error)
                                                            unlinkDocument(path)
                                                        }else{
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            res.status(503).send(error)
                                                            unlinkDocument(path)
                                                        }
                                                    })
                                                }else{
                                                    client.query('COMMIT', err =>{
                                                        if (err) {
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            res.status(503).send(error)
                                                            unlinkDocument(path)
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
                }

            })
        })

    }
    
}

function oneyear(req, granularidad, res){

    class OneYear {
        constructor(identificador) {
          this.identificador = identificador;
          this.min_interval = -1;
          this.max_interval = -1;
        }
    }


    var campoGranularidad = req.body.campoGranularidad 
    var id_indicador = req.body.id_indicador
    var path = './uploads/' + req.files[0].filename

    var anyounico = req.body.anyo_solo

    var separator2 = "";
    let fsStream = fs.createReadStream(path);
    let csvStream = csv({})
    fsStream.pipe(csvStream)
    .on('headers', (headers) => {
        let headers_string = String(headers)
        if (headers_string.includes(";")){
            separator2 = ";"
        }else if(headers_string.includes(",")){
            separator2 = ","
        }else if(headers_string.includes("\t")){
            separator2 = "\t"
        }else if(headers_string.includes(".")){
            separator2 = "."
        }
        
        fsStream.unpipe(csvStream);
        csvStream.end();
        fsStream.destroy();    
        
    })
    setTimeout(readFile, 50);
        
    async function readFile(){
        const setGranularidades = new Set();
        const mapaGranularidades= new Map();

        var FileCleanFlag = true;
        
        let csvstream = fastcsv.parseFile(path, { headers: true, delimiter: separator2, ignoreEmpty: true})
        
        .on("headers", function(headers){   
            if(!headers.includes(campoGranularidad)){
                let error = new Api400Error(`El nombre del campo de granularidad no está en el archivo.`)
                unlinkDocument(path)           
                res.status(400).send(error)

                
                            
                FileCleanFlag = false;
            }
        })
        
        .on("data", async function (data) {
            if (!FileCleanFlag) { return; }
            csvstream.pause();
        
            let dato_granularidad = data[campoGranularidad]
        
            var identificador;
        
            if(!setGranularidades.has(dato_granularidad)){
                setGranularidades.add(dato_granularidad)
        
                let select_query;
                if(granularidad == 1){
                    select_query = 
                        `
                            select *, similarity(nombre, $1) as similaridad
                            from region
                            order by similaridad desc
                            limit 1 
                        `
                }else if(granularidad == 2){
                    select_query = 
                        `
                            select *, similarity(nombre, $1) as similaridad
                            from provincia
                            order by similaridad desc
                            limit 1
                        `
                }else if(granularidad == 3){
                    select_query = 
                        `
                            select *, similarity(nombre, $1) as similaridad
                            from comuna
                            order by similaridad desc
                            limit 1
                        `
                }
                var rows;
                try{
                    rows = await client.query(select_query,[dato_granularidad])
                }catch(err){
                    let error = new Api503Error(`Error en el servidor.`)
                    res.status(503).send(error)
                    
                    unlinkDocument(path) 
                }
        
                identificador = rows.rows[0].cod 
                similaridad = rows.rows[0].similaridad
        
                if(similaridad < 0.2 ){
                    let error = new Api400Error(`Los nombres de la granularidad del archivo no son parecidos con ninguno de la base de datos.`)
                    res.status(400).send(error)
                    unlinkDocument(path)
                }else{
                    let new_intervalo = new OneYear(identificador)
                    mapaGranularidades.set(dato_granularidad,new_intervalo);
                }
        
                mapaGranularidades.get(dato_granularidad).min_interval = anyounico
                mapaGranularidades.get(dato_granularidad).max_interval = anyounico
                mapaGranularidades.get(dato_granularidad).insertar = true
                csvstream.resume()
                                
        
            }else{
                csvstream.resume()
            }
        })
        
        .on("end", async function () {

            client.query('BEGIN', err =>{
                let insert_query = `insert into archivo(nombre) values($1) RETURNING id`

                client.query(insert_query,[req.files[0].filename],(err, resultado)=>{
                    if (err) {
                        client.query('ROLLBACK', err => {
                            if(err){
                                let error = new Api503Error(`Error en el servidor.`)
                                res.status(503).send(error)
                                unlinkDocument(path)
                            }else{
                                let error = new Api503Error(`Error en el servidor.`)
                                res.status(503).send(error)
                                unlinkDocument(path)
                            }
                        })
                    }else{
                        let insert_archivo_indicador =
                            `
                                INSERT INTO indicadorarchivo values($1,$2)
                            `
                            client.query(insert_archivo_indicador, [id_indicador, resultado.rows[0].id],async(err)=>{
                                if(err){
                                    let error = new Api503Error(`Error en el servidor.`)
                                    res.status(503).send(error)
                                    unlinkDocument(path)
                                }else{
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
                                    let values = []
                                    let values2 = []

                                    for (let [key, value] of mapaGranularidades) {

                                        let new_id_indicador = id_indicador 
                                        let new_identificador = value.identificador 
                                        let new_min_interval = value.min_interval
                                        let new_max_interval = value.max_interval 
                                        let new_archivo = resultado.rows[0].id
                                        let new_array = [new_id_indicador, new_identificador, new_min_interval, new_max_interval, 'FALSE', new_archivo]
                                        let new_array2 = [new_id_indicador,new_identificador,new_date_string]

                                        values.push(new_array)
                                        values2.push(new_array2)
                                    }

                                    let insert_query = 
                                            `
                                                INSERT INTO indicadorobtencionfecha (id_indicador, id_zona, fecha_inicio, fecha_fin,interval,id_archivo) VALUES %L
                                            `
                                    client.query(format(insert_query, values), [],(err, result4)=>{
                                        if(err){
                                            client.query('ROLLBACK', err => {
                                                if(err){
                                                    let error = new Api503Error(`Error en el servidor.`)
                                                    res.status(503).send(error)
                                                    unlinkDocument(path)
                                                }else{
                                                    let error = new Api503Error(`Error en el servidor.`)
                                                    res.status(503).send(error)
                                                    unlinkDocument(path)
                                                }
                                            })
                                        }else{
                                            let insert_query2 = 
                                            `
                                                INSERT INTO fechazonaindicador(id_indicador,id_zona,fecha) values %L
                                            `

                                            client.query(format(insert_query2, values2),[],(err,result4)=>{
                                                if(err){
                                                    client.query('ROLLBACK', err => {
                                                        if(err){
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            res.status(503).send(error)
                                                            unlinkDocument(path)
                                                        }else{
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            res.status(503).send(error)
                                                            unlinkDocument(path)
                                                        }
                                                    })
                                                }else{
                                                    client.query('COMMIT', err =>{
                                                        if (err) {
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            res.status(503).send(error)
                                                            unlinkDocument(path)
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

            
            
                           
            
        })

    }
}   

function moreyears(req, granularidad, res){

    class MoreYears {
        constructor(identificador) {
          this.identificador = identificador;
          this.years_query = [];
          this.years_csv = [];
        }
    }

    var campoGranularidad = req.body.campoGranularidad 
    var campoFecha = req.body.campoFecha
    var id_indicador = req.body.id_indicador
    var path = './uploads/' + req.files[0].filename
    console.log("hola")

    var separator2 = "";
    let fsStream = fs.createReadStream(path);
    let csvStream = csv({})
    fsStream.pipe(csvStream)
    .on('headers', (headers) => {
        let headers_string = String(headers)
        
        if (headers_string.includes(";")){
            separator2 = ";"
        }else if(headers_string.includes(",")){
            separator2 = ","
        }else if(headers_string.includes("\t")){
            separator2 = "\t"
        }else if(headers_string.includes(".")){
            separator2 = "."
        }
        fsStream.unpipe(csvStream);
        csvStream.end();
        fsStream.destroy();    
    })
        
    setTimeout(readFile, 50);
    
    async function readFile(){
        const setGranularidades = new Set();
        const mapaGranularidades= new Map();
        
        var FileCleanFlag = true;
        
        let csvstream = fastcsv.parseFile(path, { headers: true, delimiter: separator2, ignoreEmpty: true})
        .on("headers", async function(headers){
                            
            if(!headers.includes(campoGranularidad)){
                let error = new Api400Error(`El nombre del campo de granularidad no está en el archivo.`)
                unlinkDocument(path)           
                res.status(400).send(error)

                
                            
                FileCleanFlag = false;
            }else{
                if(!headers.includes(campoFecha)){
                    let error = new Api400Error(`El nombre del campo de fecha no está en el archivo.`)
                    unlinkDocument(path)           
                    res.status(400).send(error)
                    FileCleanFlag = false;
                }
            }   
        })

        .on("data", async function (data) { 
            if (!FileCleanFlag) { return; }     
            csvstream.pause();
        
            let dato_granularidad = data[campoGranularidad]
            let dato_fecha = data[campoFecha]
        
            var identificador;
            
            if(!setGranularidades.has(dato_granularidad)){
                setGranularidades.add(dato_granularidad)
                let select_query;
        
                if(granularidad == 1){
                    select_query = 
                        `
                            select *, similarity(nombre, $1) as similaridad
                            from region
                            order by similaridad desc
                            limit 1
                        `
                }else if(granularidad == 2){
                    select_query = 
                        `
                            select *, similarity(nombre, $1) as similaridad
                            from provincia
                            order by similaridad desc
                            limit 1 
                        `
                }else if(granularidad == 3){
                    select_query = 
                        `
                            select *, similarity(nombre, $1) as similaridad
                            from comuna
                            order by similaridad desc
                            limit 1
                        `
                }

                var rows;
                try{
                    rows = await client.query(select_query,[dato_granularidad])
                }catch(err){
                    
                    let error = new Api503Error(`Error en el servidor.`)
                    res.status(503).send(error)
                    
                    unlinkDocument(path)             
                }
                
                identificador = rows.rows[0].cod 
                similaridad = rows.rows[0].similaridad
        
                if(similaridad < 0.2 ){
                    console.log("error")
                    console.log(dato_granularidad)
                    let error = new Api400Error(`Los nombres de la granularidad del archivo no son parecidos con ninguno de la base de datos.`)
                    res.status(400).send(error)
                    unlinkDocument(path)
                }else{
                    let new_intervalo = new MoreYears(identificador)
                    mapaGranularidades.set(dato_granularidad,new_intervalo);
                }
                
                mapaGranularidades.get(dato_granularidad).years_csv.push(dato_fecha)
                csvstream.resume()
            }else{
                mapaGranularidades.get(dato_granularidad).years_csv.push(dato_fecha)
                csvstream.resume()

            }
        
        })
        
        .on("end", function () {
            
            client.query('BEGIN', err =>{
                if(err){
                    client.query('ROLLBACK', err => {
                        if(err){
                            let error = new Api503Error(`Error en el servidor.`)
                            res.status(503).send(error)
                            unlinkDocument(path)
                        }else{
                            let error = new Api503Error(`Error en el servidor.`)
                            res.status(503).send(error)
                            unlinkDocument(path)
                        }
                    })
                }else{
                    let insert_query = `insert into archivo(nombre) values($1) RETURNING id`

                    client.query(insert_query,[req.files[0].filename],(err, resultado)=>{
                        if (err) {
                            client.query('ROLLBACK', err => {
                                if(err){
                                    let error = new Api503Error(`Error en el servidor.`)
                                    res.status(503).send(error)
                                    unlinkDocument(path)
                                }else{
                                    let error = new Api503Error(`Error en el servidor.`)
                                    res.status(503).send(error)
                                    unlinkDocument(path)
                                }
                            })
                        }else{
                            let insert_archivo_indicador =
                                `
                                    INSERT INTO indicadorarchivo values($1,$2)
                                `
                            
                            client.query(insert_archivo_indicador, [id_indicador, resultado.rows[0].id],async(err)=>{
                                if(err){
                                    client.query('ROLLBACK', err => {
                                        if(err){
                                            let error = new Api503Error(`Error en el servidor.`)
                                            res.status(503).send(error)
                                            unlinkDocument(path)
                                        }else{
                                            let error = new Api503Error(`Error en el servidor.`)
                                            res.status(503).send(error)
                                            unlinkDocument(path)
                                        }
                                    })
                                }else{
        
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
                                    
                                    let values = []
                                    let values2 = []

                                    for (let [key, value] of mapaGranularidades) {
                                        let new_id_indicador = id_indicador 
                                        let new_identificador = value.identificador 
                                         
                                        let new_archivo = resultado.rows[0].id
                                        
                                        

                                        for(let i=0;i<value.years_csv.length;i++){
                                            let new_min_interval = value.years_csv[i]
                                            let new_max_interval = value.years_csv[i]
                                            let new_array = [new_id_indicador, new_identificador, new_min_interval, new_max_interval, 'FALSE', new_archivo]
                                            values.push(new_array)
                                        }

                                        let new_array2 = [new_id_indicador,new_identificador,new_date_string]
                                        values2.push(new_array2)

                                    }
                                    let insert_query = 
                                                `
                                                INSERT INTO indicadorobtencionfecha(id_indicador, id_zona, fecha_inicio, fecha_fin,interval,id_archivo) VALUES %L
                                                `
                                    client.query(format(insert_query, values), [],(err, result4)=>{
                                        if(err){
                                            client.query('ROLLBACK', err => {
                                                if(err){
                                                    let error = new Api503Error(`Error en el servidor.`)
                                                    res.status(503).send(error)
                                                    unlinkDocument(path)
                                                }else{
                                                    let error = new Api503Error(`Error en el servidor.`)
                                                    res.status(503).send(error)
                                                    unlinkDocument(path)
                                                }
                                            })
                                        }else{
                                            let insert_query2 = 
                                                `
                                                    INSERT INTO fechazonaindicador(id_indicador,id_zona,fecha) values %L
        
                                            
                                                `
                                            
                                            client.query(format(insert_query2, values2),[],(err,result4)=>{
                                                if(err){
                                                    client.query('ROLLBACK', err => {
                                                        if(err){
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            res.status(503).send(error)
                                                            unlinkDocument(path)
                                                        }else{
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            res.status(503).send(error)
                                                            unlinkDocument(path)
                                                        }
                                                    })
                                                }else{
                                                    client.query('COMMIT', err =>{
                                                        if (err) {
                                                            let error = new Api503Error(`Error en el servidor.`)
                                                            res.status(503).send(error)
                                                            unlinkDocument(path)
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
                }

            })       
        })
    }
}

router.post('/processFile',upload.any(), async(req,res)=>{



    var granularidad = req.body.granularidad
    var granularidadDBB
    if(granularidad == "Región"){
        granularidadDBB = 1
    }else if(granularidad == "Provincia"){
        granularidadDBB = 2
    }else if(granularidad == "Comuna"){
        granularidadDBB = 3
    }
    var anyo = req.body.anyo
    


    var hasMoreYears;
    if(anyo == "Mas"){
        hasMoreYears = true
    }else{
        hasMoreYears = false;
    }
    var campoGranularidad = req.body.campoGranularidad

    
    var campoFecha = req.body.campoFecha
    var id_indicador = req.body.id_indicador

    var path = './uploads/' + req.files[0].filename


    let insert_query = `insert into archivo(nombre) values($1) RETURNING id`


    client.query(insert_query,[req.files[0].filename],(err2,result2)=>{
        if (err2) {
           
            return res.status(400).json({
                ok: false,
                msg: "Error en la base de datos."
            });
        }else{
            var id_archivo = result2.rows[0].id 
            var separator2 = "";
            let fsStream = fs.createReadStream(path);
            let csvStream = csv({})

            fsStream.pipe(csvStream)
                .on('headers', (headers) => {


                    let headers_string = String(headers)

                    if (headers_string.includes(";")){

                        separator2 = ";"
                    }else if(headers_string.includes(",")){
                        separator2 = ","
                    }else if(headers_string.includes("\t")){
                        separator2 = "\t"
                    }else if(headers_string.includes(".")){
                        separator2 = "."
                    }

                    fsStream.unpipe(csvStream);
                    csvStream.end();
                    fsStream.destroy();    
                })
            
            setTimeout(readFile, 50);

            async function readFile(){

                    
                const setGranularidades = new Set();
                const mapaGranularidades= new Map();


                

                var errorBoolean = false;
                var errorMessage;
                let csvstream = fastcsv.parseFile(path, { headers: true, delimiter: separator2, ignoreEmpty: true})

                    .on("headers", function(headers){
                        
                        if(!headers.includes(campoGranularidad)){
                            csvstream.end()
                            errorMessage = 'El nombre del campo de granularidad no está en el archivo.'
                            unlinkDocument(path,id_archivo)
                            return res.status(400).send(errorMessage)
                            
                            
                        }

                        if(hasMoreYears){
                            if(!headers.includes(campoFecha)){
                                csvstream.end()
                                errorMessage = 'El nombre del campo de fecha no está en el archivo.'
                                unlinkDocument(path,id_archivo)
                                return res.status(400).send(errorMessage)
                                
                            }
                            
                        }
                        
                    })
                    .on("data", async function (data) {
                        csvstream.pause();
                        let dato_granularidad = data[campoGranularidad]
                        var identificador;
                        var insert_query2;
                        var insert_year;
                        if(!setGranularidades.has(dato_granularidad)){
                            
                            setGranularidades.add(dato_granularidad)
                            
                            let select_query;
                            if(granularidadDBB == 1){
                                select_query = 
                                `
                                select *, similarity(nombre, $1) as similaridad
                                from region
                                order by similaridad desc
                                limit 1
                                            
                                
                                `
                            }else if(granularidadDBB == 2){
                                select_query = 
                                `
                                select *, similarity(nombre, $1) as similaridad
                                from provincia
                                order by similaridad desc
                                limit 1
                                            
                                
                                `
                            }else if(granularidadDBB == 3){
                                select_query = 
                                `
                                select *, similarity(nombre, $1) as similaridad
                                from comuna
                                order by similaridad desc
                                limit 1
                                            
                                
                                `
                            }
                            var rows;
                            try{
                                rows = await client.query(select_query,[dato_granularidad])
                            }catch(err){
                                csvstream.end()
                                errorMessage = 'Error en la base de datos.'
                                unlinkDocument(path,id_archivo)
                                return res.status(400).send(errorMessage)
                                
                                
                                
                            }

                            identificador = rows.rows[0].cod 
                            
                                    mapaGranularidades.set(dato_granularidad,identificador);
      

                                   
            
                                    var insert_year;
                                    if(hasMoreYears){
                                        insert_year = data[campoFecha]
                                        
                                    }else{
                                        insert_year = anyo
                                    }
                                    if(granularidadDBB == 1){


                                        insert_query2 =
                                        `
                                            INSERT INTO indicadorarchivoregion(id_indicador, id_archivo, anyo, id_region) values($1, $2, $3, $4) 
                                        `


                                    }else if(granularidadDBB == 2){
                                        insert_query2 =
                                        `
                                        INSERT INTO indicadorarchivoprovincia(id_indicador, id_archivo, anyo, id_provincia) values($1, $2, $3, $4) 
                                        `
                                    }else if(granularidadDBB == 3){
                                        insert_query2 =
                                        `
                                        INSERT INTO indicadorarchivocomuna(id_indicador, id_archivo, anyo, id_comuna) values($1, $2, $3, $4) 
                                        `
                                    }
                                   
                                            
                                    
                                
                        }else{

                            identificador = mapaGranularidades.get(dato_granularidad)   


                            
                            if(hasMoreYears){
                                insert_year = data[campoFecha]
                            }else{
                                insert_year = anyo
                            }
                            if(granularidadDBB == 1){


                                insert_query2 =
                                `
                                    INSERT INTO indicadorarchivoregion(id_indicador, id_archivo, anyo, id_region) values($1, $2, $3, $4) 
                                `


                            }else if(granularidadDBB == 2){
                                insert_query2 =
                                `
                                INSERT INTO indicadorarchivoprovincia(id_indicador, id_archivo, anyo, id_provincia) values($1, $2, $3, $4) 
                                `
                            }else if(granularidadDBB == 3){
                                insert_query2 =
                                `
                                INSERT INTO indicadorarchivocomuna(id_indicador, id_archivo, anyo, id_comuna) values($1, $2, $3, $4) 
                                `
                            }

                            
                            
                        }



                        var rows2;

                        
                        try{
                            rows2 = await client.query(insert_query2,[id_indicador, id_archivo, insert_year, identificador])

                        }catch(error){
                            csvstream.end()
                            errorMessage = 'Error insertando en la base de datos. Granularidad mínima incorrecta.'
                            unlinkDocument(path, id_archivo)
                            return res.status(400).send(errorMessage)
                            
                        }
                       
                        csvstream.resume();
                    })
                    .on("end", function () {
                        return res.json({
                            ok: true,
                            response: "Archivo leído correctamente."
                        });
                       
                    })
                    .on("error", function (error) {
                        
                        errorMessage = 'Error al leer el archivo.'
                        unlinkDocument(path,id_archivo)
                        return res.status(400).send(errorMessage)
                    });

                       
                    
               
                




    
    
    
    
    






            }
        }
    })
})





async function unlinkDocument(path, id_archivo){

    var deleteDocument;
    
    /*
    var delete_query= 
    `
        DELETE FROM archivo WHERE id = $1
    `
    
    try{
        deleteDocument = await client.query(delete_query,[id_archivo])
        
    }catch(error){

        
        res.status(400).json('Error al borrar el archivo de la base de datos.')
    }

    */
    
    fs.unlink(path, (err) => {

        if (err) {
  
          
          return
        }

        

    })

    
}


router.get('/download/:id', function(req, res){
    let nombre_documento = req.params.id; 
    var path2 = `./uploads/` + nombre_documento


    res.download(path2)

});


router.post('/existName/', function(req, res){
    let nombre_documento = req.body.nombre_archivo
    //let nombre_documento = req.params.nombre_archivo; 
    

    let select_query = 
    `
    SELECT count(*) as num
    FROM archivo
    WHERE nombre = $1
    group by id
    `

    client.query(select_query,[nombre_documento], (err,result)=>{

        if (err) {
            let error = new Api503Error(`Error en el servidor.`)
            return res.status(503).send(error)
        }else{
            console.log(result.rows)
            if(result.rows.length > 0){
                let error = new Api400Error(`El archivo ${nombre_documento} ya existe en el sistema.`)
                            
                return res.status(400).send(error)
            }else{
                res.json({
                    ok: true,
                    result: result.rows
                });
            }
         
            

        }



        
        

    });



});


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

module.exports = router;
