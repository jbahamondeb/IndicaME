
import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';


import { Cambios } from '../../cambios';

import { ChangesService } from '../changes.service';




@Component({
    selector: 'ngx-changedata',
    templateUrl: './changedata.component.html',
    styleUrls: ['./changedata.component.scss']
  })


  export class ChangeDataComponent implements OnInit {
        
        cambios: any;

        settings = {
          noDataMessage: '',
          hideSubHeader: true,  
            actions: false,
            add: {
              confirmCreate: false
            },
            columns: {
              campo:{
                title: 'Campo',
                editable: false,
                width: '5%'
              },
              actual: {
                title: 'Actual',
                editable: false,
                width: '40%'
              },
              nuevo: {
                title: 'Nuevo',
                editable: false,
                width: '55%',
                addable : false,
                
                filter: false,
              },
            }

        }

        source: LocalDataSource = new LocalDataSource()
       

        constructor(private changeService: ChangesService, protected ref: NbDialogRef<ChangeDataComponent>){

        }

        ngOnInit(): void {
          this.source.load(this.cambios)
       
          /*
          for(let i = 0; i<this.cambios.length;i++){
            console.log(this.cambios[i])
            this.settings.columns["new_column " + i] = {
              title: this.cambios[i].campo
            }
            this.settings = Object.assign({}, this.settings)
          }

          */
          /*
          this.settings = {
            
            columns: {
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
              }
              
            }
          };*/
            console.log(this.cambios)
          /*
            for(let i=0;i<this.cambios.campos.length;i++){
              
              let new_tuple = new RowTuple()

              new_tuple.campo = this.cambios.campos[i]
              new_tuple.actual = this.cambios.actuales[i]
              new_tuple.nuevo = this.cambios.nuevos[i]

              this.tuplas.push(new_tuple)
            }*/
        }

        confirmChanges(){
          
            Swal.fire({
                title: '¿Estás seguro de realizar los cambios?',
                showCancelButton: true,
                confirmButtonText: `Si.`,
                denyButtonText: `No.`,
                cancelButtonText: `Cancelar.`
              }).then((result3)=>{
                if(result3.isConfirmed){
                    this.ref.close();
                    this.changeService.emitConfig(true)
                    
                }
              })
        
        }

        refuseChanges(){
          this.ref.close()
          this.changeService.emitConfig(false)
        }

  }
