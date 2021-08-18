import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { apiURL } from '../../../url.constants';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements HttpInterceptor{

    public configObservable = new Subject<boolean>()

    private token;

    private imgur: boolean = false;
    constructor(private http: HttpClient, private router:Router) { 

      
    }
  

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token: string = localStorage.getItem('token');
    
    if(token){
      req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
      
      req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

      
      
      
  
    }
    if (!req.headers.has('Content-Type')) {
       
      //req = req.clone({ headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded') }); //application/json
      //req = req.clone({ headers: req.headers.set('Content-Type', 'multipart/form-data') }); //application/json
    }

    req = req.clone({ headers: req.headers.set('Accept', '*/*') }); //application/json
    
    


    req = req.clone({ headers: req.headers.set('Access-Control-Allow-Headers', 'Authorization, Expires, Pragma, DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range') }); 
    
    return next.handle(req).pipe(
      catchError((error) => {
        console.log("acá")
        console.log(error)
        if(error.status == 501){
          
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error...',
            text: 'No estás autentificado correctamente.',
            showConfirmButton: false,
            timer: 1500
          }).then((result)=>{
            localStorage.removeItem('token')
            this.router.navigateByUrl('/homepage')
          })
          
          
          
        }else if(error.status == 10000){
          //alert('El servidor está caído o sobrecargado.')
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error...',
            text: 'Ha ocurrido un error en el servidor.',
            showConfirmButton: false,
            timer: 1500
          }).then((result)=>{
            localStorage.removeItem('token')
            this.router.navigateByUrl('/homepage')
          })
          /*
          localStorage.removeItem('token')
          this.router.navigateByUrl('/homepage')
          */
        }
        return throwError(error)
       
        //alert('Ha ocurrido un error')
        
        
      })
    );
 
  }
    


    login(payload){

      
        return this.http.post(apiURL + `auth/login`, payload);
    }



    newRequest(payload){

      
      return this.http.post(apiURL + `request/newRequest`, payload);
    }

    isLoggedIn(){
      if(localStorage.getItem('token')){
        return true;
      }else{
        return false;
      }
    }

    getUserInfo(payload){

      
      return this.http.post(apiURL + `getDataByID/getUserInfo/`,payload)
    }
    recoverPassword(payload){
      return this.http.post(apiURL + `request/recoverPassword`,payload)
    }


    


}