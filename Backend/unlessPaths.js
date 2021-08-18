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
        ]}
));