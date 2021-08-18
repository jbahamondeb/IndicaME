import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Observable, of } from 'rxjs';

import { SearchServiceService } from '../../search/search-service.service';

import Swal from 'sweetalert2';
import { EditService } from '../edit.service';
import { HttpParams } from '@angular/common/http';

import jwt_decode from 'jwt-decode';
import { NbDialogService } from '@nebular/theme';

import { ChangeDataComponent } from '../../changes/changeData/changedata.component';

import { Cambios } from '../../cambios';

import { ChangesService } from '../../changes/changes.service';

import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';


@Component({
    selector: 'ngx-editCategoria',
    templateUrl: './editCategoria.component.html',
    styleUrls: ['./editCategoria.component.scss']
  })


  export class EditCategoriaComponent implements OnInit {

    categorias: any;
    categoriasMapa = new Map<string, string>();

    selectedCategoria = ''

    categoriaSelect = '';

    firstFormGroup: FormGroup;
    categoriaId:any;

    tipo_user: any;
    admin = false;

    dialogref: any;
    
    private alive = true;
    breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
    breakpoints: any;
      constructor(private searchService: SearchServiceService,private fb: FormBuilder,
         private editService:EditService, private dialogService: NbDialogService, private changeService: ChangesService,
         private breakpointService: NbMediaBreakpointsService,
                    private themeService: NbThemeService){

                        this.breakpoints = this.breakpointService.getBreakpointsMap();
        let local_storage;
        local_storage = localStorage.getItem('token')


        if(local_storage){
            let decode = this.getDecodedAccessToken(local_storage)
          this.tipo_user = decode.tipo
  
          if(this.tipo_user == 1){
            this.admin = true;
          }
        }

        
        this.firstFormGroup = this.fb.group({
            nombre: [''],
            
        });
      }

      getDecodedAccessToken(token: string): any {
        try{
            return jwt_decode(token);
        }
        catch(Error){
            return null;
        }
      }
    

      ngOnInit(): void {

        this.themeService.onMediaQueryChange()
        .pipe(takeWhile(() => this.alive))
        .subscribe(([oldValue, newValue]) => {
            this.breakpoint = newValue;
        });
        this.searchService.getAllCategorias().subscribe((resp:any)=>{
            this.categorias = resp.result;
            for(let i = 0;i<resp.result.length;i++){
                this.categoriasMapa[resp.result[i].id_categoria] = resp.result[i].nombre;
            }

            
        },(err)=>{

        })

        this.changeService.configObservable.subscribe(value =>{
            if(value == true){
                this.modify()
            }
        })
      }

      categoriaSeleccionada(event){
        this.categoriaId = event;
        this.categoriaSelect = this.categoriasMapa[event];
      }

      changeName(event){

      }

      deleteCategoria(){
        let texto = 
        Swal.fire({
            title: '¿Estás totalmente seguro de eliminar la categoría?',
            html:'La categoria a eliminar es: <b>' + this.categoriaSelect + '</b>. <br><br> Recordar que eliminar una categoría, conlleva borrar <b>TODOS</b> los indicadores asociados a esta.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Si.`,
            denyButtonText: `No.`,
            cancelButtonText: `Cancelar.`
        }).then((result)=>{
            if(result.isConfirmed){
                const payload = new HttpParams()
                .set('categoria',JSON.stringify(this.categoriaId))
                this.editService.deleteCategory(payload).subscribe((resp:any)=>{
                    Swal.fire({
                        icon: 'success',
                        title: 'Categoria eliminada correctamente.',
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

      registrarCambios(){
        let nombre_categoria = this.firstFormGroup.controls['nombre'].value
        
        if(nombre_categoria == ''){
            nombre_categoria = this.categoriaSelect
        }

        let new_cambios = []

        let new_cambio = new Cambios();
        
        new_cambio.campo = "Nombre"
        new_cambio.actual = this.categoriaSelect
        new_cambio.nuevo = nombre_categoria

        new_cambios.push(new_cambio)
        this.dialogref = this.dialogService.open(ChangeDataComponent, {context: { cambios: new_cambios }});
        
        /*
        Swal.fire({
            title: '¿Estás seguro de realizar el siguiente cambio?',
            html: '<table id="table" border=1> <thead> <tr> <th>Campo</th>'+
            '<th>Actual</th> <th>Nuevo</th> </tr> </thead> <tbody> <tr> <td>Nombre</td> <td>'+this.categoriaSelect+'</td>'+
            '<td>'+nombre_categoria+'</td> </tbody></table>',
            icon: 'info',
            width: '50%',
            showCancelButton: true,
            confirmButtonText: `Si.`,
            denyButtonText: `No.`,
            cancelButtonText: `Cancelar.`
            
        }).then((result)=>{
            if(result.isConfirmed){
                
            }
        
        })
        */


      }

      modify(){
        let nombre_categoria = this.firstFormGroup.controls['nombre'].value
        
        if(nombre_categoria == ''){
            nombre_categoria = this.categoriaSelect
        }
        const payload = new HttpParams()
        .set('id_categoria',JSON.stringify(this.categoriaId))
        .set('nombre',JSON.stringify(nombre_categoria))

        this.editService.editCategory(payload).subscribe((resp:any)=>{
            Swal.fire({
                icon: 'success',
                title: 'Categoria modificada correctamente.',
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
  }
