import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import { apiURL } from '../../../../url.constants';



@Injectable({
    providedIn: 'root'
  })


  export class HeaderService {
    constructor(private http: HttpClient) { }


    getNotifications(){
        return this.http.get(apiURL + `request/getNotifications`)
    }
  }


  