import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, OnInit, SimpleChanges } from '@angular/core';


import { CountryOrdersMapService } from './country-orders-map.service';
import { NbThemeService } from '@nebular/theme';
import { combineLatest } from 'rxjs';
import { takeWhile } from 'rxjs/operators';



import * as _ from "lodash"


import { Region } from './regiones';
import { Provincia } from './country-orders-provincia-map/provincia';
import { Comuna } from './country-orders-comuna-map/comuna';




import TileLayer from 'ol/layer/Tile'
import VectorTile from 'ol/layer/VectorTile'

import * as olProj from 'ol/proj';
import OSM from 'ol/source/OSM'



import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-country-orders-map',
  templateUrl: './country-orders-map.component.html',
  styleUrls: ['./country-orders-map.component.scss'],

})
export class CountryOrdersMapComponent implements OnDestroy, AfterViewInit, OnInit {

  @Input() countryId: string;

  @Output() select: EventEmitter<any> = new EventEmitter();

  @Input() seleccionado: string;

  layers = [];
  currentTheme: any;
  alive = true;
  selectedCountry;


  mapaRegiones: Map<string, Region> = new Map<string, Region>();
  regiones: string[] = [];

  mapaProvincias: Map<string, Provincia> = new Map<string, Provincia>();
  mapaComunas: Map<string, Comuna> = new Map<string, Comuna>();
  

  layerGroup: any;
  estilo_mapa: any;
  estilo_mapa2: any;
  estilo_mapa3: any;

  map: any;
  map2: any;
  map3: any;
  vector_tile_layer:any;
  vector_tile_layer2:any;
  vector_tile_layer3:any;

  id_seleccionada: any;
  id_seleccionada_country: any;

  estilo_seleccionado: any;
  estilo_seleccionado2: any;
  estilo_seleccionado3: any;
  estilo_hover:any;
  estilo_hover2:any;
  estilo_hover3:any;

  selectionLayer: any;
  selectionLayer2:any;

  selectionLayer3: any;
  selectionLayer4: any;

  selectionLayer5: any;
  selectionLayer6: any;






  inputFormControl: FormControl;
  filteredNgModelOptions$: Observable<string[]>;
  regiones_array: string[] = []
  provincias_array: string[] = []
  comunas_array: string[] = []

  value: string;



  showLayer = true;

  showRegiones: boolean = true;
  showProvincias: boolean = false;
  showComunas: boolean = false;



  constructor(private ecMapService: CountryOrdersMapService,
              private theme: NbThemeService,
   ) {
    
    

      
  }


  async ngOnInit(){

    this.ecMapService.getDataGranulardad('region', this.mapaRegiones, this.regiones_array)
    this.ecMapService.getDataGranulardad('provincia', this.mapaProvincias, this.provincias_array)
    this.ecMapService.getDataGranulardad('comuna', this.mapaComunas, this.comunas_array)


    this.filteredNgModelOptions$ = of(this.regiones_array);
    this.inputFormControl = new FormControl();
 
    
    this.chargeTheme()

    this.crearEstilos()


    this.crearVectorTileLayer()

    this.iniciarMapa()

    this.crearSelectionsLayers()

    this.crearEventoHover()

    this.crearEventoClick()

    setTimeout(() => {
      this.map.setTarget(document.getElementById('mapa'));
    }, 1000);

    setTimeout(() => {
      this.map2.setTarget(document.getElementById('mapa2v2'));
    }, 1000);

    setTimeout(() => {
      this.map3.setTarget(document.getElementById('mapa3v2'));
    }, 1000);

    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.seleccionado.currentValue != undefined && changes.seleccionado.previousValue != undefined){
      


      if(this.seleccionado === 'Regiones'){
          this.filteredNgModelOptions$ = of(this.regiones_array)
          this.inputFormControl = new FormControl();
          this.showRegiones = true;
          this.showProvincias = false;
          this.showComunas = false;


          this.id_seleccionada_country = '13'
          this.select.emit("Región Metropolitana de Santiago");
          this.selectionLayer2.changed()

      }else if(this.seleccionado=== 'Provincias'){
          this.filteredNgModelOptions$ = of(this.provincias_array)
          this.inputFormControl = new FormControl();
          this.showRegiones = false;
          this.showProvincias = true;
          this.showComunas = false;
          this.id_seleccionada_country = '131'
          this.select.emit("Santiago");
          this.selectionLayer4.changed()
      }else{
        this.filteredNgModelOptions$ = of(this.comunas_array)
        this.inputFormControl = new FormControl();
          this.showRegiones = false;
            this.showProvincias = false;
            this.showComunas = true;
            this.id_seleccionada_country = '13101'
            this.select.emit("Santiago");
            this.selectionLayer6.changed()
      }


      setTimeout(() => {
        this.map.setTarget(document.getElementById('mapa'));
      }, 1000);
  
      setTimeout(() => {
        this.map2.setTarget(document.getElementById('mapa2v2'));
      }, 1000);
  
      setTimeout(() => {
        this.map3.setTarget(document.getElementById('mapa3'));
      }, 1000);

      
    }
  }

  private filter(value: string): string[] {
  
    const filterValue = value.toLowerCase();
    if(this.seleccionado === 'Regiones'){
      return this.regiones_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
    }
    else if(this.seleccionado=== 'Provincias'){
      return this.provincias_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
    }else{
      return this.comunas_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
    }
    
 


  }

  onModelChange(value: string) {
 
    this.filteredNgModelOptions$ = of(this.filter(value));


  }

  onSelectionChange(event:any){
    let zona_seleccionada;

    if(this.seleccionado === 'Regiones'){
      
      zona_seleccionada = this.mapaRegiones.get(event)
      let coordenadas = olProj.fromLonLat([zona_seleccionada.longitud, zona_seleccionada.latitud])
     
      
      this.map.getView().animate({
        center: coordenadas,
        duration: 5000,
      })
      this.selectionLayer2.changed()
  
    }
    else if(this.seleccionado=== 'Provincias'){
      zona_seleccionada = this.mapaProvincias.get(event)
      let coordenadas = olProj.fromLonLat([zona_seleccionada.longitud, zona_seleccionada.latitud])
      
      this.map2.getView().animate({
        center: coordenadas,
        duration: 5000,
      })
      this.selectionLayer4.changed()
    }else{
      zona_seleccionada = this.mapaComunas.get(event)
      let coordenadas = olProj.fromLonLat([zona_seleccionada.longitud, zona_seleccionada.latitud])
      
      this.map3.getView().animate({
        center: coordenadas,
        duration: 5000,
      })
      this.selectionLayer6.changed()
    }

    

    //let region_seleccionada = this.mapaRegiones.get(event)
    
    
    this.id_seleccionada_country = zona_seleccionada.id


    
 



    this.select.emit(zona_seleccionada.nombre);

      
    
    
  }

  crearEstilos(){
    this.estilo_mapa = this.ecMapService.crearEstiloMapa(this.currentTheme)

    
    this.estilo_mapa2 = this.ecMapService.crearEstiloMapa(this.currentTheme)
    this.estilo_mapa3 = this.ecMapService.crearEstiloMapa(this.currentTheme)
    
    this.estilo_hover = this.ecMapService.crearEstiloHover(this.currentTheme)
    
    this.estilo_hover2 = this.ecMapService.crearEstiloHover(this.currentTheme)
    this.estilo_hover3 = this.ecMapService.crearEstiloHover(this.currentTheme)
    
    this.estilo_seleccionado = this.ecMapService.crearEstiloSeleccionado(this.currentTheme)
    
    this.estilo_seleccionado2 = this.ecMapService.crearEstiloSeleccionado(this.currentTheme)
    this.estilo_seleccionado3 = this.ecMapService.crearEstiloSeleccionado(this.currentTheme)
    
  }




  crearVectorTileLayer(){

    var layer = 'Memoria:RegionalCoordenadas'
    var layer2 = 'Memoria:ProvincialCoordenadas'
    var layer3 = 'Memoria:comunasCoordenadas'
    
    
    var projection_epsg_no = '3857';
    this.vector_tile_layer = this.ecMapService.crearVectorTileLayer(layer, projection_epsg_no, this.estilo_mapa)
    
    this.vector_tile_layer2 = this.ecMapService.crearVectorTileLayer(layer2, projection_epsg_no, this.estilo_mapa2)
    this.vector_tile_layer3 = this.ecMapService.crearVectorTileLayer(layer3, projection_epsg_no, this.estilo_mapa3)


    
  }

  iniciarMapa(){

    var layers = [
      new TileLayer({ 
        source: new OSM() 
      }),
      this.vector_tile_layer
    ]


    

    this.map = this.ecMapService.iniciarMapa('mapa',layers)

    
    var layers2 = [
      new TileLayer({ 
        source: new OSM() 
      }),
      this.vector_tile_layer2
    ]

    this.map2 = this.ecMapService.iniciarMapa('mapa2v2',layers2)

    var layers3 = [
      new TileLayer({ 
        source: new OSM() 
      }),
      this.vector_tile_layer3
    ]

    this.map3 = this.ecMapService.iniciarMapa('mapa3',layers3)
    this.map3.getView().setZoom(9)


    

  }

  crearSelectionsLayers(){
    this.selectionLayer = new VectorTile({
      map: this.map,
      renderMode: 'vector',
      source: this.vector_tile_layer.getSource(),
      style: (feature) =>{
        
        
        if (feature.properties_.id === this.id_seleccionada) {
          return this.estilo_hover;
        }
      },
    })

    this.selectionLayer2 = new VectorTile({
      map: this.map,
      renderMode: 'vector',
      source: this.vector_tile_layer.getSource(),
      style: (feature) =>{
        
        if (feature.properties_.id === this.id_seleccionada_country) {
          
          return this.estilo_seleccionado;
        }
      },
    })
    

    this.selectionLayer3 = new VectorTile({
      map: this.map2,
      renderMode: 'vector',
      source: this.vector_tile_layer2.getSource(),
      style: (feature) =>{
        
        
        if (feature.properties_.id === this.id_seleccionada) {
          return this.estilo_hover2;
        }
      },
    })

    this.selectionLayer4 = new VectorTile({
      map: this.map2,
      renderMode: 'vector',
      source: this.vector_tile_layer2.getSource(),
      style: (feature) =>{
        
        if (feature.properties_.id === this.id_seleccionada_country) {
          
          return this.estilo_seleccionado2;
        }
      },
    })

    this.selectionLayer5 = new VectorTile({
      map: this.map3,
      renderMode: 'vector',
      source: this.vector_tile_layer3.getSource(),
      style: (feature) =>{
        
        
        if (feature.properties_.id === this.id_seleccionada) {
          return this.estilo_hover3;
        }
      },
    })

    this.selectionLayer6 = new VectorTile({
      map: this.map3,
      renderMode: 'vector',
      source: this.vector_tile_layer3.getSource(),
      style: (feature) =>{
        
        if (feature.properties_.id === this.id_seleccionada_country) {
          
          return this.estilo_seleccionado3;
        }
      },
    })
    


    if(this.seleccionado === 'Regiones'){
      this.id_seleccionada_country = '13'
      this.select.emit("Región Metropolitana de Santiago");
      this.selectionLayer2.changed()
    }
    else if(this.seleccionado=== 'Provincias'){
      this.id_seleccionada_country = '131'
      this.select.emit("Santiago");
      this.selectionLayer4.changed()
    }else{
      this.id_seleccionada_country = '13101'
      this.select.emit("Santiago");
      this.selectionLayer6.changed()
    }

    
    
    


    
  }

  crearEventoHover(){
    this.map.on(['pointermove'], (event) => {
        
      this.vector_tile_layer.getFeatures(event.pixel).then((features)=>{

        if (features.length == 0) {
          this.id_seleccionada = '0'
          this.selectionLayer.changed();
          
          return;
        }

        var feature = features[0]
      

        var id_feature = feature.properties_.id;
        
        this.id_seleccionada = id_feature
        this.selectionLayer.setZIndex(4)
        this.selectionLayer.changed()
       

        //this.selectionLayer.changed()

      })
    
   

  })
  
  this.map2.on(['pointermove'], (event) => {
        
    this.vector_tile_layer2.getFeatures(event.pixel).then((features)=>{

      if (features.length == 0) {
        this.id_seleccionada = '0'
        this.selectionLayer3.changed();
        
        return;
      }

      var feature = features[0]
    

      var id_feature = feature.properties_.id;
      
      this.id_seleccionada = id_feature
      this.selectionLayer3.setZIndex(4)
      this.selectionLayer3.changed()
     

      //this.selectionLayer.changed()

    })
  
 

  })

  this.map3.on(['pointermove'], (event) => {
        
    this.vector_tile_layer3.getFeatures(event.pixel).then((features)=>{

      if (features.length == 0) {
        this.id_seleccionada = '0'
        this.selectionLayer5.changed();
        
        return;
      }

      var feature = features[0]
    

      var id_feature = feature.properties_.id;
      
      this.id_seleccionada = id_feature
      this.selectionLayer5.setZIndex(4)
      this.selectionLayer5.changed()
     

      //this.selectionLayer.changed()

    })
  
 

  })

  }

  crearEventoClick(){
      
    
    this.map.on(['click'], (event) => {
        
      this.vector_tile_layer.getFeatures(event.pixel).then((features)=>{

        if (features.length == 0) {
          
          return;
        }

        var feature = features[0]
      

        var id_feature = feature.properties_.id;
        
        this.id_seleccionada_country = id_feature

        this.selectionLayer2.changed()


        if (feature != this.selectedCountry) {


          this.selectedCountry = feature;
          if(this.seleccionado === 'Regiones'){
            this.select.emit(feature.properties_.Region);
          }else if(this.seleccionado=== 'Provincias'){
            this.select.emit(feature.properties_.Provincia);
          }else{
            this.select.emit(feature.properties_.Comuna);
          }

          
          
    
          
        }

        //this.selectionLayer.changed()

      })
    
   

  })
  
  this.map2.on(['click'], (event) => {
        
    this.vector_tile_layer2.getFeatures(event.pixel).then((features)=>{

      if (features.length == 0) {
        
        return;
      }

      var feature = features[0]
    

      var id_feature = feature.properties_.id;
      
      this.id_seleccionada_country = id_feature

      this.selectionLayer4.changed()


      if (feature != this.selectedCountry) {


        this.selectedCountry = feature;
        if(this.seleccionado === 'Regiones'){
          this.select.emit(feature.properties_.Region);
        }else if(this.seleccionado=== 'Provincias'){
          this.select.emit(feature.properties_.Provincia);
        }else{
          this.select.emit(feature.properties_.Comuna);
        }

        
        
  
        
      }

      //this.selectionLayer.changed()

    })
  
 

  })

  this.map3.on(['click'], (event) => {
        
    this.vector_tile_layer3.getFeatures(event.pixel).then((features)=>{

      if (features.length == 0) {
        
        return;
      }

      var feature = features[0]
    

      var id_feature = feature.properties_.id;
      
      this.id_seleccionada_country = id_feature

      this.selectionLayer6.changed()


      if (feature != this.selectedCountry) {


        this.selectedCountry = feature;
        if(this.seleccionado === 'Regiones'){
          this.select.emit(feature.properties_.Region);
        }else if(this.seleccionado=== 'Provincias'){
          this.select.emit(feature.properties_.Provincia);
        }else{
          this.select.emit(feature.properties_.Comuna);
        }

        
        
  
        
      }

      //this.selectionLayer.changed()

    })
  
 

})

  }



  ngAfterViewInit(){
    this.chargeTheme()
  }

  simpleStyle() {
    return this.estilo_mapa;
  }



  ngOnDestroy(): void {
    this.alive = false;
  }

  toggleShowLayer() {
    this.showLayer = !this.showLayer;
    
    if(this.showLayer){
      if(this.seleccionado === 'Regiones'){
        
        this.vector_tile_layer.setVisible(true)
        this.selectionLayer2.setVisible(true)
      }else if(this.seleccionado=== 'Provincias'){
        this.vector_tile_layer2.setVisible(true)
        this.selectionLayer4.setVisible(true)
      }else{
        this.vector_tile_layer3.setVisible(true)
        this.selectionLayer6.setVisible(true)
      }
  
      
      
      
    }else{
      if(this.seleccionado === 'Regiones'){
        
        this.vector_tile_layer.setVisible(false)
        this.selectionLayer2.setVisible(false)
      }else if(this.seleccionado=== 'Provincias'){
        this.vector_tile_layer2.setVisible(false)
        this.selectionLayer4.setVisible(false)
      }else{
        this.vector_tile_layer3.setVisible(false)
        this.selectionLayer6.setVisible(false)
      }

    }
  }

  chargeTheme(){
    combineLatest([
      this.theme.getJsTheme(),
    ])
      .pipe(takeWhile(() => this.alive))
      .subscribe(([config]: [any]) => {
        this.currentTheme = config.variables.countryOrders;
      });
  }


  
}
