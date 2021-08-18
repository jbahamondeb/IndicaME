import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {apiURL} from '../../../url.constants'
@Injectable({
  providedIn: 'root'
})
export class GetDataIndicadorService {

  constructor(private http: HttpClient) {

  }

  getCategorias(id){

    return this.http.get(apiURL + `getDataByID/getCategorias/${id}`);
  }
  
  getDocumentos(id){

    return this.http.get(apiURL + `getDataByID/getDocumentosFuentes/${id}`);
  }

  getCategoriasRestantes(body: any){

    //const headers = new HttpHeaders ({'Content-Type': 'application/JSON'});
    return this.http.post(apiURL + `getDataByID/getCategoriasRestantes`, body)
  }

  getDocumentosRestantes(body: any){

    //const headers = new HttpHeaders ({'Content-Type': 'application/JSON'});
    return this.http.post(apiURL + `getDataByID/getDocumentosRestantes`, body)
  }


  getCSV(id){

    return this.http.get(apiURL + `getDataByID/getCSV/${id}`);
  }

  getRegiones(id){

    return this.http.get(apiURL + `getDataByID/getRegiones/${id}`);
  }
  getProvincias(id){

    return this.http.get(apiURL + `getDataByID/getProvincias/${id}`);
  }

  
  getComunas(id){

    return this.http.get(apiURL + `getDataByID/getComunas/${id}`);
  }


  getServiciosFuentesOfDocumento(id){
    return this.http.get(apiURL + `getDataByID/getServiciosFuentesOfDocumento/${id}`);
  }

  getCategoriaAportadaOfDocumento(id){
    return this.http.get(apiURL + `getDataByID/getCategoriaAportadaOfDocumento/${id}`);
  }

  getFormatoOfDocumento(id){
    return this.http.get(apiURL + `getDataByID/getFormatos/${id}`);
  }

  getDocumentosAsociados(id){
    return this.http.get(apiURL + `getDataByID/getDocumentosServicio/${id}`);
  }


}
