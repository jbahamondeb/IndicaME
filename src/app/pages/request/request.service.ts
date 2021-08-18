import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import { apiURL } from '../../../url.constants';



@Injectable({
    providedIn: 'root'
  })


  export class RequestService {
    constructor(private http: HttpClient) { }


    getRequest(){
        return this.http.get(apiURL + `request/getAllRequest`)
    }

    acceptRequest(id){
        return this.http.get(apiURL + `request/acceptRequest/${id}`)
    }

    denyRequest(payload:any){
        
        return this.http.post(apiURL + `request/denyRequest/`,payload)
    }
  }


  