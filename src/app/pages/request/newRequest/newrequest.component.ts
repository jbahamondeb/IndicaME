import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import Swal from 'sweetalert2';

import { RequestService } from '../request.service';


import { Data } from './data';

import { CustomButtonComponent } from './button/custombutton.component';


@Component({
    selector: 'ngx-newrequest',
    templateUrl: './newrequest.component.html',
    styleUrls: ['./newrequest.component.scss']
  })



  export class NewRequestComponent implements OnInit {

    settings = {
      noDataMessage: 'Sin nuevas peticiones',
      hideSubHeader: true,  
      actions: false,
      add: {
        confirmCreate: false
      },
      
      columns: {
        id:{
          title: 'ID',
          editable: false,
        },
        nombre: {
          title: 'Nombre',
          editable: false
        },
        correo: {
          title: 'Correo',
          editable: false
        },
        telefono: {
          title: 'Teléfono',
          editable: false
        },
        motivacion: {
          title: 'Motivación',
          editable: false
        },
        customAction: {
          title: 'Acciones',
          type: 'custom',
          renderComponent: CustomButtonComponent,
          onComponentInitFunction: (instance) => {
            instance.save.subscribe(row => {
              this.parentFunctionToManageTheOnClickAction(row.id);
            });

            instance.save2.subscribe(row => {
              this.parentFunctionToManageTheOnClickAction2(row.id, row.correo);
            });
          },

          addable : false,
          editable : false,
          filter: false,

        }
        
      }
    };

    source: LocalDataSource = new LocalDataSource()

    data: Data[] = [];

    loading: boolean = false;
    constructor(private requestService: RequestService){

    }
    ngOnInit(): void {
        
      
        this.requestService.getRequest().subscribe((resp:any)=>{
          console.log(resp)

          for(let i=0;i<resp.result.length;i++){
            let new_data = new Data()
            new_data.id = resp.result[i].id
            new_data.correo = resp.result[i].correo 
            new_data.nombre = resp.result[i].nombre
            new_data.motivacion = resp.result[i].motivacion
            new_data.telefono = resp.result[i].telefono 
            

            this.data.push(new_data)
          }
         
          this.source.load(this.data)

          this.source.refresh()
          
          console.log(this.data)
        },(err:any)=>{

        })
    }

    parentFunctionToManageTheOnClickAction(id){
      console.log("confirmar")
      console.log(id)
      
      Swal.fire({
        title: '¿Estás seguro de aceptar la solicitud de registro?',
        text: 'Una vez aceptada, el usuario podrá ingresar a la plataforma con sus credenciales, luego de validar su correo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Si.`,
        denyButtonText: `No.`,
        cancelButtonText: `Cancelar.`
        
      }).then((result)=>{
        if(result.value){
          this.loading = true;
          this.requestService.acceptRequest(id).subscribe((resp:any)=>{
            this.loading = false;
            Swal.fire({
              icon: 'success',
              title: 'Solicitud aceptada correctamente.',
              showConfirmButton: false,
              timer: 1500
            }).then((result2)=>{
                
                window.location.reload()
            })
          },(err:any)=>{
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error...',
              text: err.error.name,
              showConfirmButton: true
            })
          })
        }
      })
    }

    parentFunctionToManageTheOnClickAction2(id, correo){
      console.log("rechazar")
      console.log(id)

      Swal.fire({
        title: '¿Estás seguro de rechazar la solicitud de registro?',
        text: 'Una vez rechazada, el usuario no podrá ingresar a la plataforma y deberá enviar otra solicitud.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Si.`,
        denyButtonText: `No.`,
        cancelButtonText: `Cancelar.`
        
      }).then((result)=>{

        if(result.value){
          
            Swal.fire({
              title: 'Por favor indique el motivo del rechazo.',
              input: 'textarea',
              inputAttributes: {
                autocapitalize: 'off'
              },
              showCancelButton: true,
              confirmButtonText: 'Rechazar Solicitud',
              showLoaderOnConfirm: true,
              preConfirm: (login) => {
                
              },
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result2) => {
              if (result2.isConfirmed) {
                this.loading = true;
                let value = String(result2.value)
                console.log(result2.value)
                console.log(correo)
                const payload = new HttpParams()
                .set('id',JSON.stringify(id))
                .set('motivo',JSON.stringify(value))
                .set('correo',JSON.stringify(correo))

                  console.log(payload)

                this.requestService.denyRequest(payload).subscribe((resp:any)=>{
                  this.loading = false;
                  Swal.fire({
                    icon: 'success',
                    title: 'Solicitud rechazada correctamente.',
                    showConfirmButton: false,
                    timer: 1500
                  }).then((result2)=>{
                      
                      window.location.reload()
                  })
                },(err:any)=>{
                  this.loading = false;
                  Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error...',
                    text: err.error.name,
                    showConfirmButton: true
                  })
                })

                console.log(id)
              }
            })


          /*
          this.requestService.denyRequest(id).subscribe((resp:any)=>{
            console.log(resp)
            Swal.fire({
              icon: 'success',
              title: 'Solicitud rechazada correctamente.',
              showConfirmButton: false,
              timer: 1500
            }).then((result2)=>{
                
                window.location.reload()
            })
          },(err:any)=>{
            
          })*/
        }
      })
    }

    

  }