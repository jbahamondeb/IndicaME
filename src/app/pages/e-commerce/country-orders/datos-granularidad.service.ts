import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { apiURL } from '../../../../url.constants';



@Injectable({
  providedIn: 'root'
})
export class DatosGranularidadService {

  constructor(private http: HttpClient) { 

  }


  getCategories(){
    return this.http.get(apiURL + `dataGranularidades/getCategories`);
  }

  getRegionesCategoriesData(regionName){
    
    return this.http.get(apiURL + `dataGranularidades/getRegionesCategoriesData/${regionName}`);

  }
}
