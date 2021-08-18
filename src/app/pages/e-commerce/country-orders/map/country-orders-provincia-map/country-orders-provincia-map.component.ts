import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, OnInit } from '@angular/core';



import { CountryOrdersMapService } from '.././country-orders-map.service';
import { NbThemeService } from '@nebular/theme';
import { combineLatest } from 'rxjs';
import { takeWhile } from 'rxjs/operators';


import * as _ from "lodash"


import { Provincia } from './provincia';


import TileLayer from 'ol/layer/Tile'
import VectorTile from 'ol/layer/VectorTile'

import * as olProj from 'ol/proj';
import OSM from 'ol/source/OSM'



import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-country-orders-provincia-map',
  templateUrl: './country-orders-provincia-map.component.html',
  styleUrls: ['./country-orders-provincia-map.component.scss']
})
export class CountryOrdersProvinciaMapComponent implements OnDestroy, AfterViewInit, OnInit {


  @Input() countryId: string;

  @Output() select: EventEmitter<any> = new EventEmitter();

  layers = [];
  currentTheme: any;
  alive = true;
  selectedCountry;

  mapaProvincias: Map<string, Provincia> = new Map<string, Provincia>();



  provincias: string[] = [];

 


  layerGroup: any;

  estilo_mapa: any;

  map: any;
  vector_tile_layer:any;

  id_seleccionada: any;
  id_seleccionada_country: any;

  estilo_seleccionado: any;
  estilo_hover:any;

  selectionLayer: any;
  selectionLayer2:any;

  inputFormControl: FormControl;
  filteredNgModelOptions$: Observable<string[]>;
  provincias_array: string[] = []
  value: string;


  showLayer = true;

  constructor(private ecMapService: CountryOrdersMapService,
              private theme: NbThemeService) { 
      
       


  }

  async ngOnInit(){
   
    

    this.ecMapService.getDataGranulardad('provincia', this.mapaProvincias, this.provincias_array)
    

    this.filteredNgModelOptions$ = of(this.provincias_array);
    this.inputFormControl = new FormControl();
    



    this.chargeTheme()
    

    this.crearEstilos()


    this.crearVectorTileLayer()
    this.iniciarMapa()
    this.crearSelectionsLayers()
    this.crearEventoHover()
    this.crearEventoClick()
  }

  private filter(value: string): string[] {
  
    const filterValue = value.toLowerCase();

    return this.provincias_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
 


  }

  onModelChange(value: string) {
 
    this.filteredNgModelOptions$ = of(this.filter(value));


  }

  
  onSelectionChange(event:any){
    let provincia_seleccionada = this.mapaProvincias.get(event)
    let coordenadas = olProj.fromLonLat([provincia_seleccionada.longitud, provincia_seleccionada.latitud])

    this.map.getView().animate({
      center: coordenadas,
      duration: 2000,
    })

    this.id_seleccionada_country = provincia_seleccionada.id


    this.selectionLayer2.changed()
    this.select.emit(provincia_seleccionada.nombre);
  }

  crearEstilos(){
    this.estilo_mapa = this.ecMapService.crearEstiloMapa(this.currentTheme)
    this.estilo_hover = this.ecMapService.crearEstiloHover(this.currentTheme)
    this.estilo_seleccionado = this.ecMapService.crearEstiloSeleccionado(this.currentTheme)
  }

  crearVectorTileLayer(){
    var layer = 'Memoria:ProvincialCoordenadas';
    var projection_epsg_no = '3857';
    this.vector_tile_layer = this.ecMapService.crearVectorTileLayer(layer, projection_epsg_no, this.estilo_mapa)
  }

  
  iniciarMapa(){

    var layers = [
      new TileLayer({ 
        source: new OSM() 
      }),
      this.vector_tile_layer
    ]

    this.map = this.ecMapService.iniciarMapa('mapa2',layers)
    

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

  this.id_seleccionada_country = '131'
  this.selectionLayer2.changed()


  this.select.emit("Santiago");
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
      
          this.select.emit(feature.properties_.Provincia);
    
          
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

  chargeTheme(){
    combineLatest([
      this.theme.getJsTheme(),
    ])
      .pipe(takeWhile(() => this.alive))
      .subscribe(([config]: [any]) => {
        this.currentTheme = config.variables.countryOrders;
      });
  }

  toggleShowLayer() {
    this.showLayer = !this.showLayer;

    if(this.showLayer){
      this.vector_tile_layer.setVisible(true)
      this.selectionLayer2.setVisible(true)
    }else{
      this.vector_tile_layer.setVisible(false)
      this.selectionLayer2.setVisible(false)
    }
  }



  

}
