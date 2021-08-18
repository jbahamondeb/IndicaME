import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { SearchServiceService } from '../../search/search-service.service';

import { GetDataIndicadorService } from '../../search/get-data-indicador.service';
import { NbTagComponent } from '@nebular/theme';


import { EditService } from '../edit.service';
import Swal from 'sweetalert2';

import { NbDialogService } from '@nebular/theme';
import { AddFileComponent } from '../../search/addFile/add-file/add-file.component';

import jwt_decode from 'jwt-decode';
import { Cambios } from '../../cambios';
import { ChangeDataComponent } from '../../changes/changeData/changedata.component';

import { ChangesService } from '../../changes/changes.service';
import { Institucion } from '../documento/institucion';
import { Documento } from '../institucion/documento';


import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import * as $ from 'jquery'

@Component({
    selector: 'ngx-editIndicador',
    templateUrl: './editIndicador.component.html',
    styleUrls: ['./editIndicador.component.scss',
]
  })


  export class EditIndicadorComponent implements OnInit {



    options: string[];
    filteredNgModelOptions$: Observable<string[]>;
    filteredNgModelOptions2$: Observable<string[]>;

    inputFormControl: FormControl;
    inputFormControl2: FormControl;
    value: string;
    value2: string;

    indicadores_array: string[] = []
    documentos_array: string[] = []
    documentos_array_indicador: string[] = []
    documentos_array_indicador_ids: number[] = []

    categorias: any;


    validServicio: boolean = true;
    validDocumento: boolean = true;

    indicador_encontrado: any;
    categoria_actual: any;
    categoria_actual_id:any;
    documentos:any;
    archivos:any;

    firstFormGroup: FormGroup;


    documentos_anyadidos: string[] = []

    dialogref: any;


    documentosNuevosMapa = new Map<string, Number>();
    categoriasMapa = new Map<string, string>();

    new_documentos: Documento[] = []

    tipo_user: any;
    admin = false;

    seleccionado: boolean = false;

    new_documentos_ids: string[] = []
    new_documentos_names : string[] = []


    private alive = true;
    breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
    breakpoints: any;

    constructor(private searchService: SearchServiceService, private fb: FormBuilder, 
                private getDataIndicador:GetDataIndicadorService, private editService:EditService,
                private dialogService: NbDialogService, private changeService: ChangesService,
                private breakpointService: NbMediaBreakpointsService,
                    private themeService: NbThemeService){
        
                    let local_storage;
                    local_storage = localStorage.getItem('token')
            
            
                    if(local_storage){
                        let decode = this.getDecodedAccessToken(local_storage)
                      this.tipo_user = decode.tipo
              
                      if(this.tipo_user == 1){
                        this.admin = true;
                      }
                    }
        this.searchService.configObservable.subscribe(value=>{
            if(value == true){
                //this.searchService.emitConfig(true)

                this.searchByName()
            }
        })

        this.changeService.configObservable.subscribe(value =>{
            if(value == true){
                this.modify()
            }
        })
        
        this.firstFormGroup = this.fb.group({
            nombre: [''],
            categoria:[''],
            
            documentoFuente: [''],
            documentoFuente2: ['']
        });

        

        //this.documentos_anyadidos = []

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

        if ($(window).width() < 350 ) {
            $("#indicador").attr("placeholder", "Nombre indicador");
            
            
            
        }

        window.addEventListener('resize', function() {
            if ($(window).width() < 350 ) {
                $("#indicador").attr("placeholder", "Nombre indicador");
                
                //$('input[placeholder="Busca un documento fuente por su nombre..."]').attr('placeholder', 'Nombre documento fuente')
            }else{
                $("#indicador").attr("placeholder", "Busca un indicador por su nombre..");
                //$("#documentoFuente").attr("placeholder", "Busca un documento fuente por su nombre...");
                //$('input[placeholder="Nombre documento fuente"]').attr('placeholder', 'Busca un documento fuente por su nombre...')
            }
        })

        this.themeService.onMediaQueryChange()
        .pipe(takeWhile(() => this.alive))
        .subscribe(([oldValue, newValue]) => {
            this.breakpoint = newValue;

            

        });
        
        this.searchService.getAllIndicadores().subscribe((resp:any)=>{
            for(let i = 0 ;i<resp.result.length;i++){
                this.indicadores_array.push(resp.result[i].nombre)
          
            }

            this.filteredNgModelOptions$ = of(this.indicadores_array);
            this.inputFormControl = new FormControl();
        })
        /*
        this.searchService.getAllDocuments().subscribe((resp:any)=>{
            
             
            
            for(let i=0;i<resp.result.length;i++){
                this.documentos_array.push(resp.result[i].nombre)
                this.documentosNuevosMapa[resp.result[i].nombre] = resp.result[i].id_documento;
            }

            this.filteredNgModelOptions2$ = of(this.documentos_array)
            this.inputFormControl2 = new FormControl()
        })

        this.searchService.getAllCategorias().subscribe((resp:any)=>{
            this.categorias = resp.result;
            for(let i = 0;i<resp.result.length;i++){
                this.categoriasMapa[resp.result[i].id_categoria] = resp.result[i].nombre;
            }
        },(err)=>{

        })*/
    }

    private filter(value: string): string[] {
  
        const filterValue = value.toLowerCase();

       
  
        return this.indicadores_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
     
  
  
    }


    private filter2(value: string): string[] {
  
        const filterValue = value.toLowerCase();

        
  
        return this.documentos_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
     
  
  
    }

    onModelChange(value: string) {

        if(value && value != ''){
            this.filteredNgModelOptions$ = of(this.filter(value));
    
            //this.value = value;
            
            this.seleccionado = false;
            //this.validServicio = false;
    
            this.indicador_encontrado = []
        }else if(value == ''){
            this.filteredNgModelOptions$ = of(this.indicadores_array);
            this.seleccionado = false;
            //this.validServicio = false;
    
            this.indicador_encontrado = []
        }
 
       
    }

    onModelChange2(value: string) {
     
        if(value && value != ''){
            this.filteredNgModelOptions2$ = of(this.filter2(value));
    
            //this.value2 = value;

            //this.validDocumento = false;
        }else if(value == ''){

        }
        
        

    

        
        
        
    }


    valorSeleccionado(event:any){

        this.seleccionado = true;

        this.value = event;
        
        this.new_documentos = []
        this.searchByName()

        

       
       
        /*
        if(event == this.value){
            this.validServicio = true;   

        }*/
    }

    valorSeleccionado2(event:any){
        
        if(event != ''){
              

            let new_documento = new Documento()

            new_documento.id = this.documentosNuevosMapa[event]  
            new_documento.nombre = event

            this.new_documentos.push(new_documento)
            this.value2 = ''
            this.firstFormGroup.patchValue({
                documentoFuente2: ''
            })
            
            this.documentos_array = this.documentos_array.filter(t=>
               
                t !== event
               
            );


            this.filteredNgModelOptions2$ = of(this.documentos_array);
        }
    }


    searchByName(){
        this.documentos_array = []
        this.documentos_array_indicador_ids = []
        this.documentos_array_indicador = []
        this.categoriasMapa.clear()
        this.documentosNuevosMapa.clear()
     
          const payload = new HttpParams()
          .set('indicador',JSON.stringify(this.value))
    
          this.searchService.searchByName(payload).subscribe((resp:any)=>{
            this.indicador_encontrado = resp.result
             

            let id_indicador = resp.result[0].id_indicador

            

            this.getDataIndicador.getCategorias(id_indicador).subscribe((resp:any)=>{
                this.categoria_actual = resp.result[0].nombre
                this.categoria_actual_id = resp.result[0].id_categoria;

                const payload = new HttpParams()
                
                .set('categoriactual',JSON.stringify(this.categoria_actual_id))
        
                this.editService.getCategoriasRestantes(payload).subscribe((resp:any)=>{
                     
                    this.categorias = resp.result;
        
                    for(let i = 0;i<resp.result.length;i++){
                        this.categoriasMapa[resp.result[i].id_categoria] = resp.result[i].nombre;
                    }

                    this.categoriasMapa[this.categoria_actual_id] = this.categoria_actual

                   
            
                    if ($(window).width() < 470 ) {
                       
                        
                        $("#documentoFuente").attr("placeholder", "Nombre documento fuente");
                        
                    }else{
                        
                        $("#documentoFuente").attr("placeholder", "Busca un documento fuente por su nombre...");
                    }
                    

                    window.addEventListener('resize', function() {
                        if ($(window).width() < 470 ) {
                            
                            
                            $("#documentoFuente").attr("placeholder", "Nombre documento fuente");
                        }else{
                            
                            $("#documentoFuente").attr("placeholder", "Busca un documento fuente por su nombre...");
                        }
                    })
        
                },(err:any)=>{
                    
                })

            },(err:any)=>{

            })

            this.getDataIndicador.getDocumentos(id_indicador).subscribe((resp:any)=>{
                this.documentos = resp.result
                for(let i=0;i<resp.result.length;i++){
                    this.documentos_array_indicador.push(resp.result[i].nombre)
                    this.documentos_array_indicador_ids.push(resp.result[i].id_documento)
                }
                 
                const payload = new HttpParams()
                
                .set('documentos_actuales',JSON.stringify(this.documentos_array_indicador_ids))

                this.editService.getDocumentosRestantesInstitucion(payload).subscribe((resp:any)=>{
                     
                    for(let i=0;i<resp.result.length;i++){
                        this.documentos_array.push(resp.result[i].nombre)
                        this.documentosNuevosMapa[resp.result[i].nombre] = resp.result[i].id_documento;
                    }
        
                    this.filteredNgModelOptions2$ = of(this.documentos_array)
                    this.inputFormControl2 = new FormControl()

                    
                },(err:any)=>{

                })
        
            },(err:any)=>{

            })

            this.getDataIndicador.getCSV(id_indicador).subscribe((resp:any)=>{
                this.archivos = resp.result
            })

          })
      
    
          
        
        
    
      
      }



      deleteCSV(id, nombre){
        

        Swal.fire({
            title: '¿Estás seguro de eliminar el archivo?',
            text: 'El archivo a eliminar es: ' + nombre,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Si.`,
            denyButtonText: `No.`,
            cancelButtonText: `Cancelar.`
        }).then((result)=>{
            if(result.isConfirmed){
                const payload = new HttpParams()
                .set('id_archivo',JSON.stringify(id))
                .set('nombre',JSON.stringify(nombre))
                this.editService.deleteFile(payload).subscribe((resp:any)=>{
                    Swal.fire({
                        icon: 'success',
                        title: 'Archivo eliminado correctamente.',
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


      openDialogAdd(id_indicador: any){

        
        
        this.dialogref = this.dialogService.open(AddFileComponent, {context: { id_indicador: id_indicador[0].id_indicador, flag: true},closeOnBackdropClick: true, closeOnEsc: true});
        
    
    
        /*
        this.dialogService.open(AddFileComponent, {
          dialogClass: 'model-full'
        });
        */
      }
    
      public closeDialog(){
        this.dialogref.close()
      }

      registrarCambios(){
            this.new_documentos_names = []
            this.new_documentos_ids = []

            let new_name = this.firstFormGroup.controls['nombre'].value
            
            if(new_name === ''){
                new_name = this.indicador_encontrado[0].nombre
            }
            
            let new_category = this.firstFormGroup.controls['categoria'].value
            
            if(new_category === ''){
                new_category = this.categoria_actual_id
            }
            console.log(this.categoria_actual_id)
            
            let categoria_texto = this.categoriasMapa[new_category]

            console.log(this.categoriasMapa)

            for(let i = 0;i<this.new_documentos.length;i++){
                this.new_documentos_ids.push(this.new_documentos[i].id)
                this.new_documentos_names.push(this.new_documentos[i].nombre)
            }
            
            

            let documentos_texto = [this.documentos_array_indicador,...this.new_documentos_names]

            let new_cambios = []
            
            let uncambio = new Cambios();

            uncambio.campo = "Nombre"
            uncambio.actual = this.indicador_encontrado[0].nombre
            uncambio.nuevo = new_name


            let segundocambio = new Cambios();

            segundocambio.campo = "Categoria"
            segundocambio.actual = this.categoria_actual
            segundocambio.nuevo = categoria_texto

            let tercercambio = new Cambios()

            let documentos_actuales_string = this.documentos_array_indicador.join(', ')
            let documentos_nuevos_string = documentos_texto.join(', ')

            tercercambio.campo = "Documentos Fuentes"
            tercercambio.actual = documentos_actuales_string
            tercercambio.nuevo = documentos_nuevos_string
            
            new_cambios.push(uncambio)
            new_cambios.push(segundocambio)
            new_cambios.push(tercercambio)

            this.dialogref = this.dialogService.open(ChangeDataComponent, {context: { cambios: new_cambios }});
            /*
            Swal.fire({
                title: '¿Estás seguro de realizar los siguientes cambios?',
                html: '<table id="table" border=1> <thead> <tr> <th>Campo</th>'+
                '<th>Actual</th> <th>Nuevo</th> </tr> </thead> <tbody> <tr> <td>Nombre</td> <td>'+this.indicador_encontrado[0].nombre+'</td>'+
                '<td>'+new_name+'</td> </tr> <tr> <td>Categoria</td> <td>' + this.categoria_actual+  
                '</td> <td>' + categoria_texto +  '</td> </tr> <tr> <td>Documentos Fuentes</td> <td>' + this.documentos_array_indicador +
                '</td> <td>' + documentos_texto + '</td> </tr> </tbody></table>',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: `Si.`,
                denyButtonText: `No.`,
                cancelButtonText: `Cancelar.`
                
            }).then((result)=>{
                if(result.isConfirmed){
                    
                }
            })*/
      }

      modify(){
        let new_name = this.firstFormGroup.controls['nombre'].value
            
        if(new_name === ''){
            new_name = this.indicador_encontrado[0].nombre
        }
        let new_category = this.firstFormGroup.controls['categoria'].value
            
        if(new_category === ''){
            new_category = this.categoria_actual_id
        }
        const payload = new HttpParams()
        .set('id_indicador',JSON.stringify(this.indicador_encontrado[0].id_indicador))
        .set('newName',JSON.stringify(new_name))
        .set('newCategory',JSON.stringify(new_category))
        .set('newDocumentos', JSON.stringify(this.new_documentos_ids))
        .set('actual_id_categoria',JSON.stringify(this.categoria_actual_id))
        
        this.editService.editIndicador(payload).subscribe((resp:any)=>{
                Swal.fire({
                    icon: 'success',
                    title: 'Indicador modificado correctamente.',
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

      deleteIndicador(id_indicador){
        Swal.fire({
            title: '¿Estás totalmente seguro de eliminar el indicador?',
            text: 'El indicador a eliminar es: ' + this.indicador_encontrado[0].nombre,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Si.`,
            denyButtonText: `No.`,
            cancelButtonText: `Cancelar.`
        }).then((result)=>{
            if(result.isConfirmed){
                const payload = new HttpParams()
                .set('id_indicador',JSON.stringify(id_indicador))
                
                this.editService.deleteIndicador(payload).subscribe((resp:any)=>{
                    Swal.fire({
                        icon: 'success',
                        title: 'Indicador eliminado correctamente.',
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

      deleteDocumento(id_documento, nombre){
        Swal.fire({
            title: '¿Estás seguro de eliminar la obtención del indicador?',
            text: 'El documento a eliminar para el indicador es: ' + nombre,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Si.`,
            denyButtonText: `No.`,
            cancelButtonText: `Cancelar.`
        }).then((result)=>{
            if(result.isConfirmed){
                const payload = new HttpParams()
                .set('id_indicador',JSON.stringify(this.indicador_encontrado[0].id_indicador))
                .set('id_documento',JSON.stringify(id_documento))
                
                
                

                this.editService.deleteDocumentAsociado(payload).subscribe((resp:any)=>{
                    Swal.fire({
                        icon: 'success',
                        title: 'Documento de obtención eliminado correctamente.',
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

      deleteDocument(documento){
        let documento_id = documento.id;
        
        this.new_documentos = this.new_documentos.filter(t=>
            
            t.id !== documento_id
        
        );

        this.documentos_array.push(documento.nombre)

        
        this.filteredNgModelOptions2$ = of(this.documentos_array);
        
        
    }


  }
