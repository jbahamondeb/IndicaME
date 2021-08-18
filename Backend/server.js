const express = require('express');
const app = express();
var cors = require('cors');
const client = require ('./dbb');
const jwt = require('jsonwebtoken')
const expressjwt = require('express-jwt')


app.use(express.json()) // Express has already a method to parse json
app.use(express.urlencoded({ extended: false })) //Allso for the url encoded



const config = require('./auth.config')


var path_auth = [
    '/auth/login'
]

var path_get_data = [
    '/getData/searchByName',
    '/getData/searchDocumentByName',
    '/getData/allIndicadores',
    '/getData/allCategorias',
    '/getData/allFormatos',
    '/getData/allServiciosFuentes',
    '/getData/allDocumentosFuentes',
    '/getData/getIndicadoresFiltrados',
    '/getData/getDocumentosFiltrados2',

]


var path_get_data_by_id = [
    '/getDataByID/getIntervalos/:id/:granularidad',
    '/getDataByID/getDocumentosServicio/:id',
    '/getDataByID/nIndicadoresByPeriod/:id/:id2',
    '/getDataByID/nIndicadoresByPeriod2/:id/:id2',
    '/getDataByID/getnCSV/:id',
    '/getDataByID/nDocumentosByPeriod/:id/:id2',
    '/getDataByID/getnAportesDocumento/:id',
    '/getDataByID/getIndicadoresByYears/:id/:id2',
    '/getDataByID/getCategorias/:id',
    '/getDataByID/getDocumentosFuentes/:id',
    '/getDataByID/getCSV/:id',
    '/getDataByID/getRegiones/:id',
    '/getDataByID/getProvincias/:id',
    '/getDataByID/getComunas/:id',
    '/getDataByID/getServiciosFuentesOfDocumento/:id',
    '/getDataByID/getCategoriaAportadaOfDocumento/:id',
    '/getDataByID/getFormatos/:id',
    '/getDataByID/getDocumentosServicio/:id',
]

var path_data_granularidades = [
    '/dataGranularidades/getCategories',
    '/dataGranularidades/getRegionesCategoriesData',

]

var path_data_graficos = [
    '/dataGraficos/getIndicadoresPerCategories',

]
//'/api/members/confirm/:id'

///^\/api\/members\/confirm\/.*/

app.use(cors({ origin: 'http://localhost:4200' }));

app.use((req, res, next) => {

    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});














app.use('/auth',require('./routes/auth'))

app.use('/addData',require('./routes/addData'))
app.use('/editData',require('./routes/editData'))

app.use('/getData',require('./routes/getData'));

app.use('/getDataByID',require('./routes/getDataByID'));
app.use('/archivos',require('./routes/archivos'));


app.use('/dataGranularidades',require('./routes/getDataGranularidades'));

app.use('/dataGraficos',require('./routes/getDataGraficos'));

app.use('/request',require('./routes/request'));


app.use(expressjwt({ secret: config.secret, algorithms: ['HS256']})
    .unless(
        { path: [
           
            '/auth/login',
            /^\/request\/confirm\/.*/,
            /^\/request\/confirmChange\/.*/,
            '/request/newRequest',
            '/request/recoverPassword',
            '/getData/searchByName',
            '/getData/searchDocumentByName',
            '/getData/allIndicadores',
            '/getData/allCategorias',
            '/getData/allFormatos',
            '/getData/allServiciosFuentes',
            '/getData/allDocumentosFuentes',
            '/getData/getIndicadoresFiltrados',
            '/getData/getDocumentosFiltrados2',
            /^\/getDataByID\/getIntervalos\/.*/,
            /^\/getDataByID\/getDocumentosServicio\/.*/,
            /^\/getDataByID\/nIndicadoresByPeriod\/.*\/.*/,
            /^\/getDataByID\/nIndicadoresByPeriod2\/.*\/.*/,
            /^\/getDataByID\/getnCSV\/.*:/,
            /^\/getDataByID\/nDocumentosByPeriod\/.*\/.*/,
            /^\/getDataByID\/getnAportesDocumento\/.*/,
            /^\/getDataByID\/getIndicadoresByYears\/.*\/.*/,
            /^\/getDataByID\/getCategorias\/.*/,
            /^\/getDataByID\/getDocumentosFuentes\/.*/,
            /^\/getDataByID\/getCSV\/.*/,
            /^\/getDataByID\/getRegiones\/.*/,
            /^\/getDataByID\/getProvincias\/.*/,
            /^\/getDataByID\/getComunas\/.*/,
            /^\/getDataByID\/getServiciosFuentesOfDocumento\/.*/,
            /^\/getDataByID\/getCategoriaAportadaOfDocumento\/.*/,
            /^\/getDataByID\/getFormatos\/.*/,
            /^\/getDataByID\/getDocumentosServicio\/.*/,
            '/dataGranularidades/getCategories',
            /^\/dataGranularidades\/getRegionesCategoriesData\/.*/,
            '/dataGraficos/getIndicadoresPerCategories',
            /^\/dataGraficos\/getDataRegion\/.*\/.*\/.*/,
            /^\/dataGraficos\/getDataProvincia\/.*\/.*\/.*/,
            /^\/dataGraficos\/getDataComuna\/.*\/.*\/.*/,
            /^\/dataGraficos\/getNIndicadoresPerYearAndCategories\/.*\/.*/,
        ]}
));


app.listen(3000,()=>{
    console.log('Conectado al puerto 3000');
})


module.exports = app;





