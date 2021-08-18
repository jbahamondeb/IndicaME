import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import { apiURL } from '../../../../url.constants';

@Injectable({
  providedIn: 'root'
})
export class GraficasIndicadoresService {

  constructor(private http: HttpClient) { }



  getNIndicadoresPerCategories(){
    return this.http.get(apiURL + `dataGraficos/getIndicadoresPerCategories`);
  }
  /*
  getNIndicadoresPerYearAndCategories(first_year: number, last_year: number){
    return this.http.get(apiURL + `dataGranularidades/getCategoriesByYears`);
  }
  */

  getNIndicadoresPerYearAndCategories(first_year: number, last_year: number){
    return this.http.get(apiURL + `dataGraficos/getNIndicadoresPerYearAndCategories/${first_year}/${last_year}`);
  }

  getColors(){
    return this.http.get('/assets/skins/colores.json')
  }

  





}
