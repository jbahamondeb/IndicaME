import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import {SearchServiceService} from '../../search-service.service'

import {Categoria} from './categoria'

import {ServiciosFuentes} from './serviciosfuentes'


import { HttpParams} from '@angular/common/http';

import {GetDataIndicadorService} from '../../get-data-indicador.service'


import {ArchivosService} from '../../archivos.service'

import {saveAs} from 'file-saver'


import { NbDialogService } from '@nebular/theme';


import {AddFileComponent} from '../../addFile/add-file/add-file.component'

import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'ngx-byfilters',
  templateUrl: './byfilters.component.html',
  styleUrls: ['./byfilters.component.scss']
})
export class ByfiltersComponent implements OnInit {




  
  radioGroupValue = 1;

  granularidadMinima: number = 1;

  regiones : string[] = [];

  selectedRegiones: any = [];


  categorias: any;
  mapCategorias = new Map<string, Categoria>();
  categoriasSeleccionadas = new Array<string>();
  categoriasSeleccionadasMapa = new Map<string, Number>();


  servicios: any;
  mapServiciosFuentes = new Map<string, ServiciosFuentes>();
  serviciosFuentesSeleccionados = new Array<string>();
  serviciosFuentesSeleccionadosMapa = new Map<string, Number>();


  texto_regiones : string;
  texto_provincias : string;
  texto_comunas :string;

  resultado: boolean = false

  indicadores:any;

  
  categorias_indicador: any;
  documentos_indicador: any;
  csv_indicador: any;


  dialogref: any;



  filtros: boolean = false;

  p: number = 1;

  downloadFileBool: boolean = false;


  filteredNgModelOptions$: Observable<string[]>;
  options: string[];
  value: string;

  filteredNgModelOptions2$: Observable<string[]>;
  options2: string[];
  value2: string;


  filteredNgModelOptions3$: Observable<string[]>;
  options3: string[];
  value3: string;
 
  regiones_filtradas: string[] = []
  regiones_seleccionadas: string[] = []
  regiones_seleccionadas_id: string[] = []

  provincias_filtradas: string[] = []
  provincias_seleccionadas: string[] = []
  provincias_seleccionadas_id: string[] = []

  comunas_filtradas: string[] = []
  comunas_seleccionadas: string[] = []
  comunas_seleccionadas_id: string[] = []




  regionesMapa = new Map<string, string>()
  provinciasMapa = new Map<string, string>()
  comunasMapa = new Map<string, string>()


  valueTime: number = 40;


  disabled: boolean = true;
    highValue: number = 60;
    opcionesSlider: Options = {
      floor: 1950,
      ceil: 3000,
      disabled: true
    };


    fecha_inicio: Date;
    fecha_fin: Date;
  
  constructor(private searchService: SearchServiceService,  private getDataIndicador:GetDataIndicadorService,
              private  archivosService:ArchivosService, private dialogService: NbDialogService) { 
                let local_storage;
                local_storage = localStorage.getItem('token')
        
                
                if(local_storage){
                  console.log(local_storage)
                  let decode = this.getDecodedAccessToken(local_storage)
              
                  console.log(decode)
                  if(decode.tipo == 1 || decode.tipo == 2) {
                    this.downloadFileBool = true;
                  }

                  
                }

                let anio_actual = new Date().getFullYear();
                  let anio_pasado = anio_actual - 5;
                  this.fecha_inicio = new Date(anio_pasado,0)
                  this.fecha_fin = new Date(anio_actual,0)
              
                  this.opcionesSlider.ceil = anio_actual
              
                  //this.valueTime = Number(this.fecha_inicio.getFullYear())
                  this.valueTime = 1950
                  this.highValue = Number(this.fecha_fin.getFullYear())

                  console.log(this.highValue)

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


    this.searchService.getRegiones().subscribe((resp:any)=>{
      
      for(let i = 0;i<resp.length;i++){
        this.regionesMapa[resp[i].nombre] = resp[i].id
        
        this.regiones_filtradas.push(resp[i].nombre)
      }

      this.filteredNgModelOptions$ = of(this.regiones_filtradas);
      
    },(err:any)=>{

    })

    this.searchService.getProvincias().subscribe((resp:any)=>{
      
      for(let i = 0;i<resp.length;i++){
        this.provinciasMapa[resp[i].nombre] = resp[i].id
        
        this.provincias_filtradas.push(resp[i].nombre)
      }

      this.filteredNgModelOptions2$ = of(this.provincias_filtradas);
      
    },(err:any)=>{

    })

    this.searchService.getComunas().subscribe((resp:any)=>{
      
      for(let i = 0;i<resp.length;i++){
        this.comunasMapa[resp[i].nombre] = resp[i].id
        
        this.comunas_filtradas.push(resp[i].nombre)
      }

      this.filteredNgModelOptions3$ = of(this.comunas_filtradas);
      
    },(err:any)=>{

    })
    

    this.searchService.getAllCategorias().subscribe((resp:any)=>{
      this.categorias = resp.result;

        for(let i=0;i<this.categorias.length;i++){
          let categoria_actual = this.categorias[i]
          let nueva_categoria = new Categoria()
          nueva_categoria.nombre = categoria_actual.nombre;
          nueva_categoria.id = categoria_actual.id_categoria;
          nueva_categoria.filtrado = false;
          this.mapCategorias.set(categoria_actual.id_categoria, nueva_categoria)

      

      }

      

    })

    this.searchService.getAllServiciosFuentes().subscribe((resp:any)=>{
      this.servicios = resp.result;
      
  
      for(let i=0;i<this.servicios.length;i++){
        let servicio_actual = this.servicios[i]
        let nuevo_servicio_fuente = new ServiciosFuentes()
        nuevo_servicio_fuente.institucion = servicio_actual.institucion;
        nuevo_servicio_fuente.id = servicio_actual.id_servicio;
        nuevo_servicio_fuente.filtrado = false;
        this.mapServiciosFuentes.set(servicio_actual.id_servicio, nuevo_servicio_fuente)

        
      }

    })



 


    
  }

  private filter(value: string): string[] {
  
    const filterValue = value.toLowerCase();

    if(this.granularidadMinima == 1){
      return this.regiones_filtradas.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
    }else if(this.granularidadMinima == 2){
      return this.provincias_filtradas.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
    }else if(this.granularidadMinima == 3){
      return this.comunas_filtradas.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
    }
    
 


  }

  valorSeleccionado(event){

    

    
    if(this.granularidadMinima == 1){
      this.value = event
      if(this.value != ''){
        this.regiones_seleccionadas.push(event)
        this.regiones_filtradas = this.regiones_filtradas.filter(t=>
                
          t !== event
      
        );
          
        let codigo_actual = this.regionesMapa[event]
        this.regiones_seleccionadas_id.push(codigo_actual)
        /*
        this.regiones_seleccionadas_id = this.regiones_seleccionadas_id.filter(t=>
          t!= codigo_actual
        );*/

        this.filteredNgModelOptions$ = of(this.regiones_filtradas);
      }
      

      this.value = '';
    }else if(this.granularidadMinima == 2){
      this.value2 = event;

      if(this.value2 != ''){
        this.provincias_seleccionadas.push(event)

        this.provincias_filtradas = this.provincias_filtradas.filter(t=>
                
          t !== event
      
        );
          
        let codigo_actual = this.provinciasMapa[event]
        this.provincias_seleccionadas_id.push(codigo_actual)
        

        this.filteredNgModelOptions2$ = of(this.provincias_filtradas);
        this.value2 = '';
      }
      
    }else if(this.granularidadMinima == 3){
      this.value3 = event;

      if(this.value3 != ''){
        this.comunas_seleccionadas.push(event)

      this.comunas_filtradas = this.comunas_filtradas.filter(t=>
              
        t !== event
    
      );
        
      let codigo_actual = this.comunasMapa[event]
      this.comunas_seleccionadas_id.push(codigo_actual)
      

      this.filteredNgModelOptions3$ = of(this.comunas_filtradas);
      this.value3 = '';
      }
      
    }
    
  }

  onTagRemove(event){
    
    if(this.granularidadMinima == 1){
      this.regiones_seleccionadas = this.regiones_seleccionadas.filter(t=>
        t!= event.text
      );
      let codigo_actual = this.regionesMapa[event.text]
      this.regiones_seleccionadas_id = this.regiones_seleccionadas_id.filter(t=>
          t!= codigo_actual
      );
  
      this.regiones_filtradas.push(event.text)
      this.filteredNgModelOptions$ = of(this.regiones_filtradas);
    }else if(this.granularidadMinima == 2){
      this.provincias_seleccionadas = this.provincias_seleccionadas.filter(t=>
        t!= event.text
      );
      let codigo_actual = this.provinciasMapa[event.text]
      this.provincias_seleccionadas_id = this.provincias_seleccionadas_id.filter(t=>
          t!= codigo_actual
      );
  
      this.provincias_filtradas.push(event.text)
      this.filteredNgModelOptions2$ = of(this.provincias_filtradas);
    }else if(this.granularidadMinima == 3){
      this.comunas_seleccionadas = this.comunas_seleccionadas.filter(t=>
        t!= event.text
      );
      let codigo_actual = this.comunasMapa[event.text]
      this.comunas_seleccionadas_id = this.comunas_seleccionadas_id.filter(t=>
          t!= codigo_actual
      );
  
      this.comunas_filtradas.push(event.text)
      this.filteredNgModelOptions3$ = of(this.comunas_filtradas);
    }
    
  }



  onModelChange(value: string) {
    
    if(this.granularidadMinima == 1){
      this.filteredNgModelOptions$ = of(this.filter(value));

      
    }else if(this.granularidadMinima == 2){
      this.filteredNgModelOptions2$ = of(this.filter(value));

      //this.value2 = value;
    }else if(this.granularidadMinima == 3){
      this.filteredNgModelOptions3$ = of(this.filter(value));

      //this.value3 = value;
    }
    
  }

  onChangeGranularidad(event:any){
    this.granularidadMinima = event;
    
  }

  activateYears(event){
    
    if(event == true){
      this.disabled = false
      this.opcionesSlider = Object.assign({}, this.opcionesSlider, {disabled: this.disabled});
     
    }else if(event == false){
      this.disabled = true;
      this.opcionesSlider = Object.assign({}, this.opcionesSlider, {disabled: this.disabled});

    }
    console.log(event)
    //
  }

  filtrar(evento:any, id: string, tipoFiltro: string){


    let categoria_seleccionada;

    
    
    if(tipoFiltro=="categoria"){
      categoria_seleccionada = this.mapCategorias.get(id)

     
    }else if(tipoFiltro=="servicio"){
        categoria_seleccionada = this.mapServiciosFuentes.get(id)
    }
   

    categoria_seleccionada.filtrado = evento.target.checked

    



  }
  buscarPorFiltros(){

  

    this.categoriasSeleccionadas = []
    this.serviciosFuentesSeleccionados = []

    for (let [key, value] of this.mapCategorias) {
      if(value.filtrado == true){

        this.categoriasSeleccionadas.push(key)
        
      }
      
    }

    for (let [key, value] of this.mapServiciosFuentes) {
      if(value.filtrado == true){
        this.serviciosFuentesSeleccionados.push(key)
        
        
      }
      
    }
    
    this.texto_regiones = ""
    this.texto_provincias = ""
    this.texto_comunas = ""

    this.cargarDatos()


      



  }

  cargarDatos(){
   
    let array_granularidades = []
    let anyo_in, anyo_fin
    if(this.disabled == true){
      anyo_in = -1;
      anyo_fin = -1
    }else{
      anyo_in = this.valueTime
      anyo_fin = this.highValue
    }

    if(this.granularidadMinima == 1){

      if(this.regiones_seleccionadas_id.length > 0){
        const payload2 = new HttpParams()
        .set('regionesSeleccionadas', JSON.stringify(this.regiones_seleccionadas_id))
  
  
        this.searchService.getProvinciasYComunas(payload2).subscribe((resp:any)=>{
          console.log(resp)
          //array_granularidades = [this.regiones_seleccionadas_id, ... resp.response]
          array_granularidades.push(...this.regiones_seleccionadas_id)
          array_granularidades.push(...resp.response)
          console.log(array_granularidades)

          const payload = new HttpParams()
          .set('categoriasSeleccionadas',JSON.stringify(this.categoriasSeleccionadas))
          .set('serviciosFuentesSeleccionados',JSON.stringify(this.serviciosFuentesSeleccionados))
          .set('granularidadesSeleccionadas', JSON.stringify(array_granularidades))
          .set('anyo_in',JSON.stringify(anyo_in))
          .set('anyo_fin',JSON.stringify(anyo_fin))

          this.searchService.getIndicadores(payload).subscribe((resp:any)=>{
        

            if(typeof resp.response == 'string' ){
              this.resultado = false
            }else{
              this.resultado = true
              this.indicadores = resp.response
            }
          },(err =>{

            this.indicadores = []
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error...',
              text: err.error.name,
              showConfirmButton: true
            })
          }))
        },(err:any)=>{
  
        })
      }else{
        

          const payload = new HttpParams()
          .set('categoriasSeleccionadas',JSON.stringify(this.categoriasSeleccionadas))
          .set('serviciosFuentesSeleccionados',JSON.stringify(this.serviciosFuentesSeleccionados))
          .set('granularidadesSeleccionadas', JSON.stringify(this.regiones_seleccionadas_id))
          .set('anyo_in',JSON.stringify(anyo_in))
          .set('anyo_fin',JSON.stringify(anyo_fin))
          this.searchService.getIndicadores(payload).subscribe((resp:any)=>{
        

            if(typeof resp.response == 'string' ){
              this.resultado = false
            }else{
              this.resultado = true
              this.indicadores = resp.response
            }
          },(err =>{
            this.indicadores = []
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error...',
              text: err.error.name,
              showConfirmButton: true
            })
          }))


      }
     
    }else if(this.granularidadMinima == 2){
      if(this.provincias_seleccionadas_id.length>0){
        const payload2 = new HttpParams()
        .set('provinciasSeleccionadas', JSON.stringify(this.provincias_seleccionadas_id))
  
  
        this.searchService.getComunasByProvincia(payload2).subscribe((resp:any)=>{
          console.log(resp)
          //array_granularidades = [this.regiones_seleccionadas_id, ... resp.response]
          array_granularidades.push(...this.provincias_seleccionadas_id)
          array_granularidades.push(...resp.response)
          console.log(array_granularidades)

          const payload = new HttpParams()
          .set('categoriasSeleccionadas',JSON.stringify(this.categoriasSeleccionadas))
          .set('serviciosFuentesSeleccionados',JSON.stringify(this.serviciosFuentesSeleccionados))
          .set('granularidadesSeleccionadas', JSON.stringify(array_granularidades))
          .set('anyo_in',JSON.stringify(anyo_in))
          .set('anyo_fin',JSON.stringify(anyo_fin))


          this.searchService.getIndicadores(payload).subscribe((resp:any)=>{
        

            if(typeof resp.response == 'string' ){
              this.resultado = false
            }else{
              this.resultado = true
              this.indicadores = resp.response
            }
          },(err =>{
            
          }))
        },(err:any)=>{
          this.indicadores = []
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error...',
            text: err.error.name,
            showConfirmButton: true
          })
        })
      }else{
        const payload = new HttpParams()
          .set('categoriasSeleccionadas',JSON.stringify(this.categoriasSeleccionadas))
          .set('serviciosFuentesSeleccionados',JSON.stringify(this.serviciosFuentesSeleccionados))
          .set('granularidadesSeleccionadas', JSON.stringify(this.provincias_seleccionadas_id))
          .set('anyo_in',JSON.stringify(anyo_in))
          .set('anyo_fin',JSON.stringify(anyo_fin))
          this.searchService.getIndicadores(payload).subscribe((resp:any)=>{
        

            if(typeof resp.response == 'string' ){
              this.resultado = false
            }else{
              this.resultado = true
              this.indicadores = resp.response
            }
          },(err =>{
            this.indicadores = []
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error...',
              text: err.error.name,
              showConfirmButton: true
            })
          }))
      }
      
    }else if(this.granularidadMinima == 3){
      const payload = new HttpParams()
      .set('categoriasSeleccionadas',JSON.stringify(this.categoriasSeleccionadas))
      .set('serviciosFuentesSeleccionados',JSON.stringify(this.serviciosFuentesSeleccionados))
      .set('granularidadesSeleccionadas', JSON.stringify(this.comunas_seleccionadas_id))
      .set('anyo_in',JSON.stringify(anyo_in))
      .set('anyo_fin',JSON.stringify(anyo_fin))

      this.searchService.getIndicadores(payload).subscribe((resp:any)=>{
        

        if(typeof resp.response == 'string' ){
          this.resultado = false
        }else{
          this.resultado = true
          this.indicadores = resp.response
        }
      },(err =>{
        this.indicadores = []
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error...',
          text: err.error.name,
          showConfirmButton: true
        })
      }))
    }
    
    /*
    const payload = new HttpParams()
    if(this.granularidadMinima == 1){
       
      
      
      
    }else if(this.granularidadMinima == 2){
      payload
      .set('categoriasSeleccionadas',JSON.stringify(this.categoriasSeleccionadas))
      .set('serviciosFuentesSeleccionados',JSON.stringify(this.serviciosFuentesSeleccionados))
      .set('granularidadesSeleccionadas', JSON.stringify(this.provincias_seleccionadas_id))
    }else if(this.granularidadMinima == 3){
      payload
      .set('categoriasSeleccionadas',JSON.stringify(this.categoriasSeleccionadas))
      .set('serviciosFuentesSeleccionados',JSON.stringify(this.serviciosFuentesSeleccionados))
      .set('granularidadesSeleccionadas', JSON.stringify(this.comunas_seleccionadas_id))
    }

    this.searchService.getIndicadores(payload).subscribe((resp:any)=>{
        

      if(typeof resp.response == 'string' ){
        this.resultado = false
      }else{
        this.resultado = true
        this.indicadores = resp.response
      }
    },(err =>{

    }))*/
    
  }

  openIndicador(id_indicador){
    this.texto_regiones = ""
    this.texto_provincias = ""
    this.texto_comunas = ""

    this.getDataIndicador.getCategorias(id_indicador).subscribe((resp:any)=>{
      this.categorias_indicador = resp.result

      

      this.getDataIndicador.getDocumentos(id_indicador).subscribe((resp:any)=>{
        this.documentos_indicador = resp.result

        this.getDataIndicador.getCSV(id_indicador).subscribe((resp:any)=>{
          this.csv_indicador = resp.result
          
          this.getDataIndicador.getRegiones(id_indicador).subscribe((resp:any)=>{
            let regiones = resp.result
            let n_regiones = regiones.length
            for(let i=0;i<n_regiones;i++){
              if(i+1 >= n_regiones){
                this.texto_regiones+= regiones[i].nombre
              }else{
                this.texto_regiones+= regiones[i].nombre + " ,"
              }
            }

            this.getDataIndicador.getProvincias(id_indicador).subscribe((resp:any)=>{
              let provincias = resp.result
              let n_provincias = provincias.length;
              for(let i=0;i<n_provincias;i++){
                if(i+1 >= n_provincias){
                  this.texto_provincias+= provincias[i].nombre
                }else{
                  this.texto_regiones+= provincias[i] + " ,"
                }
              }

              this.getDataIndicador.getComunas(id_indicador).subscribe((resp:any)=>{
                let comunas = resp.result
                let n_comunas =comunas.length;

                for(let i=0;i<n_comunas;i++){
                  if(i+1 >= n_comunas){
                    this.texto_comunas+= comunas[i].nombre
                  }else{
                    this.texto_comunas+= comunas[i].nombre + " ,"
                  }
                }
              })

            })
          })
        })
      })


    })
  }

  downloadFile(nombre: any){

    this.archivosService.downloadFile(nombre).subscribe((resp:any)=>{
      saveAs(resp, nombre); 
    },(err:any)=>{
        //swal
    })
  }

  openDialogAdd(id_indicador: any){


    this.dialogref = this.dialogService.open(AddFileComponent, {context: { id_indicador: id_indicador, flag: false},closeOnBackdropClick: false, closeOnEsc: false});



    /*
    this.dialogService.open(AddFileComponent, {
      dialogClass: 'model-full'
    });
    */
  }

  filterornot(){
    if(this.filtros == true){
      this.filtros = false;
    }else{
      this.filtros = true;
    }
  }

  public closeDialog(){
    this.dialogref.close()
  }
}


