import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Granularidad} from './granularidad'


// Estilos de Mapa
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke.js'
import Fill from 'ol/style/Fill.js'

// VectorTile
import VectorTile from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import {createXYZ} from 'ol/tilegrid'
import {MVT} from 'ol/format'

// Mapa
import OlMap  from 'ol/Map';

// Capas
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

// Vistas
import View from 'ol/View'

// Funcionalidades
import * as olProj from 'ol/proj';
import { apiURL } from '../../../../../url.constants';

@Injectable()
export class CountryOrdersMapService {





  constructor(private http: HttpClient) {
    
  }

  getCords(): Observable<any> {
    return this.http.get('assets/leaflet-countries/countries.geo.json');
  }

  getRegiones(): Observable<any>{


    return this.http.get('assets/leaflet-countries/regiones_simplificadas_005.json');
  }

  getRegiones2(): Observable<any>{

    return this.http.get('assets/leaflet-countries/regiones_datos.json')

  }

  getProvincias(): Observable<any>{
    return this.http.get('assets/leaflet-countries/provincias_simplificadas_005.json');
  }

  getProvincias2(): Observable<any>{

    return this.http.get('assets/leaflet-countries/provincias_datos.json')

  }

  getComunas(): Observable<any>{
    return this.http.get('assets/leaflet-countries/comunas_simplificadas_005.json');
  }

  getComunas2(): Observable<any>{
    return this.http.get('assets/leaflet-countries/comunas_datos.json');
  }

  async getDataGranulardad(granularidad:string, mapa: any, array: any): Promise <void>{
    var respuesta;
    if(granularidad === 'region'){
      respuesta = await this.getRegiones2().toPromise();
    }else if(granularidad === 'provincia'){
      respuesta = await this.getProvincias2().toPromise();

    }else if(granularidad === 'comuna'){
      respuesta = await this.getComunas2().toPromise();
    }
    for(let i=0;i<respuesta.length;i++){
      let new_granularidad = new Granularidad()
      new_granularidad.nombre = respuesta[i].nombre
      new_granularidad.id = respuesta[i].id

 
      new_granularidad.latitud = respuesta[i].latitud
      new_granularidad.longitud = respuesta[i].longitud
      mapa.set(new_granularidad.nombre, new_granularidad)

      array.push(new_granularidad.nombre)
    }

  }

  crearEstiloMapa(tema){
    return new Style({
      stroke : new Stroke({
        weight: tema.countryBorderWidth,
        color: 'black'
      }),
      
      fill: new Fill({
        color: tema.countryFillColor,
        opacity: 1
      }),

    })
  }

  crearEstiloHover(tema){



    return new Style({
      stroke: new Stroke({
        color: tema.hoveredCountryBorderColor,
        width: tema.hoveredCountryBorderWidth,
      }),
      fill: new Fill({
        color: '#51d1f6',
      }),
    });
  }

  crearEstiloSeleccionado(tema){
    return new Style({
      stroke: new Stroke({
        color: tema.hoveredCountryBorderColor,
        width: tema.hoveredCountryBorderWidth,
      }),
      fill: new Fill({
        color: tema.hoveredCountryFillColor,
      }),
    });
  }

  crearVectorTileLayer(layer: string, projection_epsg_no: string, estilo: any){

    return new VectorTile({
      declutter: true,
      style: estilo,
      source: new VectorTileSource({
        tilePixelRatio: 1, // oversampling when > 1
        tileGrid: createXYZ({maxZoom: 9}),
        format: new MVT(),
        url: 'geoserver/gwc/service/tms/1.0.0/' + layer +
            '@EPSG%3A'+projection_epsg_no+'@pbf/{z}/{x}/{-y}.pbf'
      })
    })
  }

  iniciarMapa(id_html: string, layers: any){
    return new OlMap({

      target: id_html,
      
      layers: layers,
      view: new View({
	      center: olProj.fromLonLat([-70.66, -33.44]),
	      zoom: 6,
        minZoom: 6,
        maxZoom: 9,
        extent: [-9020792.3, -8551163.2, -6085610.4, -1095801.2]
	    }),

    })
  }

  iniciarMapa2(id_html:string, layers:any, bounding_box:any, center: any){
    return new OlMap({

      target: id_html,
      
      layers: layers,
      view: new View({
	      center: center,
	      zoom: 6,
        minZoom: 6,
        maxZoom: 9,
        extent: bounding_box
	    }),

    })
  }

  getIntervalos(categoria:Number, granularidad){
    return this.http.get(apiURL + `getDataByID/getIntervalos/${categoria}/${granularidad}`);
  }

  getDataRegion(cod_region, anyo_in, anyo_fin){
    return this.http.get(apiURL + `dataGraficos/getDataRegion/${cod_region}/${anyo_in}/${anyo_fin}`);
  }

  getDataProvincia(cod_provincia, anyo_in, anyo_fin){
    return this.http.get(apiURL + `dataGraficos/getDataProvincia/${cod_provincia}/${anyo_in}/${anyo_fin}`);
  }

  getDataComuna(cod_comuna, anyo_in, anyo_fin){
    return this.http.get(apiURL + `dataGraficos/getDataComuna/${cod_comuna}/${anyo_in}/${anyo_fin}`);
  }




  
}
