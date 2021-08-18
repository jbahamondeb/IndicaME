import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, OnInit, SimpleChanges,Renderer2, Directive, ElementRef } from '@angular/core';




import { Observable, of } from 'rxjs';


import TileLayer from 'ol/layer/Tile'

import Image from 'ol/layer/Image.js'
import ImageWMS from 'ol/source/ImageWMS'

import VectorTile from 'ol/layer/VectorTile'
import * as olProj from 'ol/proj';
import OSM from 'ol/source/OSM'
import View from 'ol/View'


import { CountryOrdersMapService } from '../map/country-orders-map.service';

import {Intervalo} from './intervalos'

import { SearchServiceService } from '../../../search/search-service.service';


@Component({
  selector: 'ngx-country-orders-map2',
  templateUrl: './country-orders-map2.component.html',
  styleUrls: ['./country-orders-map2.component.scss'],

})


export class CountryOrdersMapComponent2 implements OnDestroy, OnInit {
    @Input() seleccionado: string;


    alive = true;


    map: any;
    map2: any;
    map3: any;

    textos: Intervalo[] = []


    arrays_colors: string[] = []

    arrays_colors_used: string[] = []



    selectedCategoria = 12;

    categorias:any;

 



    
  constructor(private ecMapService: CountryOrdersMapService, private searchService: SearchServiceService) {
    
    

      
  }


   ngOnInit(){

    this.arrays_colors.push('#EDF8FB')
    this.arrays_colors.push('#B2E2E2')
    this.arrays_colors.push('#66C2A4')
    this.arrays_colors.push('#2CA25F')
    this.arrays_colors.push('#006d2c')

    
    
    
    
    
    
   
    
    //this.arrays_colors.push('#006d2c')

    

    this.searchService.getAllCategorias().subscribe((resp:any)=>{
      this.categorias = resp.result

      console.log(this.categorias)

    },(err:any)=>{

    })
    /*
    var layers = [
      new TileLayer({ 
        source: new OSM(),
        name: 'osm'
      }),

      new Image({
        extent: [-12184465.5292, -7554435.5874, -7393641.8015, -1978919.7457],
        source: new ImageWMS({
          url: 'geoserver/wms/',
          params: {'LAYERS':'Memoria:mapaCoropleticoRegiones','viewparams':'CATEGORIA:1'},
          ratio:1,
          serverType:'geoserver',
        }),
        name: 'wms'
      })
    ]*/

    var layers = [
      new TileLayer({ 
        source: new OSM(),
        name: 'osm'
      }),

      new Image({
        extent: [-10958012.3750, -4427232.6783, -7430902.1418, -1966571.8637],
        source: new ImageWMS({
          url: 'geoserver/wms/',
          params: {'LAYERS':'Memoria:mapaCoropleticoRegiones','viewparams':'CATEGORIA:1'},
          ratio:1,
          serverType:'geoserver',
        }),
        name: 'wms'
      })
    ]

    var layers2 = [
      new TileLayer({ 
        source: new OSM(),
        name: 'osm'
      }),

      new Image({
        extent: [-8443529.8925, -7611905.0248, -7024868.6475, -4361476.4669],
        source: new ImageWMS({
          url: 'geoserver/wms/',
          params: {'LAYERS':'Memoria:mapaCoropleticoRegiones','viewparams':'CATEGORIA:1'},
          ratio:1,
          serverType:'geoserver',
        }),
        name: 'wms'
      })
    ]



    /*
    var layers = [
      new TileLayer({ 
        source: new OSM(),
        name: 'osm'
      }),

      new Image({
        extent: [-8049736.3228, -3463514.6257, -7450470.0210, -1954341.9392],
        source: new ImageWMS({
          url: 'geoserver/wms/',
          params: {'LAYERS':'Memoria:mapaCoropleticoRegiones','viewparams':'CATEGORIA:1'},
          ratio:1,
          serverType:'geoserver',
        }),
        name: 'wms'
      })
    ]

    var layers2 = [
      new TileLayer({ 
        source: new OSM(),
        name: 'osm'
      }),

      new Image({
        extent: [-9414595.8998, -4899307.7650, -7724420.3304, -3463514.6257],
        source: new ImageWMS({
          url: 'geoserver/wms/',
          params: {'LAYERS':'Memoria:mapaCoropleticoRegiones','viewparams':'CATEGORIA:1'},
          ratio:1,
          serverType:'geoserver',
        }),
        name: 'wms'
      })
    ]

    var layers3 = [
      new TileLayer({ 
        source: new OSM(),
        name: 'osm'
      }),

      new Image({
        extent: [-8565839.1377, -7582553.2059, -7318386.8361, -4901753.7499],
        source: new ImageWMS({
          url: 'geoserver/wms/',
          params: {'LAYERS':'Memoria:mapaCoropleticoRegiones','viewparams':'CATEGORIA:1'},
          ratio:1,
          serverType:'geoserver',
        }),
        name: 'wms'
      })
    ]
    */
    //(minx, miny, maxx, maxy)
    
    //var bounding_box = [-9720344.0130, -3583367.8860,-5843457.9383,-1932328.0750]
    var bounding_box_zona_norte = [-10958012.3750, -4427232.6783, -7430902.1418, -1966571.8637]
    //var center = [-7740319.2323,-2716266.2371]
    var center = [-7865064.4624, -3956380.5940]

    this.map = this.ecMapService.iniciarMapa2('mapa2',layers, bounding_box_zona_norte, center)

    this.map.getView().setZoom(6)


    //var bounding_box = [-8756625.9603,-4691399.0480,-7736650.2549, -3588259.8558]
    //var bounding_box_zona_centro_sur = [-9414595.8998, -4899307.7650, -7724420.3304, -3463514.6257]
    var bounding_box_zona_centro_sur = [-8443529.8925, -7611905.0248, -7024868.6475, -4361476.4669]
    //var center = [-7865675.9587, -3950877.1180]
    var center = [-8081228.3784, -4684978.3377]
    this.map2 = this.ecMapService.iniciarMapa2('mapaNuevo',layers2, bounding_box_zona_centro_sur, center)
    this.map2.getView().setZoom(6)
    /*
    var bounding_box_zona_sur = [-8565839.1377, -7582553.2059, -7318386.8361, -4901753.7499]
    var center = [-8119446.8926, -5079087.6555]
    
    this.map3 = this.ecMapService.iniciarMapa2('mapaNuevo2',layers3, bounding_box_zona_sur, center)
    //this.map = this.ecMapService.iniciarMapa('mapa2',layers)
    */

    this.createCategories(1)

  }


  createCategories(granularidad){

    this.arrays_colors_used = [...this.arrays_colors]

    this.textos = []
    
    this.ecMapService.getIntervalos(this.selectedCategoria,granularidad).subscribe((resp:any)=>{

      var arreglo = resp.result;
      
      var length_array = arreglo.length;

      

      

      for(let i=0;i<length_array;i++){

        if(arreglo[i].intervalo != '[]'){
          let new_intervalo = new Intervalo()
          new_intervalo.texto = arreglo[i].intervalo
          new_intervalo.color = this.arrays_colors_used[0]
          this.arrays_colors_used.shift()
          this.textos.push(new_intervalo)
        }
        

      }

      

      


      /*
      var jenks = resp.result[0].jenks;
 
      var length_array = jenks.length;
      for(let i=0;i<length_array;i++){
        
        let string_intervalo;

        
        if(i+1 < length_array && i+1 != length_array - 1){
          
          string_intervalo = "[" + jenks[i] + "-" + jenks[i+1] + "["
        }else if(i == length_array - 1 && i!=0){
          
          string_intervalo = "[" + jenks[i-1] + "-" + jenks[i] + "]"
        }

      
        if(string_intervalo != undefined){
          let new_intervalo = new Intervalo()
          new_intervalo.texto = string_intervalo
          new_intervalo.color = this.arrays_colors_used[0]
          this.arrays_colors_used.shift()

          this.textos.push(new_intervalo)

        }
      }
      */
     
    },(err:any)=>{

    })
  }

  ngOnChanges(changes: SimpleChanges): void {



    if(changes.seleccionado.currentValue != undefined && changes.seleccionado.previousValue != undefined){
      
      this.selectedCategoria = 12
      this.colorearMapa()


      
    }

      
          
    
    /*
    if (changes.data && !changes.data.isFirstChange()) {

      
    }*/
  }

 









  ngOnDestroy(): void {
    this.alive = false;
  }

  onChange(event:any){
    
    this.selectedCategoria = event;

    this.colorearMapa()

    //this.createCategories(this.seleccionado)


  }

  colorearMapa(){
    this.map.getLayers().getArray()
      .filter(layer => layer.get('name') === 'wms')
      .forEach(layer => this.map.removeLayer(layer));


    this.map2.getLayers().getArray()
      .filter(layer => layer.get('name') === 'wms')
      .forEach(layer => this.map.removeLayer(layer));
    
      /*
    this.map3.getLayers().getArray()
      .filter(layer => layer.get('name') === 'wms')
      .forEach(layer => this.map.removeLayer(layer));
    */
      var nameMapa;

      if(this.seleccionado === 'Regiones'){
        nameMapa = 'Memoria:mapaCoropleticoRegiones'  
        this.createCategories(1)
      }else if(this.seleccionado=== 'Provincias'){
        nameMapa = 'Memoria:mapaCoropleticoProvincias'
        this.createCategories(2)
      }else{
        nameMapa = 'Memoria:mapaCoropleticoComunas'
        this.createCategories(3)
      }
      
      var capa = new Image({
        extent: [-10958012.3750, -4427232.6783, -7430902.1418, -1966571.8637],
        source: new ImageWMS({
          url: 'geoserver/wms/',
          params: {'LAYERS':nameMapa,'viewparams':'CATEGORIA:'+this.selectedCategoria},
          ratio:1,
          serverType:'geoserver',
        }),
        name: 'wms'
      })



      this.map.addLayer(capa)

      var capa2 = new Image({
        extent: [-8443529.8925, -7611905.0248, -7024868.6475, -4361476.4669],
        source: new ImageWMS({
          url: 'geoserver/wms/',
          params: {'LAYERS':nameMapa,'viewparams':'CATEGORIA:'+this.selectedCategoria},
          ratio:1,
          serverType:'geoserver',
        }),
        name: 'wms'
      })

      this.map2.addLayer(capa2)
      /*
      var capa3 = new Image({
        extent: [-8565839.1377, -7582553.2059, -7318386.8361, -4901753.7499],
        source: new ImageWMS({
          url: 'geoserver/wms/',
          params: {'LAYERS':nameMapa,'viewparams':'CATEGORIA:'+this.selectedCategoria},
          ratio:1,
          serverType:'geoserver',
        }),
        name: 'wms'
      })

      this.map3.addLayer(capa3)
      
      */
  }





  
}
