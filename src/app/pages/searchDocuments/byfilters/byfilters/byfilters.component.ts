import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';


import {Categoria} from './categoria'

import {ServiciosFuentes} from './serviciosfuentes'

import {Formatos} from './formatos'


import { HttpParams} from '@angular/common/http';
import { SearchServiceService } from '../../../search/search-service.service';
import { GetDataIndicadorService } from '../../../search/get-data-indicador.service';

import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import Swal from 'sweetalert2';






@Component({
  selector: 'ngx-documentbyfilters',
  templateUrl: './byfilters.component.html',
  styleUrls: ['./byfilters.component.scss']
})
export class ByfiltersComponent implements OnInit {




  categorias: any;
  mapCategorias = new Map<string, Categoria>();
  categoriasSeleccionadas = new Array<string>();

  servicios: any;
  mapServiciosFuentes = new Map<string, ServiciosFuentes>();
  serviciosFuentesSeleccionados = new Array<string>();

  formatos: any;
  mapFormatos = new Map<string, Formatos>();
  formatosSeleccionados = new Array<string>();


  resultado: boolean = false

  documento:any;

  servicios_indicador: any;
  categoria_aportada: any;
  formatos_documento: any;

  filtros: boolean = false;

  p: number = 1;

  private alive = true;
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;

  constructor(private searchService: SearchServiceService,  private getDataIndicador:GetDataIndicadorService,private breakpointService: NbMediaBreakpointsService,
    private themeService: NbThemeService) { 
      this.breakpoints = this.breakpointService.getBreakpointsMap();

  }

  ngOnInit(): void {
    this.themeService.onMediaQueryChange()
        .pipe(takeWhile(() => this.alive))
        .subscribe(([oldValue, newValue]) => {
            this.breakpoint = newValue;
        });
        
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

    this.searchService.getAllFormatos().subscribe((resp:any)=>{
      this.formatos = resp.result;

      for(let i=0;i<this.formatos.length;i++){
        let formato_actual = this.formatos[i]
   
        let nuevo_formato = new Formatos()
        nuevo_formato.id = formato_actual.id_formato
        nuevo_formato.formato = formato_actual.formato
        nuevo_formato.filtrado = false;
        this.mapFormatos.set(formato_actual.id_formato, nuevo_formato)
      }
      
    })

   

    


 


   
  }


  filtrar(evento:any, id: string, tipoFiltro: string){


    let categoria_seleccionada;
    if(tipoFiltro=="categoria"){
      categoria_seleccionada = this.mapCategorias.get(id)

     
    }else if(tipoFiltro=="servicio"){
        categoria_seleccionada = this.mapServiciosFuentes.get(id)
    }else if(tipoFiltro=="formato"){
      
      categoria_seleccionada = this.mapFormatos.get(id)
    }
   


    categoria_seleccionada.filtrado = evento.target.checked




   

  }
  buscarPorFiltros(){
  
    this.categoriasSeleccionadas = []
    this.serviciosFuentesSeleccionados = []
    this.formatosSeleccionados = []
      
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

    for (let [key, value] of this.mapFormatos) {
      if(value.filtrado == true){
        this.formatosSeleccionados.push(key)
        
        
      }
      
    }
    
    console.log(this.mapFormatos)
    console.log(this.formatosSeleccionados)

    this.cargarDatos()



  }

  cargarDatos(){
    const payload = new HttpParams()
    .set('categoriasSeleccionadas',JSON.stringify(this.categoriasSeleccionadas))
    .set('serviciosFuentesSeleccionados',JSON.stringify(this.serviciosFuentesSeleccionados))
    .set('formatosSeleccionados', JSON.stringify(this.formatosSeleccionados))

    this.searchService.getDocumentosFiltro(payload).subscribe((resp:any)=>{
      if(typeof resp.response == 'string' ){
        this.resultado = false
      }else{
        this.resultado = true
        this.documento = resp.response
      }

    },(err)=>{
      this.documento = []
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error...',
              text: err.error.name,
              showConfirmButton: true
            })
    })
    
  }

  openDocument(id_documento){
    this.getDataIndicador.getServiciosFuentesOfDocumento(id_documento).subscribe((resp:any)=>{
      this.servicios_indicador = resp.result
      console.log(this.servicios_indicador)

      this.getDataIndicador.getCategoriaAportadaOfDocumento(id_documento).subscribe((resp:any)=>{
        this.categoria_aportada = resp.result;

        this.getDataIndicador.getFormatoOfDocumento(id_documento).subscribe((resp:any)=>{
          this.formatos_documento = resp.result;
        },(err)=>{

        })
      },(err)=>{

      })
    },(err)=>{

    })
   
  }

  filterornot(){
    if(this.filtros == true){
      this.filtros = false;
    }else{
      this.filtros = true;
    }
  }

  downloadFile(nombre: any){

    
  }

  

}
