import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { GetDataIndicadorService } from '../../search/get-data-indicador.service';
import { SearchServiceService } from '../../search/search-service.service';
import { EditService } from '../edit.service';

import { Documento } from './documento';
import jwt_decode from 'jwt-decode';
import { NbDialogService } from '@nebular/theme';
import { Cambios } from '../../cambios';
import { ChangeDataComponent } from '../../changes/changeData/changedata.component';
import { ChangesService } from '../../changes/changes.service';


import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';


import * as $ from 'jquery'

@Component({
    selector: 'ngx-editInstitucion',
    templateUrl: './editInstitucion.component.html',
    styleUrls: ['./editInstitucion.component.scss']
  })


  export class EditInstitucionComponent implements OnInit {
        filteredNgModelOptions$: Observable<string[]>;
        inputFormControl: FormControl;

        filteredNgModelOptions2$: Observable<string[]>;
        inputFormControl2: FormControl;

        instituciones_array: string[] = []
        documentos_array: string[] = []

        value: string;
        value2: string;

        validServicio: boolean = false;
        validDocumento: boolean = false;
        servicio_encontrado: any;

        serviciosMapa = new Map<string, Number>()
        documentosMapa = new Map<string, Number>()
        documentos:any;
        id_servicio: any;

        firstFormGroup: FormGroup;

        institucion: any;


        new_documentos: Documento[]= []

        new_documentos_ids: string[] = []
        new_documentos_names : string[] = []

        documentos_actuales:string[] = []
        documentos_actuales_id:number[] = []

        tipo_user: any;
        admin = false;

        dialogref: any;

        seleccionado: boolean = false;


        private alive = true;
        breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
        breakpoints: any;

        constructor(private searchService: SearchServiceService,private getDataIndicador:GetDataIndicadorService,
                    private fb: FormBuilder, private editService:EditService,private dialogService: NbDialogService,
                    private changeService:ChangesService,private breakpointService: NbMediaBreakpointsService,
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
            this.firstFormGroup = this.fb.group({
                nombre: [''],
                documentoFuente: ['']
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
            if ($(window).width() < 365 ) {
                $("#institucion").attr("placeholder", "Nombre institución");
                
                
                
            }
    
            window.addEventListener('resize', function() {
                if ($(window).width() < 365 ) {
                    $("#institucion").attr("placeholder", "Nombre institución");
                    
                    //$('input[placeholder="Busca un documento fuente por su nombre..."]').attr('placeholder', 'Nombre documento fuente')
                }else{
                    $("#institucion").attr("placeholder", "Busca la institución a modificar...");
                    //$("#documentoFuente").attr("placeholder", "Busca un documento fuente por su nombre...");
                    //$('input[placeholder="Nombre documento fuente"]').attr('placeholder', 'Busca un documento fuente por su nombre...')
                }
            })


            this.themeService.onMediaQueryChange()
            .pipe(takeWhile(() => this.alive))
            .subscribe(([oldValue, newValue]) => {
                this.breakpoint = newValue;
            });
            this.searchService.getAllServiciosFuentes().subscribe((resp:any)=>{
                for(let i = 0 ;i<resp.result.length;i++){
                    this.instituciones_array.push(resp.result[i].institucion)
                    this.serviciosMapa[resp.result[i].institucion] = resp.result[i].id_servicio
                }
                this.filteredNgModelOptions$ = of(this.instituciones_array);
                this.inputFormControl = new FormControl();
            },(err:any)=>{

            })
            /*
            this.searchService.getAllDocuments().subscribe((resp:any)=>{
                for(let i = 0 ;i<resp.result.length;i++){
                    this.documentos_array.push(resp.result[i].nombre)
                    
                }
                
            },(err:any)=>{

            })
            */
            this.changeService.configObservable.subscribe(value =>{
                if(value == true){
                    this.modify()
                }
            })
        }

        private filter(value: string): string[] {
  
            const filterValue = value.toLowerCase();
    
           
      
            return this.instituciones_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
         
      
      
        }
        private filter2(value: string): string[] {
  
            const filterValue = value.toLowerCase();
    
           
      
            return this.documentos_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
         
      
      
        }

        onModelChange(value: string) {
            this.seleccionado = false;

            this.documentos_actuales = []
            this.documentos_actuales_id = []
            this.documentos_array = []
            this.documentosMapa.clear()
            this.servicio_encontrado = []
            if(value && value != ''){
                this.filteredNgModelOptions$ = of(this.filter(value));
        
                //this.value = value;
        
                //this.validServicio = false;
        
                
                

                
            }else if(value == ''){
                this.filteredNgModelOptions$ = of(this.instituciones_array)
            }
            
        }
        onModelChange2(value: string) {
             
            if(value && value!=''){
               
                this.filteredNgModelOptions2$ = of(this.filter2(value));
        
                //this.value2 = value;
        
                //this.validDocumento = false;
            }else if(value == ''){
                this.filteredNgModelOptions2$ = of(this.documentos_array)
            }
            
    
            
            
        }


        valorSeleccionado(event:any){
     

            this.documentos_actuales = []
            this.documentos_actuales_id = []
            this.documentos_array = []
            this.documentosMapa.clear()
            this.id_servicio = this.serviciosMapa[event]
            this.institucion = event;
            this.seleccionado = true;
            this.getDataIndicador.getDocumentosAsociados(this.id_servicio).subscribe((resp:any)=>{
                this.documentos = resp.result
                for(let i=0;i<this.documentos.length;i++){
                    this.documentos_actuales.push(this.documentos[i].nombre)
                    this.documentos_actuales_id.push(this.documentos[i].id_documento)
                }
                
                const payload = new HttpParams()
                .set('documentos_actuales',JSON.stringify(this.documentos_actuales_id))


                this.editService.getDocumentosRestantesInstitucion(payload).subscribe((resp:any)=>{
                     

                    for(let i = 0 ;i<resp.result.length;i++){
                        this.documentos_array.push(resp.result[i].nombre)
                        this.documentosMapa[resp.result[i].nombre] = resp.result[i].id_documento
                        
                    }

                    this.filteredNgModelOptions2$ = of(this.documentos_array);
                    this.inputFormControl2 = new FormControl();

                    if ($(window).width() < 350 ) {
                       
                        
                        $("#inputDocumento").attr("placeholder", "Documento fuente");
                        
                    }else{
                        
                        $("#inputDocumento").attr("placeholder", "Busca el documento a añadir...");
                    }
                    

                    window.addEventListener('resize', function() {
                        if ($(window).width() < 350 ) {
                            
                            
                            $("#inputDocumento").attr("placeholder", "Documento fuente");
                        }else{
                            
                            $("#inputDocumento").attr("placeholder", "Busca el documento a añadir...");
                        }
                    })

                },(err:any)=>{

                })

            },(err:any)=>{

            })

            
        }

        valorSeleccionado2(event:any){
        
            if(event != ''){
                let new_documento = new Documento()
                new_documento.id = this.documentosMapa[event]  
                new_documento.nombre = event
                this.new_documentos.push(new_documento)
                this.value2 = ''
                this.firstFormGroup.patchValue({
                    documentoFuente: ''
                })

               

                

                this.documentos_array = this.documentos_array.filter(t=>
                
                    t !== event
                
                );

                this.filteredNgModelOptions2$ = of(this.documentos_array);

                

            }
                
            

                
                
                

                
            
        }

        deleteInstitucion(id_servicio){
            Swal.fire({
                title: '¿Estás totalmente seguro de eliminar la Institución?',
                html:'La institución a eliminar es: <b>' + this.institucion + '</b>. <br><br> Recordar que eliminar una Institución, conlleva borrar <b>TODOS</b> los indicadores asociados a esta, ademas de <b>TODOS</b> los documentos asociados a esta.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Si.`,
                denyButtonText: `No.`,
                cancelButtonText: `Cancelar.`
            }).then((result)=>{
                if(result.isConfirmed){
                    const payload = new HttpParams()
                    .set('servicio',JSON.stringify(id_servicio))
                    this.editService.deleteInstitucion(payload).subscribe((resp:any)=>{
                        Swal.fire({
                            icon: 'success',
                            title: 'Institución eliminada correctamente.',
                            showConfirmButton: false,
                            timer: 1500
                        }).then((result2)=>{
                            
                            window.location.reload()
    
                            
                            
                        })
                    },(err:any)=>{
    
                    })
                }
            })
        }

        changeName(event){
            
        }
        changeDocument(event){
            
        }

        addDocument(){
           let new_document = this.firstFormGroup.controls['documentoFuente'].value

           this.new_documentos.push(new_document)
           
        }

        deleteDocument(documento){
            let documento_id = documento.id;
            
            this.new_documentos = this.new_documentos.filter(t=>
                
                t.id !== documento_id
            
            );

            this.documentos_array.push(documento.nombre)

            
            this.filteredNgModelOptions2$ = of(this.documentos_array);
            
            
        }

        registrarCambios(){
            let new_name = this.firstFormGroup.controls['nombre'].value
            this.new_documentos_names = []
            this.new_documentos_ids = []

            if(new_name === ''){
                new_name = this.institucion
            }   

            for(let i = 0;i<this.new_documentos.length;i++){
                this.new_documentos_ids.push(this.new_documentos[i].id)
                this.new_documentos_names.push(this.new_documentos[i].nombre)
            }
            
            
            
           

             
             
            let texto_documentos = []

            texto_documentos.push(...this.documentos_actuales)
            texto_documentos.push(...this.new_documentos_names)
        

            let new_cambios = []
            
            let uncambio = new Cambios();
        
            uncambio.campo = "Nombre"
            uncambio.actual = this.institucion
            uncambio.nuevo = new_name

            let segundocambio = new Cambios()

            let documentos_actuales_string = this.documentos_actuales.join(', ')

            segundocambio.campo = "Documentos Fuentes"
            segundocambio.actual = documentos_actuales_string
            segundocambio.nuevo = texto_documentos.join(', ')


            new_cambios.push(uncambio)
            new_cambios.push(segundocambio)
            
            

            this.dialogref = this.dialogService.open(ChangeDataComponent, {context: { cambios: new_cambios }});


        }

        modify(){
            let new_name = this.firstFormGroup.controls['nombre'].value

            if(new_name === ''){
                new_name = this.institucion
            } 

             
             
             

            const payload = new HttpParams()
                    .set('id_institucion',JSON.stringify(this.serviciosMapa[this.institucion]))
                    .set('newName',JSON.stringify(new_name))
                    .set('documentosNuevos', JSON.stringify(this.new_documentos_ids))

                    this.editService.editInstitucion(payload).subscribe((resp:any)=>{
                        Swal.fire({
                            icon: 'success',
                            title: 'Institución modificada correctamente.',
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

        deleteDocument2(id_documento, nombre_documento){
            Swal.fire({
                title: '¿Estás totalmente seguro de quitar el documento asociado?',
                html:'El documento fuente a quitar es: <b>' + nombre_documento + '</b>. <br><br> Recordar que eliminar un documento fuente asociado, conlleva borrar la asociación de este documento fuente con la institución en cuestión.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Si.`,
                denyButtonText: `No.`,
                cancelButtonText: `Cancelar.`
            }).then((result)=>{
                if(result.isConfirmed){
                    const payload = new HttpParams()
                    .set('id_institucion',JSON.stringify(this.id_servicio))
                    .set('id_documento',JSON.stringify(id_documento))
                    this.editService.deleteDocumentAsociado2(payload).subscribe((resp:any)=>{
                        Swal.fire({
                            icon: 'success',
                            title: 'Documento quitado correctamente.',
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

        getDataCurrent(){
            this.documentos_actuales = []
            this.getDataIndicador.getDocumentosAsociados(this.id_servicio).subscribe((resp:any)=>{
                this.documentos = resp.result
                for(let i=0;i<this.documentos.length;i++){
                    this.documentos_actuales.push(this.documentos[i].nombre)
                }
            },(err:any)=>{
                
            })
        }
    
  }
