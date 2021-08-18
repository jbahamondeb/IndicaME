import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Subject } from 'rxjs';

import {apiURL} from '../../../url.constants'

@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {
  public configObservable = new Subject<boolean>()
  
  constructor(private http: HttpClient) { }


  searchByName(form:any){

    return this.http.post(apiURL + `getData/searchByName`, form);
  }

  searchDocumentByName(form:any){
    return this.http.post(apiURL + `getData/searchDocumentByName`, form);
  }

  getAllIndicadores(){
    return this.http.get(apiURL + `getData/allIndicadores`);
  }

  getAllCategorias(){
    return this.http.get(apiURL + `getData/allCategorias`);
  }
  getAllServiciosFuentes(){
    return this.http.get(apiURL + `getData/allServiciosFuentes`);
  }

  getAllDocuments(){
    return this.http.get(apiURL + `getData/allDocumentosFuentes`)
  }

  getAllFormatos(){
    return this.http.get(apiURL + `getData/allFormatos`)
  }


  
  getIndicadores(body: any){
    

    //const headers = new HttpHeaders ({'Content-Type': 'application/JSON'});
    return this.http.post(apiURL + `getData/getIndicadoresFiltrados`, body)
  }

  getDocumentosFiltro(body:any){
    return this.http.post(apiURL + `getData/getDocumentosFiltrados2`, body)
  }


  getDocumentosServicio(id){
    
    return this.http.get(apiURL + `getDataByID/getDocumentosServicio/${id}`);
  }

  emitConfig(val) {
    this.configObservable.next(val);
  }

  getnIndicadoresByPeriod(periodo, orden){
    return this.http.get(apiURL + `getDataByID/nIndicadoresByPeriod/${periodo}/${orden}`)
  }

  
  getnIndicadoresByPeriod2(periodo, orden){
    return this.http.get(apiURL + `getDataByID/nIndicadoresByPeriod2/${periodo}/${orden}`)
  }

  getnCSV(orden){
    return this.http.get(apiURL + `getDataByID/getnCSV/${orden}`)
  }

  getnDocumentosByPeriod(periodo, orden){
    return this.http.get(apiURL + `getDataByID/nDocumentosByPeriod/${periodo}/${orden}`)
  }
  getnAportesDocumento(orden){
    return this.http.get(apiURL + `getDataByID/getnAportesDocumento/${orden}`)
  }

  getIndicadoresByYears(anyo_in, anyo_fin){
    return this.http.get(apiURL + `getDataByID/getIndicadoresByYears/${anyo_in}/${anyo_fin}`)
  }

  getRegiones(){
    return this.http.get('/assets/leaflet-countries/regiones_datos.json')

  }

  getProvinciasYComunas(payload){
    return this.http.post(apiURL + `getData/getProvinciasYComunas`, payload)
  }

  getComunasByProvincia(payload){
    return this.http.post(apiURL + `getData/getComunasByProvincia`, payload)
  }

  getProvincias(){
    return this.http.get('/assets/leaflet-countries/provincias_datos.json')

  }

  getComunas(){
    return this.http.get('/assets/leaflet-countries/comunas_datos.json')

  }
}
