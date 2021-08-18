import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { GetDataIndicadorService } from '../../search/get-data-indicador.service';
import { SearchServiceService } from '../../search/search-service.service';
import { EditService } from '../edit.service';
import jwt_decode from 'jwt-decode';
import { Cambios } from '../../cambios';
import { NbDialogService } from '@nebular/theme';
import { ChangeDataComponent } from '../../changes/changeData/changedata.component';
import { ChangesService } from '../../changes/changes.service';
import { Institucion } from './institucion';

import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import * as $ from 'jquery'


@Component({
    selector: 'ngx-editDocumento',
    templateUrl: './editDocumento.component.html',
    styleUrls: ['./editDocumento.component.scss']
  })


  export class EditDocumentoComponent implements OnInit {

    filteredNgModelOptions$: Observable<string[]>;
    inputFormControl: FormControl;
    firstFormGroup: FormGroup;

    filteredNgModelOptions2$: Observable<string[]>;
    inputFormControl2: FormControl;

    documentos_array: string[] = []
    documentosMapa = new Map<string, Number>()

    servicios_array: string[] = []
    serviciosMapa = new Map<string, Number>()

    value;
    value2;

    validDocumento: boolean = false;
    validServicio: boolean = false;

    id_documento;

    documento;

    instituciones:any;

    new_servicios: Institucion[] = []
    new_servicios_id: string[] = []
    new_servicios_names: string[] = []


    institucion_actual:any;
    institucion_actual_id:any;

    tipo_user: any;
    admin = false;

    dialogref: any;

    seleccionado: boolean = false;

    servicios_actuales:string[] = []
    servicios_actuales_id:number[] = []


    private alive = true;
    breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
    breakpoints: any;

      constructor(private searchService: SearchServiceService,private getDataIndicador:GetDataIndicadorService,
                    private fb: FormBuilder, private editService:EditService,private dialogService: NbDialogService,
                    private changeService: ChangesService,  private breakpointService: NbMediaBreakpointsService,
                    private themeService: NbThemeService,){

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
                            servicioFuente: ['']
                            
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
            $("#documento").attr("placeholder", "Nombre documento");
            
            
            
        }

        window.addEventListener('resize', function() {
            if ($(window).width() < 365 ) {
                $("#documento").attr("placeholder", "Nombre documento");
                
                //$('input[placeholder="Busca un documento fuente por su nombre..."]').attr('placeholder', 'Nombre documento fuente')
            }else{
                $("#documento").attr("placeholder", "Busca el documento a modificar...");
                //$("#documentoFuente").attr("placeholder", "Busca un documento fuente por su nombre...");
                //$('input[placeholder="Nombre documento fuente"]').attr('placeholder', 'Busca un documento fuente por su nombre...')
            }
        })

        this.themeService.onMediaQueryChange()
        .pipe(takeWhile(() => this.alive))
        .subscribe(([oldValue, newValue]) => {
            this.breakpoint = newValue;
        });
        
        this.searchService.getAllDocuments().subscribe((resp:any)=>{
            for(let i = 0 ;i<resp.result.length;i++){
                this.documentos_array.push(resp.result[i].nombre)
                this.documentosMapa[resp.result[i].nombre] = resp.result[i].id_documento
            }
            this.filteredNgModelOptions$ = of(this.documentos_array);
            this.inputFormControl = new FormControl();
        },(err:any)=>{

        })
        /*
        this.searchService.getAllServiciosFuentes().subscribe((resp:any)=>{
            for(let i = 0 ;i<resp.result.length;i++){
                this.servicios_array.push(resp.result[i].institucion)
                this.serviciosMapa[resp.result[i].institucion] = resp.result[i].id_servicio
            }
            this.filteredNgModelOptions2$ = of(this.servicios_array);
            this.inputFormControl2 = new FormControl();
        },(err:any)=>{

        })*/

        this.changeService.configObservable.subscribe(value =>{
            if(value == true){
                this.modify()
            }
        })
      }

      private filter(value: string): string[] {
  
        const filterValue = value.toLowerCase();

       
  
        return this.documentos_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
     
  
  
    }   
    private filter2(value: string): string[] {
  
        const filterValue = value.toLowerCase();

       
  
        return this.servicios_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
     
  
  
    }   
    onModelChange(value: string) {

            
            //this.value = value;
    
            //this.validDocumento = false;
            this.seleccionado = false;
            this.servicios_actuales = []
            this.servicios_actuales_id = []
            this.servicios_array = []
            this.serviciosMapa.clear()

        if(value && value != ''){
            this.filteredNgModelOptions$ = of(this.filter(value));

        }else if(value == ''){
            this.filteredNgModelOptions$ = of(this.documentos_array);
        }
 
       

        
        
    }

    onModelChange2(value: string) {

        if(value && value != ''){
            this.filteredNgModelOptions2$ = of(this.filter2(value));
    
            //this.value2 = value;

            //this.validServicio = false;

            //this.new_servicio_id = '-1'

            
        }else if(value == ''){
            this.filteredNgModelOptions2$ = of(this.servicios_array);
        }
 
        
        
        
    }

    valorSeleccionado(event:any){
            

        
        
            //this.validDocumento = true; 
            this.servicios_actuales = []
            this.servicios_actuales_id = []
            this.servicios_array = []
            this.serviciosMapa.clear()
            this.id_documento = this.documentosMapa[event]  
            this.documento = event;
            this.seleccionado = true;
            this.getDataIndicador.getServiciosFuentesOfDocumento(this.id_documento).subscribe((resp:any)=>{
                this.instituciones = resp.result;
                for(let i=0;i<this.instituciones.length;i++){
                    this.servicios_actuales.push(this.instituciones[i].institucion)
                    this.servicios_actuales_id.push(this.instituciones[i].id_servicio)
                    console.log(this.instituciones[i])
                }
                console.log(this.servicios_actuales_id)
                //this.institucion_actual = resp.result[0].institucion;
                //this.institucion_actual_id = resp.result[0].id_servicio;
                const payload = new HttpParams()
                
                .set('instituciones_actuales',JSON.stringify(this.servicios_actuales_id))

                this.editService.getInstitucionesRestantesDocumento(payload).subscribe((resp:any)=>{
                    console.log(resp.result)
                    for(let i = 0 ;i<resp.result.length;i++){
                        this.servicios_array.push(resp.result[i].institucion)
                        this.serviciosMapa[resp.result[i].institucion] = resp.result[i].id_servicio
                        
                    }

                    this.filteredNgModelOptions2$ = of(this.servicios_array);
                    this.inputFormControl2 = new FormControl();

                    if ($(window).width() < 350 ) {
                       
                        
                        $("#inputServicio").attr("placeholder", "Institución");
                        
                    }else{
                        
                        $("#inputServicio").attr("placeholder", "Busca la institución a añadir...");
                    }
                    

                    window.addEventListener('resize', function() {
                        if ($(window).width() < 350 ) {
                            
                            
                            $("#inputServicio").attr("placeholder", "Institución");
                        }else{
                            
                            $("#inputServicio").attr("placeholder", "Busca la institución a añadir....");
                        }
                    })


                },(err:any)=>{

                })

            },(err:any)=>{

            })
            
        
    }

    valorSeleccionado2(event:any){
        
        if(event != ''){
            //this.validServicio = true; 
            let new_institucion = new Institucion()
            new_institucion.id = this.serviciosMapa[event]
            new_institucion.institucion = event
            this.new_servicios.push(new_institucion)
            this.value2 = ''

            this.firstFormGroup.patchValue({
                servicioFuente: ''
            })

            this.servicios_array = this.servicios_array.filter(t=>
                
                t !== event
            
            );
            this.filteredNgModelOptions2$ = of(this.servicios_array);
            //this.new_servicio = event;
            //this.new_servicio_id = this.serviciosMapa[event]

            
            
            

            
        }
    }

    deleteDocumento(){
        Swal.fire({
            title: '¿Estás totalmente seguro de eliminar el Documento Fuente?',
            html:'El Documento Fuente a eliminar es: <b>' + this.documento + '</b>. <br><br> Recordar que eliminar un Documento, conlleva borrar <b>TODOS</b> los indicadores asociados a este que ya no cuenten con ningún documento fuente asociado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Si.`,
            denyButtonText: `No.`,
            cancelButtonText: `Cancelar.`
        }).then((result)=>{
            if(result.isConfirmed){
                const payload = new HttpParams()
                .set('documento',JSON.stringify(this.id_documento))

                this.editService.deleteDocumento(payload).subscribe((resp:any)=>{
                    Swal.fire({
                        icon: 'success',
                        title: 'Documento Fuente eliminado correctamente.',
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

    deleteServicio(servicio){
        let servicio_id = servicio.id;
        
        this.new_servicios = this.new_servicios.filter(t=>
            
            t.id !== servicio_id
        
        );

        this.servicios_array.push(servicio.institucion)

        
        this.filteredNgModelOptions2$ = of(this.servicios_array);
        
        
    }

    registrarCambios(){
        let new_name = this.firstFormGroup.controls['nombre'].value
        this.new_servicios_names = []

        this.new_servicios_id = []
        /*
        if(this.new_servicio_id == '-1'){
            this.new_servicio_id = this.institucion_actual_id
        }
        */
       

        if(new_name === ''){
            new_name = this.documento
        }

        for(let i=0;i<this.new_servicios.length;i++){
            this.new_servicios_id.push(this.new_servicios[i].id)
            this.new_servicios_names.push(this.new_servicios[i].institucion)
        }
        
        /*
        let new_servicio_name;
        if(this.new_servicio == ''){
            this.new_servicio = this.institucion_actual
        }
        new_servicio_name = this.new_servicio
        */

        let new_cambios = []
            
        let uncambio = new Cambios();
        uncambio.campo = "Nombre"
        uncambio.actual = this.documento 
        uncambio.nuevo = new_name

        let texto_servicios = []

        texto_servicios.push(...this.servicios_actuales)
        texto_servicios.push(...this.new_servicios_names)

        let segundocambio = new Cambios()
        segundocambio.campo="ServicioFuente"
        segundocambio.actual = this.servicios_actuales.join(', ')
        segundocambio.nuevo = texto_servicios.join(', ')

        /*
        let new_cambio = new Cambios();
        
        new_cambio.campos.push("Nombre")
        new_cambio.campos.push("ServicioFuente")
        new_cambio.actuales.push(this.documento)
        new_cambio.actuales.push(this.institucion_actual)
        new_cambio.nuevos.push(new_name)
        new_cambio.nuevos.push(new_servicio_name)*/

        new_cambios.push(uncambio)
        new_cambios.push(segundocambio)

        this.dialogref = this.dialogService.open(ChangeDataComponent, {context: { cambios: new_cambios }});
        

        
        /*
        Swal.fire({
            title: '¿Estás seguro de realizar los siguientes cambio?',
            html: '<table id="table" border=1> <thead> <tr> <th>Campo</th>'+
            '<th>Actual</th> <th>Nuevo</th> </tr> </thead> <tbody> <tr> <td>Nombre</td> <td>'+this.documento+'</td>'+
            '<td>'+new_name+'</td> <tr> <td>Servicio Fuente </td> <td> ' + this.institucion_actual + 
            '</td> <td>' + new_servicio_name + ' </td></tbody></table>',
            icon: 'info',
            width: '50%',
            showCancelButton: true,
            confirmButtonText: `Si.`,
            denyButtonText: `No.`,
            cancelButtonText: `Cancelar.`
            
        }).then((result)=>{ 
            if(result.isConfirmed){
                const payload = new HttpParams()
                .set('id_documento',JSON.stringify(this.id_documento))
                .set('nuevoName',JSON.stringify(new_name))
                .set('servicioNuevo', JSON.stringify(this.new_servicio_id))
                .set('servicioAntiguo', JSON.stringify(this.institucion_actual_id))
                
                this.editService.editDocumento(payload).subscribe((resp:any)=>{
                    Swal.fire({
                        icon: 'success',
                        title: 'Documento modificado correctamente.',
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
        })*/
    }

    modify(){
        let new_name = this.firstFormGroup.controls['nombre'].value

        if(new_name === ''){
            new_name = this.documento
        }
        const payload = new HttpParams()
        .set('id_documento',JSON.stringify(this.id_documento))
        .set('nuevoName',JSON.stringify(new_name))
        .set('serviciosNuevos', JSON.stringify(this.new_servicios_id))
        
                
        this.editService.editDocumento(payload).subscribe((resp:any)=>{
            Swal.fire({
                icon: 'success',
                title: 'Documento modificado correctamente.',
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


    deleteServicio2(id_servicio, nombre_servicio){
        console.log(id_servicio)
        Swal.fire({
            title: '¿Estás totalmente seguro de quitar la institución asociada?',
            html:'La institución a quitar es: <b>' + nombre_servicio + '</b>. <br><br> Recordar que eliminar una institución asociada, conlleva borrar la asociación de esta institución con el documento fuente en cuestión.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Si.`,
            denyButtonText: `No.`,
            cancelButtonText: `Cancelar.`
        }).then((result)=>{
            if(result.isConfirmed){
                const payload = new HttpParams()
                .set('id_institucion',JSON.stringify(id_servicio))
                .set('id_documento',JSON.stringify(this.id_documento))
                this.editService.deleteDocumentAsociado2(payload).subscribe((resp:any)=>{
                    Swal.fire({
                        icon: 'success',
                        title: 'Institución quitada correctamente.',
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
  }
