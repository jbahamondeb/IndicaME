import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {apiURL} from '../../../url.constants'

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  constructor(private http: HttpClient) { }


  
  downloadFile(name: any){

    return this.http.get(apiURL + `archivos/download/${name}`,{ headers: new HttpHeaders({'Content-Type':'application/json'}), responseType:'blob'})
  }

  existName(name_archivo:any){
    return this.http.post(apiURL + `archivos/existName/`, name_archivo)
  }

  processFile(form: any){
    return this.http.post(apiURL + `archivos/processFile2`, form)
  }


}
