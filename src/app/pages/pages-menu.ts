import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },


  {
    title: 'Buscar indicadores',
    icon: 'search-outline',
    children: [
      {
        title: 'Por nombre',
        icon: 'edit-outline',
        link: '/pages/search/byname',
      },
      {
        title: 'Por filtros',
        icon: 'funnel-outline',
        link: '/pages/search/byfilters',
      },
      {
        title: 'Otros',
        icon: 'maximize-outline',
        link: '/pages/search/byothers',
      }
    ],
  },
  {
    title: 'Buscar documentos',
    icon: 'search-outline',
    children: [
      {
        title: 'Por nombre',
        icon: 'edit-outline',
        link: '/pages/searchDocuments/byname',
      },
      {
        title: 'Por filtros',
        icon: 'funnel-outline',
        link: '/pages/searchDocuments/byfilters',
      },
      {
        title: 'Otros',
        icon: 'maximize-outline',
        link: '/pages/searchDocuments/byothers',
      }
    ],
  },
  {
    title: 'Añadir',
    icon: 'plus-outline',
    link: '/pages/addData/addIndicador'
    
  }
  ,
  {
    title: 'Editar',
    icon: 'edit-outline',
    children: [
      {
        title: 'Indicador',
        icon: 'pin-outline',
        link: '/pages/edit/indicador'
        
      },
      {
        title: 'Categoria',
        icon :'checkmark-square-outline',
        link: '/pages/edit/categoria'
      },
      {
        title: 'Institución',
        icon : 'monitor-outline',
        link: '/pages/edit/institucion'
      },
      {
        title: 'Documento Fuente',
        icon: 'file-outline',
        link: '/pages/edit/documento'
      }
    ]
    
  }
  
];


export const MENU_ITEMS2: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },


  {
    title: 'Buscar indicadores',
    icon: 'search-outline',
    children: [
      {
        title: 'Por nombre',
        icon: 'edit-outline',
        link: '/pages/search/byname',
      },
      {
        title: 'Por filtros',
        icon: 'funnel-outline',
        link: '/pages/search/byfilters',
      },
      {
        title: 'Otros',
        icon: 'maximize-outline',
        link: '/pages/search/byothers',
      }
    ],
  },
  {
    title: 'Buscar documentos',
    icon: 'search-outline',
    children: [
      {
        title: 'Por nombre',
        icon: 'edit-outline',
        link: '/pages/searchDocuments/byname',
      },
      {
        title: 'Por filtros',
        icon: 'funnel-outline',
        link: '/pages/searchDocuments/byfilters',
      },
      {
        title: 'Otros',
        icon: 'maximize-outline',
        link: '/pages/searchDocuments/byothers',
      }
    ],
  }
  
];
