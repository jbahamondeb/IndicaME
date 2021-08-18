import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, OnInit, SimpleChanges } from '@angular/core';


import { CountryOrdersMapService } from '../map/country-orders-map.service';
import { NbThemeService } from '@nebular/theme';
import { combineLatest } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { LayoutService } from '../../../../@core/utils/layout.service';
import { CountryOrderData } from '../../../../@core/data/country-order';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

import * as _ from "lodash"


import { Region } from '../map/regiones';
import { Provincia } from '../map/country-orders-provincia-map/provincia';
import { Comuna } from '../map/country-orders-comuna-map/comuna';




import TileLayer from 'ol/layer/Tile'
import VectorTile from 'ol/layer/VectorTile'

import * as olProj from 'ol/proj';
import OSM from 'ol/source/OSM'



import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { GraficasIndicadoresService } from '../../graficas/graficas-indicadores.service';
import { Categoria } from '../../graficas/indicadoresCategorias/grafica-indicadores-categoria/categoria';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'ngx-map-and-graphic',
  templateUrl: './mapandgraphic.component.html',
  styleUrls: ['./mapandgraphic.component.scss'],

})
export class MapAndGraphic implements OnDestroy, AfterViewInit, OnInit {

  //@Input() countryId: string;

  //@Output() select: EventEmitter<any> = new EventEmitter();

  @Input() seleccionado: string;

  countryName: string = 'Región Metropolitana de Santiago'

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


  option: any = {};
  echartsInstance;

  label: string;



  fecha1: any;
  fecha2: any;

  colores: any;

  colores_usar: string[] = []

  count_colors: number = 0;

  categorias:  string[] = [];

  n_indicadores_categorias: string[] = [];

  array_categorias: Categoria[] = []


  valueTime: number = 40;


  disabled: boolean = true;
    highValue: number = 60;
    opcionesSlider: Options = {
      floor: 1950,
      ceil: 3000,
      disabled: true
    };


    fecha_inicio: Date;
    fecha_fin: Date;
    
    showGraph: boolean = false;
  @ViewChild('autoInputUser') inputUser : ElementRef;
  constructor(private ecMapService: CountryOrdersMapService,
              private theme: NbThemeService,
              private layoutService: LayoutService,
              private countryOrder: CountryOrderData,
              private graficasIndicadores: GraficasIndicadoresService
   ) {
    
    this.layoutService.onSafeChangeLayoutSize()
    .pipe(
      takeWhile(() => this.alive),
    )
    .subscribe(() => this.resizeChart());
    this.fecha1 = ''
    this.fecha2 = ''

    let anio_actual = new Date().getFullYear();
                  let anio_pasado = anio_actual - 5;
                  this.fecha_inicio = new Date(anio_pasado,0)
                  this.fecha_fin = new Date(anio_actual,0)
              
                  this.opcionesSlider.ceil = anio_actual
              
                  //this.valueTime = Number(this.fecha_inicio.getFullYear())
                  this.valueTime = 1950
                  this.highValue = Number(this.fecha_fin.getFullYear())
      
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
    //console.log(this.echartsInstance)
  }

  resizeChart() {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }

  activateYears(event){
    
    if(event == true){
      this.disabled = false
      this.opcionesSlider = Object.assign({}, this.opcionesSlider, {disabled: this.disabled});

      
     
    }else if(event == false){
      this.disabled = true;
      this.filterByYears()
      this.opcionesSlider = Object.assign({}, this.opcionesSlider, {disabled: this.disabled});

    }
    console.log(event)
    //
  }



  async ngOnInit(){

    combineLatest([
      this.theme.getJsTheme(),
    ])
      .pipe(takeWhile(() => this.alive))
      .subscribe(([config]: [any]) => {
        this.currentTheme = config.variables.countryOrders;
      });

    this.ecMapService.getDataGranulardad('region', this.mapaRegiones, this.regiones_array)
    this.ecMapService.getDataGranulardad('provincia', this.mapaProvincias, this.provincias_array)
    this.ecMapService.getDataGranulardad('comuna', this.mapaComunas, this.comunas_array)


    this.filteredNgModelOptions$ = of(this.regiones_array);
    this.inputFormControl = new FormControl();
 
    
    

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
          this.chargeDataGraphic('region')
          //this.select.emit("Región Metropolitana de Santiago");
          this.selectionLayer2.changed()

      }else if(this.seleccionado=== 'Provincias'){
          this.filteredNgModelOptions$ = of(this.provincias_array)
          this.inputFormControl = new FormControl();
          this.showRegiones = false;
          this.showProvincias = true;
          this.showComunas = false;
          this.id_seleccionada_country = '131'
          console.log("provincia")
          this.chargeDataGraphic('provincia')
          //this.select.emit("Santiago");
          if(this.selectionLayer4.isVisible){
            console.log("hay provincias")
            
            this.selectionLayer4.changed()

          }
          
      }else{
        this.filteredNgModelOptions$ = of(this.comunas_array)
        this.inputFormControl = new FormControl();
          this.showRegiones = false;
            this.showProvincias = false;
            this.showComunas = true;
            this.id_seleccionada_country = '13101'
            console.log("comuna")
            this.chargeDataGraphic('comuna')
            //this.select.emit("Santiago");
            if(this.selectionLayer6.isVisible){
              
              this.selectionLayer6.changed()
            }
            
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
     
      this.id_seleccionada_country = zona_seleccionada.id.toString()
      
      this.map.getView().animate({
        center: coordenadas,
        duration: 5000,
      })

      this.chargeDataGraphic('region')
      this.selectionLayer2.changed()
  
    }
    else if(this.seleccionado=== 'Provincias'){
      zona_seleccionada = this.mapaProvincias.get(event)
      let coordenadas = olProj.fromLonLat([zona_seleccionada.longitud, zona_seleccionada.latitud])
      
      this.map2.getView().animate({
        center: coordenadas,
        duration: 5000,
      })
      this.id_seleccionada_country = zona_seleccionada.id.toString()
      this.chargeDataGraphic('provincia')
      this.selectionLayer4.changed()
    }else{
      zona_seleccionada = this.mapaComunas.get(event)
      let coordenadas = olProj.fromLonLat([zona_seleccionada.longitud, zona_seleccionada.latitud])
      
      this.map3.getView().animate({
        center: coordenadas,
        duration: 5000,
      })
      this.id_seleccionada_country = zona_seleccionada.id.toString()
      this.chargeDataGraphic('comuna')
      this.selectionLayer6.changed()
    }

    

    //let region_seleccionada = this.mapaRegiones.get(event)
    
    
    //this.id_seleccionada_country = zona_seleccionada.id


    
 



    //this.select.emit(zona_seleccionada.nombre);

      
    
    
  }

  filterByYears(){
    if(this.id_seleccionada_country.length == 2){
      console.log("region")
      this.chargeDataGraphic('region')
      
    }else if(this.id_seleccionada_country.length == 3){
      console.log("provincia")
      this.chargeDataGraphic('provincia')
      
    }else if(this.id_seleccionada_country.length == 5){
      console.log("comuna")
      this.chargeDataGraphic('comuna')
      
    }
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
          this.countryName = feature.properties_.Region
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
          this.countryName = feature.properties_.Provincia
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
          this.countryName = feature.properties_.Comuna
          return this.estilo_seleccionado3;
        }
      },
    })
    


    if(this.seleccionado === 'Regiones'){
      this.id_seleccionada_country = '13'
      //this.select.emit("Región Metropolitana de Santiago");
      this.chargeDataGraphic('region');
      this.selectionLayer2.changed()

    }
    else if(this.seleccionado=== 'Provincias'){
      this.id_seleccionada_country = '131'
      //this.select.emit("Santiago");
      this.chargeDataGraphic('provincia');
      this.selectionLayer4.changed()
    }else{
      this.id_seleccionada_country = '13101'
      //this.select.emit("Santiago");
      this.chargeDataGraphic('comuna');
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
    if(this.vector_tile_layer2.values_.visible == true){
 
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
    
    }
    
 

  })

  this.map3.on(['pointermove'], (event) => {
    if(this.vector_tile_layer3.values_.visible == true){
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
    }
    
  
 

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

        this.chargeDataGraphic('region')
        this.fecha1 = '';
        this.fecha2 = '';

        this.selectionLayer2.changed()


        if (feature != this.selectedCountry) {


          this.selectedCountry = feature;
          if(this.seleccionado === 'Regiones'){
            //this.select.emit(feature.properties_.Region);
          }else if(this.seleccionado=== 'Provincias'){
            //this.select.emit(feature.properties_.Provincia);
          }else{
            //this.select.emit(feature.properties_.Comuna);
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

      this.chargeDataGraphic('provincia')
      this.fecha1 = '';
      this.fecha2 = '';

      this.selectionLayer4.changed()


      if (feature != this.selectedCountry) {


        this.selectedCountry = feature;
        if(this.seleccionado === 'Regiones'){
          //this.select.emit(feature.properties_.Region);
        }else if(this.seleccionado=== 'Provincias'){
          //this.select.emit(feature.properties_.Provincia);
        }else{
          //this.select.emit(feature.properties_.Comuna);
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

      this.chargeDataGraphic('comuna')
      this.fecha1 = '';
      this.fecha2 = '';

      this.selectionLayer6.changed()


      if (feature != this.selectedCountry) {


        this.selectedCountry = feature;
        if(this.seleccionado === 'Regiones'){
          //this.select.emit(feature.properties_.Region);
        }else if(this.seleccionado=== 'Provincias'){
          //this.select.emit(feature.properties_.Provincia);
        }else{
          //this.select.emit(feature.properties_.Comuna);
        }

        
        
  
        
      }

      //this.selectionLayer.changed()

    })
  
 

})

  }



  ngAfterViewInit(){

   
    
    
    this.graficasIndicadores.getColors().subscribe((resp:any)=>{
      this.colores = resp;
      combineLatest([
        this.theme.getJsTheme(),
      ])
        .pipe(takeWhile(() => this.alive))
        .subscribe(([config]: [any]) => {
          

          this.graficasIndicadores.getNIndicadoresPerCategories().subscribe((resp:any)=>{
          
            for(let i=0;i<resp.result.length;i++){
              let new_categoria = new Categoria()
    
              new_categoria.name = resp.result[i].nombre
              new_categoria.value = resp.result[i].n_indicadores
    
              this.array_categorias.push(new_categoria)
              
              this.categorias.push(resp.result[i].nombre)
  
              if(i>this.colores.length){
                this.count_colors++
              }
  
              this.colores_usar.push(this.colores[i][this.count_colors])
  
  
            }

            const colors = config.variables;
            const echarts: any = config.variables.echarts;
            /*
            this.option = {

              backgroundColor: echarts.bg,
              color: this.colores_usar,
              tooltip: {
                trigger: 'item',
                position: 'inside',
                formatter: '{c} ({d}%)',
                
              },
              legend: {
                type: 'scroll',
                top: 0,
                data: this.categorias,
                textStyle: {
                  color: echarts.textColor,
                },
              },
              series: [
                {
                  name: 'Categoria',
                  type: 'pie',
                  radius: '70%',
                  center: ['50%', '50%'],
                  data:this.array_categorias,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: echarts.itemHoverShadowColor,
                    },
                  },
                  label: {
                    
                    normal: {
                      show: false,
                      textStyle: {
                        color: echarts.textColor,
                      },
                    },
                  },
                  labelLine: {
                    
                    normal: {
                      show: false,
                      lineStyle: {
                        color: echarts.axisLineColor,
                      },
                    },
                  },
                },
              ],
            };*/

        });
      })
    })
  }

  simpleStyle() {
    return this.estilo_mapa;
  }



  ngOnDestroy(): void {
    this.alive = false;
  }

  onEventStartEndRange(event:any){
    
    
    if(event.start){
      this.fecha1 = event.start
      if(event.end){
        this.fecha2 = event.end;
        if(this.id_seleccionada_country.length == 2){
          console.log("Region")
        }else if(this.id_seleccionada_country.length == 3){
          console.log("provincia")
        }else if(this.id_seleccionada_country.length == 5){
          console.log("comuna")
        }
        
      }
    }
  }

  reset(){
    this.fecha1 = ''
    this.fecha2 = ''
    this.inputUser.nativeElement.value = ''; 
    this.countryOrder.getCountriesCategoriesData('09')
    


  }

  chargeDataGraphic(granularidad){
    console.log("hola")
    let fecha_inicial;
    let fecha_final;
    this.array_categorias = []
    this.categorias = []
    this.colores_usar = []
    
    if(this.disabled == true){
      fecha_inicial = -1
      fecha_final = -1;
    }else{
      fecha_inicial = this.valueTime
      fecha_final = this.highValue
    }
    console.log(fecha_inicial)
    console.log(fecha_final)
    
    if(granularidad == 'region'){
      console.log("hola")
      this.ecMapService.getDataRegion(this.id_seleccionada_country, fecha_inicial, fecha_final).subscribe((resp2:any)=>{
        this.graficasIndicadores.getColors().subscribe((resp:any)=>{
          this.colores = resp;
          combineLatest([
            this.theme.getJsTheme(),
          ])
            .pipe(takeWhile(() => this.alive))
            .subscribe(([config]: [any]) => {
              let allCero = true;
              for(let i=0;i<resp2.result.length;i++){
                let new_categoria = new Categoria()
    
                new_categoria.name = resp2.result[i].nombre
                new_categoria.value = resp2.result[i].n_indicadores
                if(resp2.result[i].n_indicadores != 0){
                  allCero = false;
                }
                this.array_categorias.push(new_categoria)
              
                this.categorias.push(resp2.result[i].nombre)
    
                if(i>this.colores.length){
                  this.count_colors++
                }
    
                this.colores_usar.push(this.colores[i][this.count_colors])
              }


              

              if(allCero){
                console.log("todos son cero")
                  this.showGraph = true;
              }else{
                console.log("no todos son cero")
                const colors = config.variables;
              const echarts: any = config.variables.echarts;
                this.showGraph = false;

                this.echartsInstance.setOption({
                  backgroundColor: echarts.bg,
                  color: this.colores_usar,
                  tooltip: {
                    trigger: 'item',
                    position: 'inside',
                    formatter: '{c} ({d}%)',
                    
                  },
                  grid:{
                    bottom: '0%'
                  },
                  legend: {
                    type: 'scroll',
                    top: 0,
                    data: this.categorias,
                    textStyle: {
                      color: echarts.textColor,
                    },
                  },
                  series: [
                    {
                      name: 'Categoria',
                      type: 'pie',
                      radius: '70%',
                      center: ['50%', '50%'],
                      data:this.array_categorias,
                      itemStyle: {
                        emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: echarts.itemHoverShadowColor,
                        },
                      },
                      label: {
                        
                        normal: {
                          show: false,
                          textStyle: {
                            color: echarts.textColor,
                          },
                        },
                      },
                      labelLine: {
                        
                        normal: {
                          show: false,
                          lineStyle: {
                            color: echarts.axisLineColor,
                          },
                        },
                      },
                    },
                  ],
                })
                console.log(this.echartsInstance)
                
                
              }
              

              

              
              /*
              this.option = {

                
              };
              */

            })
          })
      },(err:any)=>{
  
      })
    }else if(granularidad == 'provincia'){
      this.ecMapService.getDataProvincia(this.id_seleccionada_country, fecha_inicial, fecha_final).subscribe((resp2:any)=>{
        this.graficasIndicadores.getColors().subscribe((resp:any)=>{
          this.colores = resp;
          combineLatest([
            this.theme.getJsTheme(),
          ])
            .pipe(takeWhile(() => this.alive))
            .subscribe(([config]: [any]) => {
              let allCero = true;
              for(let i=0;i<resp2.result.length;i++){
                let new_categoria = new Categoria()
    
                new_categoria.name = resp2.result[i].nombre
                new_categoria.value = resp2.result[i].n_indicadores
                if(resp2.result[i].n_indicadores != 0){
                  allCero = false;
                }
                this.array_categorias.push(new_categoria)
              
                this.categorias.push(resp2.result[i].nombre)
    
                if(i>this.colores.length){
                  this.count_colors++
                }
    
                this.colores_usar.push(this.colores[i][this.count_colors])
              }


              

              if(allCero){
                console.log("todos son cero")
                  this.showGraph = true;
              }else{
                console.log("no todos son cero")
                const colors = config.variables;
              const echarts: any = config.variables.echarts;
                this.showGraph = false;

                this.echartsInstance.setOption({
                  backgroundColor: echarts.bg,
                  color: this.colores_usar,
                  tooltip: {
                    trigger: 'item',
                    position: 'inside',
                    formatter: '{c} ({d}%)',
                    
                  },
                  grid:{
                    bottom: '0%'
                  },
                  legend: {
                    type: 'scroll',
                    top: 0,
                    data: this.categorias,
                    textStyle: {
                      color: echarts.textColor,
                    },
                  },
                  series: [
                    {
                      name: 'Categoria',
                      type: 'pie',
                      radius: '70%',
                      center: ['50%', '50%'],
                      data:this.array_categorias,
                      itemStyle: {
                        emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: echarts.itemHoverShadowColor,
                        },
                      },
                      label: {
                        
                        normal: {
                          show: false,
                          textStyle: {
                            color: echarts.textColor,
                          },
                        },
                      },
                      labelLine: {
                        
                        normal: {
                          show: false,
                          lineStyle: {
                            color: echarts.axisLineColor,
                          },
                        },
                      },
                    },
                  ],
                })
                console.log(this.echartsInstance)
                
                
              }
              

              

              
              /*
              this.option = {

                
              };
              */

            })
          })
      },(err:any)=>{
  
      })
    }else if(granularidad == 'comuna'){
      this.ecMapService.getDataComuna(this.id_seleccionada_country, fecha_inicial, fecha_final).subscribe((resp2:any)=>{
        this.graficasIndicadores.getColors().subscribe((resp:any)=>{
          this.colores = resp;
          combineLatest([
            this.theme.getJsTheme(),
          ])
            .pipe(takeWhile(() => this.alive))
            .subscribe(([config]: [any]) => {
              let allCero = true;
              for(let i=0;i<resp2.result.length;i++){
                let new_categoria = new Categoria()
    
                new_categoria.name = resp2.result[i].nombre
                new_categoria.value = resp2.result[i].n_indicadores
                if(resp2.result[i].n_indicadores != 0){
                  allCero = false;
                }
                this.array_categorias.push(new_categoria)
              
                this.categorias.push(resp2.result[i].nombre)
    
                if(i>this.colores.length){
                  this.count_colors++
                }
    
                this.colores_usar.push(this.colores[i][this.count_colors])
              }


              

              if(allCero){
                console.log("todos son cero")
                  this.showGraph = true;
              }else{
                console.log("no todos son cero")
                const colors = config.variables;
              const echarts: any = config.variables.echarts;
                this.showGraph = false;

                this.echartsInstance.setOption({
                  backgroundColor: echarts.bg,
                  color: this.colores_usar,
                  tooltip: {
                    trigger: 'item',
                    position: 'inside',
                    formatter: '{c} ({d}%)',
                    
                  },
                  grid:{
                    bottom: '0%'
                  },
                  legend: {
                    type: 'scroll',
                    top: 0,
                    data: this.categorias,
                    textStyle: {
                      color: echarts.textColor,
                    },
                  },
                  series: [
                    {
                      name: 'Categoria',
                      type: 'pie',
                      radius: '70%',
                      center: ['50%', '50%'],
                      data:this.array_categorias,
                      itemStyle: {
                        emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: echarts.itemHoverShadowColor,
                        },
                      },
                      label: {
                        
                        normal: {
                          show: false,
                          textStyle: {
                            color: echarts.textColor,
                          },
                        },
                      },
                      labelLine: {
                        
                        normal: {
                          show: false,
                          lineStyle: {
                            color: echarts.axisLineColor,
                          },
                        },
                      },
                    },
                  ],
                })
                console.log(this.echartsInstance)
                
                
              }
              

              

              
              /*
              this.option = {

                
              };
              */

            })
          })
      },(err:any)=>{
  
      })
    }
    
  }

  toggleShowLayer() {
    this.showLayer = !this.showLayer;
    
    if(this.showLayer){
      this.vector_tile_layer.setVisible(true)
      this.vector_tile_layer2.setVisible(true)
      this.vector_tile_layer3.setVisible(true)
      this.selectionLayer.setVisible(true)
      this.selectionLayer2.setVisible(true)
      this.selectionLayer3.setVisible(true)
      this.selectionLayer4.setVisible(true)
      this.selectionLayer5.setVisible(true)
      this.selectionLayer6.setVisible(true)
      /*
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
  
      
      
      */
    }else{
      this.vector_tile_layer.setVisible(false)
 
        this.vector_tile_layer2.setVisible(false)
 

        this.vector_tile_layer3.setVisible(false)


      
      
      
      this.selectionLayer.setVisible(false)
      this.selectionLayer2.setVisible(false)


      this.selectionLayer3.setVisible(false)
      

    
      this.selectionLayer4.setVisible(false)
      


      this.selectionLayer5.setVisible(false)
      


      this.selectionLayer6.setVisible(false)
      

      
      
      
      /*
      if(this.seleccionado === 'Regiones'){
        
        this.vector_tile_layer.setVisible(false)
        this.selectionLayer2.setVisible(false)
      }else if(this.seleccionado=== 'Provincias'){
        this.vector_tile_layer2.setVisible(false)
        this.selectionLayer4.setVisible(false)
      }else{
        this.vector_tile_layer3.setVisible(false)
        this.selectionLayer6.setVisible(false)
      }*/

    }
  }



  
}
