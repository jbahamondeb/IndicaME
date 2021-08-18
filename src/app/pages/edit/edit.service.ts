import { Injectable } from '@angular/core';

import { HttpClient,HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import { apiURL } from '../../../url.constants';

@Injectable({
    providedIn: 'root'
  })


export class EditService {


    
    constructor(private http: HttpClient) { }

    deleteFile(body:any){
        return this.http.post(apiURL + `editData/deleteFile`, body)
    }
    deleteIndicador(body:any){
        return this.http.post(apiURL + `editData/deleteIndicador`, body)
    }

    deleteDocumentAsociado(body:any){
        return this.http.post(apiURL + `editData/deleteDocumentAsociado`, body)
    }
    deleteDocumentAsociado2(body:any){
        return this.http.post(apiURL + `editData/deleteDocumentAsociado2`, body)
    }

    deleteCategory(body:any){
        return this.http.post(apiURL + `editData/deleteCategory`, body)
    }

    deleteInstitucion(body:any){
        return this.http.post(apiURL + `editData/deleteInstitucion`, body)
    }

    deleteDocumento(body:any){
        return this.http.post(apiURL + `editData/deleteDocumento`, body)
    }


    editIndicador(body:any){
        return this.http.post(apiURL + `editData/editIndicador`, body)
    }

    editCategory(body:any){
        return this.http.post(apiURL + `editData/editCategory`, body)
    }

    editInstitucion(body:any){
        return this.http.post(apiURL + `editData/editInstitucion`, body)
    }

    editDocumento(body:any){
        return this.http.post(apiURL + `editData/editDocumento`, body)
    }


    getDocumentosRestantesInstitucion(body:any){
        return this.http.post(apiURL + `getDataByID/getDocumentosRestantesInstitucion`, body)
    }


    getInstitucionesRestantesDocumento(body:any){
        return this.http.post(apiURL + `getDataByID/getInstitucionesRestantesDocumento`, body)
        
    }

    getCategoriasRestantes(body:any){
        return this.http.post(apiURL + `getDataByID/getCategoriasRestantesIndicador`, body)
    }
    

    
}