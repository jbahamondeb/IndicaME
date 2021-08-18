import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';



import {SearchServiceService} from '../../search-service.service'
import { NbAccordionItemComponent } from '@nebular/theme';


import {GetDataIndicadorService} from '../../get-data-indicador.service'

import {ArchivosService} from '../../archivos.service'

import {saveAs} from 'file-saver'

import { NbDialogService } from '@nebular/theme';


import {AddFileComponent} from '../../addFile/add-file/add-file.component'
import { HttpParams } from '@angular/common/http';

import jwt_decode from 'jwt-decode';


import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators'


import * as $ from 'jquery';

@Component({
  selector: 'ngx-byname',
  templateUrl: './byname.component.html',
  styleUrls: ['./byname.component.scss']
})
export class BynameComponent implements OnInit {


  options: string[];
  filteredControlOptions$: Observable<string[]>;
  filteredNgModelOptions$: Observable<string[]>;

  inputFormControl: FormControl;



  value: string;










  indicadores_array: string[] = []

  indicadoresEncontrados: any;


  texto_regiones : string;
  texto_provincias : string;
  texto_comunas :string;


  categorias_indicador: any;
  documentos_indicador: any;
  csv_indicador: any;

  dialogref: any;

  p: number = 1;

  downloadFileBool: boolean = false;


  private alive = true;
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;



  constructor(private searchService: SearchServiceService, private getDataIndicador:GetDataIndicadorService,
              private archivosService: ArchivosService, private dialogService: NbDialogService,private breakpointService: NbMediaBreakpointsService,
    private themeService: NbThemeService) {
                
      this.breakpoints = this.breakpointService.getBreakpointsMap();
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
          $("#indicador").attr("placeholder", "Busca un indicador por su nombre...");
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

    this.options = ['Option 1', 'Option 2', 'Option 3'];

    for(let i=4; i<200;i++){
      let texto = 'Option ' + i
      this.options.push(texto)
    }


    this.inputFormControl = new FormControl();
    this.filteredControlOptions$ = this.inputFormControl.valueChanges
      .pipe(
        startWith(''),
        map(filterString => this.filter(filterString)),
      );

        */
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }


  private filter(value: string): string[] {
  
      const filterValue = value.toLowerCase();

      return this.indicadores_array.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
   


  }

  onModelChange(value: string) {
 
    this.filteredNgModelOptions$ = of(this.filter(value));

    this.value = value;
  }



  searchByName(){
    
    if(this.value){
      const payload = new HttpParams()
      .set('indicador',JSON.stringify(this.value))


  

      this.searchService.searchByName(payload).subscribe((resp:any)=>{
        this.indicadoresEncontrados = resp.result
      })
    }
    

  
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

  public closeDialog(){
    this.dialogref.close()
  }


}


