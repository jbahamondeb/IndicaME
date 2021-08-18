import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { apiURL } from '../../../url.constants';

import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
  })

  export class AddDataServiceService {
    constructor(private http: HttpClient) { }


    addCategorie(body){
        return this.http.post(apiURL + `addData/addCategorie`, body)
    }

    addService(body){
      return this.http.post(apiURL + `addData/addService`, body)
    }

    addDocument(body){
      return this.http.post(apiURL + `addData/addDocument`, body)
    }

    addIndicador(body){
      return this.http.post(apiURL + `addData/addIndicador`, body)
    }

  }