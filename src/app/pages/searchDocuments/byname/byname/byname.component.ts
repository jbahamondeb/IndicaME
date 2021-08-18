import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';


import {SearchServiceService} from '../../../search/search-service.service'
import { GetDataIndicadorService } from '../../../search/get-data-indicador.service';


import {saveAs} from 'file-saver'
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';


import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import * as $ from 'jquery'


@Component({
  selector: 'ngx-documentbyname',
  templateUrl: './byname.component.html',
  styleUrls: ['./byname.component.scss']
})
export class BynameComponent implements OnInit {


  options: string[];
  filteredControlOptions$: Observable<string[]>;
  filteredNgModelOptions$: Observable<string[]>;

  inputFormControl: FormControl;



  value: string;










  documentos_array: string[] = []

  documentosEncontrados: any;

  /*
  texto_regiones : string;
  texto_provincias : string;
  texto_comunas :string;
  */

  /*
  categorias_indicador: any;
  documentos_indicador: any;
  csv_indicador: any;
  */

  servicios_indicador: any;
  categoria_aportada: any;
  formatos_documento: any;

  p = 1;

  private alive = true;
    breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
    breakpoints: any;


  constructor(private searchService: SearchServiceService, private getDataIndicador: GetDataIndicadorService,private breakpointService: NbMediaBreakpointsService,
    private themeService: NbThemeService,) {

      this.breakpoints = this.breakpointService.getBreakpointsMap();

    
   }

  ngOnInit(): void {

    if ($(window).width() < 440 ) {
      $("#documento").attr("placeholder", "Nombre documento");
      
      
      
  }

  window.addEventListener('resize', function() {
      if ($(window).width() < 440 ) {
          $("#documento").attr("placeholder", "Nombre documento");
          
          //$('input[placeholder="Busca un documento fuente por su nombre..."]').attr('placeholder', 'Nombre documento fuente')
      }else{
          $("#documento").attr("placeholder", "Busca un documento fuente por su nombre...");
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
     for(let i=0;i<resp.result.length;i++){
       this.documentos_array.push(resp.result[i].nombre)
     }

     this.filteredNgModelOptions$ = of(this.documentos_array)

     this.inputFormControl = new FormControl()
   })
    

  }

  private filter(value: string): string[] {
  
      const filterValue = value.toLowerCase();

      return this.documentos_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
   


  }

  onModelChange(value: string) {
 
    this.filteredNgModelOptions$ = of(this.filter(value));

    this.value = value;
  }



  searchByName(){

    if(this.value){
      const payload = new HttpParams()
      .set('documento', JSON.stringify(this.value))


      this.searchService.searchDocumentByName(payload).subscribe((resp:any)=>{
        this.documentosEncontrados = resp.result;
      },(err:any)=>{
        this.documentosEncontrados = []
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error...',
          text: err.error.name,
          showConfirmButton: true
        })
      })

    
    }
    

  
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

  downloadFile(nombre: any){

    
  }

}
