import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';



import { SearchServiceService } from '../../search/search-service.service';

import Swal from 'sweetalert2';
import { HttpParams } from '@angular/common/http';

import { AddDataServiceService } from '../addDataService.service';

import { ServicioFuente } from './servicioFuente';


import { Formato } from './formato'; 


import { NbDialogService } from '@nebular/theme';

import {AddFileComponent} from  '../../search/addFile/add-file/add-file.component'

@Component({
    selector: 'ngx-addIndicador',
    templateUrl: './addIndicador.component.html',
    styleUrls: ['./addIndicador.component.scss']
  })


export class AddIndicadorComponent implements OnInit {


    categorias: any;

    servicios: any;

    servicios_array: string[] = []

    firstFormGroup: FormGroup;

    selectedCategoria = '';
    selectedDocumentoFuente = '';

    filteredNgModelOptions$: Observable<string[]>;
    filteredNgModelOptions2$: Observable<string[]>;
    inputFormControl: FormControl;
    inputFormControl2: FormControl;

    value: string;
    value2: string;

    selectedGood: boolean = false;
    selectedGood2: boolean = false;
    categoriaInexistente: boolean = false;
    servicioInexistente: boolean = false;
    documentoInexistente: boolean = false;

    categoriaNueva: any;

    invalid:boolean = false;


    mapServicios = new Map<number, ServicioFuente>();

    documentos:any;

    formatos= new Map<string, Formato>();


    validNombre: boolean = false;
    validCategoria: boolean = false;
    validServicio2: boolean = false;
    validServicio: boolean = true;
    validDocumento:boolean = true;
    validDocumento2: boolean = false;
    validurl:boolean = true;
    validFormatos: boolean = true;
    validInstitucion: boolean = true;

    formatosSeleccionados = new Array<string>();


    dialogref: any;

    id_servicio_seleccionado: Number;


    constructor( private searchService: SearchServiceService, private fb: FormBuilder, 
                private adDataService:AddDataServiceService, private dialogService: NbDialogService) {
        
    }

    ngOnInit(): void {

        this.firstFormGroup = this.fb.group({
            nombre: ['', Validators.required],
            categoria:['', Validators.required],
            servicioFuente: ['', Validators.required],
            categoriaNueva:[''],
            toggle: [''],
            documentoFuente: ['', Validators.required],
            toggle2: [''],
            
            servicioNuevo: [''],
            toggle3: [''],
            documentoNuevo: [''],
            urlDocumento: [''],
            servicioFuente2: ['']
        });

        this.firstFormGroup.patchValue({
            toggle: false,
            toggle2: false,
            toggle3: false
        })
    
    
        this.searchService.getAllCategorias().subscribe((resp:any)=>{
            this.categorias = resp.result;
        },(err)=>{

        })

        this.searchService.getAllFormatos().subscribe((resp:any)=>{
        

            for(let i = 0; i<resp.result.length;i++){
                let new_formato = new Formato();
                new_formato.id = resp.result[i].id_formato;
                new_formato.formato = resp.result[i].formato;
                new_formato.checked = false;

                this.formatos.set(resp.result[i].id_formato, new_formato)
            }
        })
         

        this.searchService.getAllServiciosFuentes().subscribe((resp:any)=>{
            for(let i = 0 ;i<resp.result.length;i++){
                this.servicios_array.push(resp.result[i].institucion)
                
                let new_servicio = new ServicioFuente()
                new_servicio.id = resp.result[i].id_servicio
                new_servicio.institucion = resp.result[i].institucion

                this.mapServicios.set(resp.result[i].institucion, new_servicio)
            }

            this.filteredNgModelOptions$ = of(this.servicios_array);
            this.inputFormControl = new FormControl();

            this.filteredNgModelOptions2$ = of(this.servicios_array);
            this.inputFormControl2 = new FormControl();

            
        })
     
    }

    private filter(value: string): string[] {
  
        const filterValue = value.toLowerCase();
  
        return this.servicios_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
     
  
  
    }

    onModelChange(value: string) {
        this.selectedGood = false;
        this.validServicio2 = false;
        this.filteredNgModelOptions$ = of(this.filter(value));
        this.value = value;
        
        this.documentos = []

        this.selectedDocumentoFuente = ''
        this.validDocumento2 = false;
        
      }

      onModelChange2(value: string) {
        this.selectedGood2 = false;
        this.validInstitucion = false;
        this.filteredNgModelOptions2$ = of(this.filter(value));
        this.value2 = value;
        
        
        
      }

      valorSeleccionado(event:any){
          this.documentos = []
          if(event == this.value){
            this.validServicio2 = true;
            this.selectedGood = true;
            
            
            let id_servicio = this.mapServicios.get(event).id
            this.id_servicio_seleccionado = this.mapServicios.get(event).id
           
            this.searchService.getDocumentosServicio(id_servicio).subscribe((resp:any)=>{
                this.documentos = resp.result;

           
            },(err:any)=>{

            })

          }
      }

      valorSeleccionado2(event:any){
        
        if(event == this.value2){
          this.selectedGood2 = true;
          this.validInstitucion = true;
          
          

        }
    }

      

    noExiste(event:any){
        this.categoriaInexistente = event;
    }

    noExisteServicio(event:any){
        this.servicioInexistente = event;
    }

    noExisteDocumento(event:any){
        this.documentoInexistente = event;

        if(this.documentoInexistente == true){
            this.formatosSeleccionados = []
        }
    }
  
    addCategorie(){
        let value_of_categorie = this.firstFormGroup.controls['categoriaNueva'].value
        if(value_of_categorie.length < 5){
            this.invalid = true;
        }else{
            this.invalid = false;
            Swal.fire({
                title: '¿Estás seguro de crear la categoría?',
                text: 'La categoría a crear es: ' + value_of_categorie,
                showCancelButton: true,
                confirmButtonText: `Si.`,
                denyButtonText: `No.`,
                cancelButtonText: `Cancelar.`
            }).then((result)=>{
                if(result.isConfirmed){
                    const payload = new HttpParams()
                    .set('categoria',JSON.stringify(value_of_categorie))

                    this.adDataService.addCategorie(payload).subscribe((resp:any)=>{
                        console.log(resp)
                        Swal.fire({
                            icon: 'success',
                            title: 'Categoria añadida correctamente.',
                            showConfirmButton: false,
                            timer: 1500
                          }).then((result2)=>{
                            
                            this.categoriaInexistente = false;
                            this.firstFormGroup.patchValue({
                                toggle: false,
                                categoriaNueva: ''
                            })
                            this.searchService.getAllCategorias().subscribe((resp:any)=>{
                                this.categorias = resp.result;
                            },(err)=>{
                    
                            })
                          })
                    },(err)=>{
                        console.log(err)
                        Swal.fire({
                            icon: 'error',
                            title: 'Ha ocurrido un error...',
                            text: err.error.name
                          })
                    })
                }
            })
        }
        
    }

    filtrar(event:any, id_formato){


        this.formatos.get(id_formato).checked = event.target.checked



    }

    addService(){

        


        let servicio_texto = this.firstFormGroup.controls['servicioNuevo'].value
        
        
       
        
        if(servicio_texto.length < 2){
            this.validServicio = false;
        }else if(servicio_texto.length >= 2){
            this.validServicio = true;

            Swal.fire({
                title: '¿Estás seguro de añadir la Institución?',
                text: 'La institución a añadir es: ' + servicio_texto,
                showCancelButton: true,
                confirmButtonText: `Si.`,
                denyButtonText: `No.`,
                cancelButtonText: `Cancelar.`
            }).then((result)=>{
                if(result.isConfirmed){
                    const payload = new HttpParams()
                    .set('servicio',JSON.stringify(servicio_texto))
                    this.adDataService.addService(payload).subscribe((resp:any)=>{
                        Swal.fire({
                            icon: 'success',
                            title: 'Institución añadida correctamente.',
                            showConfirmButton: false,
                            timer: 1500
                          }).then((result2)=>{
                            
                            this.servicioInexistente = false;
                            this.firstFormGroup.patchValue({
                                toggle2: false,
                                servicioNuevo: ''
                            })

                            this.servicios_array = []
                            this.mapServicios = new Map<number, ServicioFuente>();

                            this.searchService.getAllServiciosFuentes().subscribe((resp:any)=>{
                                for(let i = 0 ;i<resp.result.length;i++){
                                    this.servicios_array.push(resp.result[i].institucion)
                                    
                                    let new_servicio = new ServicioFuente()
                                    new_servicio.id = resp.result[i].id_servicio
                                    new_servicio.institucion = resp.result[i].institucion
                    
                                    this.mapServicios.set(resp.result[i].institucion, new_servicio)
                                }
                    
                                this.filteredNgModelOptions$ = of(this.servicios_array);
                                this.filteredNgModelOptions2$ = of(this.servicios_array);
                                this.inputFormControl = new FormControl();
                            },(err)=>{
                    
                            })
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



        


       
        
    }

    addDocument(){

        this.formatosSeleccionados = []
        for (let [key, value] of this.formatos) {
            if(value.checked == true){
      
              this.formatosSeleccionados.push(key)
              
            }
            
          }

        let institucion_texto = this.firstFormGroup.controls['servicioFuente2'].value

        let institucion_id = this.mapServicios.get(institucion_texto).id

        let documento_texto = this.firstFormGroup.controls['documentoNuevo'].value
        let url_texto = this.firstFormGroup.controls['urlDocumento'].value

        if(documento_texto.length < 5){
            this.validDocumento = false
        }else if(documento_texto.length>=5){
            this.validDocumento = true;
        }
        
        if(this.validURL(url_texto)){
            this.validurl = true;
        }else{
            this.validurl = false;
        }


        if(this.formatosSeleccionados.length == 0){
            this.validFormatos = false;
        }else{
            this.validFormatos = true;
        }
        
        if(this.validInstitucion && this.validDocumento && this.validurl && this.validFormatos){
            Swal.fire({
                title: '¿Estás seguro de añadir el Documento ?',
                text: 'El documento a añadir es: ' + documento_texto,
                showCancelButton: true,
                confirmButtonText: `Si.`,
                denyButtonText: `No.`,
                cancelButtonText: `Cancelar.`
            }).then((result)=>{
                if(result.isConfirmed){
                    const payload = new HttpParams()
                    .set('documento',JSON.stringify(documento_texto))
                    .set('institucion',JSON.stringify(institucion_id))
                    .set('url',JSON.stringify(url_texto))
                    .set('formatos',JSON.stringify(this.formatosSeleccionados))

                    this.adDataService.addDocument(payload).subscribe((resp:any)=>{
                        Swal.fire({
                            icon: 'success',
                            title: 'Documento añadido correctamente.',
                            showConfirmButton: false,
                            timer: 1500
                          }).then((result2)=>{
                            this.documentoInexistente = false;
                            this.firstFormGroup.patchValue({
                                toggle3: false,
                                documentoNuevo: '',
                                urlDocumento: '',
                                servicioFuente2:''

                            })

                            this.searchService.getDocumentosServicio(this.id_servicio_seleccionado).subscribe((resp:any)=>{
                                this.documentos = resp.result;
                
                           
                            },(err:any)=>{
                
                            })
                            
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


    }
    addIndicador(){
        let name_indicador = this.firstFormGroup.controls['nombre'].value
        let id_categoria = this.firstFormGroup.controls['categoria'].value
        let id_documento = this.firstFormGroup.controls['documentoFuente'].value
        
        console.log(id_documento)
        
        if(this.validNombre && this.validCategoria && this.validServicio2 && this.validDocumento2){
            Swal.fire({
                title: '¿Estás seguro de añadir el Indicador ?',
                text: 'El indicador a añadir es: ' + name_indicador,
                showCancelButton: true,
                confirmButtonText: `Si.`,
                denyButtonText: `No.`,
                cancelButtonText: `Cancelar.`
            }).then((result)=>{
                if(result.isConfirmed){
                    const payload = new HttpParams()
                    .set('indicador',JSON.stringify(name_indicador))
                    .set('categoria',JSON.stringify(id_categoria))
                    .set('documento',JSON.stringify(id_documento))
                    
                    this.adDataService.addIndicador(payload).subscribe((resp:any)=>{
                        Swal.fire({
                            icon: 'success',
                            title: 'Indicador añadido correctamente.',
                            showConfirmButton: true,
                            //timer: 1500
                          }).then((result2)=>{
                            Swal.fire({
                                title: '¿Desea añadir un archivo al indicador creado?',
                                showCancelButton: true,
                                confirmButtonText: `Si.`,
                                denyButtonText: `No.`,
                                cancelButtonText: `Cancelar.`
                            }).then((result3)=>{
                                if(result3.isConfirmed){
                                    this.openDialogAdd(resp.response)
                                    
                                }else{
                                    window.location.reload()
                                }
                            })
                            //
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

     
    }

    validURL(str) {
        var pattern = new RegExp('^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})')
        /*
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        */
        console.log(!!pattern.test(str))
        return !!pattern.test(str);
      }

  
      changeName(event:any){
          let name_indicador = this.firstFormGroup.controls['nombre'].value
          if(name_indicador.length > 0){
              this.validNombre = true;
          }else{
              this.validNombre = false;
          }
      }

      changeCategoria(event:any){
        let id_categoria = this.firstFormGroup.controls['categoria'].value

        console.log(id_categoria)
        if(id_categoria.length > 0){
            this.validCategoria = true;
        }else{
            this.validCategoria = false;
        }

      }

      changeDocumentoFuente(event:any){
        let id_documento = this.firstFormGroup.controls['documentoFuente'].value

        console.log(id_documento)

        if(id_documento.length > 0){
            this.validDocumento2 = true;
        }else{
            this.validDocumento2 = false;
        }
      }

      openDialogAdd(id_indicador: any){


        this.dialogref = this.dialogService.open(AddFileComponent, {context: { id_indicador: id_indicador, flag:false},closeOnBackdropClick: false, closeOnEsc: false});
    
    
    
        /*
        this.dialogService.open(AddFileComponent, {
          dialogClass: 'model-full'
        });
        */
      }

      public closeDialog(){
          console.log("acá")
        this.dialogref.close()

        
      }


    
}