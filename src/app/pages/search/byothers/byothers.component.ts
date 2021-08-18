import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { Order } from './order';

import { Options } from "@angular-slider/ngx-slider";

import { SearchServiceService } from '../search-service.service';
import { GetDataIndicadorService } from '../get-data-indicador.service';
import jwt_decode from 'jwt-decode';

@Component({
    selector: 'ngx-byothers',
    templateUrl: './byothers.component.html',
    styleUrls: ['./byothers.component.scss']
})

  
export class ByOthersComponent implements OnInit {
    selectedFiltro = '1'
    
    filtros = [
        {
            texto: 'Por N° de búsquedas',
            id: 1
        },
        {
            texto: 'Por Años',
            id: 2
        },
        {
            texto: 'Por N° de zonas',
            id: 3
        },
        {
            texto: 'Por N° de archivos CSV',
            id: 4
        }

    ]

    selectedPeriod = '1'
    selectedPeriod2 = '1'

    periodos = [


        {
            texto: 'Hoy',
            id: '1'
        },
        {
            texto: 'Última semana',
            id: '2'
        },
        {
            texto: 'Último mes',
            id: '3'
        },
        {
            texto: 'Último año',
            id: '4'
        },
        {
            texto: 'Todo el tiempo',
            id: '5'
        }
    ]

    selectedOrder = '1'
    selectedOrder2 = '1'
    selectedOrder3 = '1'

    orders = [
        {
            texto:'Mayor cantidad primero',
            id: '1'
        },
        {
            texto : 'Menor cantidad primero',
            id: '2'
        }
    ]
    

    mostrar: boolean = true;


    value: number = 40;

    highValue: number = 60;
    opcionesSlider: Options = {
      floor: 1950,
      ceil: 3000,
    };

    fecha_inicio: Date;
    fecha_fin: Date;

    id_seleccionada: number;

    periodo_seleccionado: number;
    periodo_seleccionado2: number;

    order_seleccionado: number;
    order_seleccionado2: number;
    order_seleccionado3: number;

    busquedas: any;

    indicadoresEncontrados:any;

    p: number = 1;



    texto_regiones : string;
    texto_provincias : string;
    texto_comunas :string;

    categorias_indicador: any;
    documentos_indicador: any;
    csv_indicador: any;
  
    mensaje: boolean = false;
    noEncontrado: boolean = false;

    downloadFileBool: boolean = false;

    constructor(private searchService: SearchServiceService,private getDataIndicador:GetDataIndicadorService) {
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
    
        this.value = Number(this.fecha_inicio.getFullYear())
        this.highValue = Number(this.fecha_fin.getFullYear())

        this.id_seleccionada = 1;

        this.periodo_seleccionado = 1;
        this.order_seleccionado = 1

        this.periodo_seleccionado2 = 1;
        this.order_seleccionado2 = 1;

        this.order_seleccionado3 = 1;
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
        this.searchService.getnIndicadoresByPeriod(this.periodo_seleccionado, this.order_seleccionado).subscribe((resp:any)=>{
            this.indicadoresEncontrados = resp.result;
        },(err:any)=>{

        })
    }

    filtroSeleccionado(event:any){
        this.mostrar = true;
        
        
        this.id_seleccionada = event;
        this.indicadoresEncontrados = []
        this.mensaje = false;
        if(this.id_seleccionada == 1){
            this.searchService.getnIndicadoresByPeriod(this.periodo_seleccionado, this.order_seleccionado).subscribe((resp:any)=>{
                this.indicadoresEncontrados = resp.result;
            },(err:any)=>{
                
            })
        }else if(this.id_seleccionada == 2){
            
        }else if(this.id_seleccionada == 3){
            this.searchService.getnIndicadoresByPeriod2(this.periodo_seleccionado2, this.order_seleccionado2).subscribe((resp:any)=>{
                this.indicadoresEncontrados = resp.result;
                console.log("hola")
            },(err:any)=>{
                
            })
        }else if(this.id_seleccionada == 4){
            this.searchService.getnCSV(this.order_seleccionado3).subscribe((resp:any)=>{
                this.indicadoresEncontrados = resp.result;
            },(err:any)=>{
    
            })
    
        }

        
        
        
    }

    periodoSeleccionated(event:any){
        
        this.periodo_seleccionado = event;

        this.searchService.getnIndicadoresByPeriod(this.periodo_seleccionado, this.order_seleccionado).subscribe((resp:any)=>{
            this.indicadoresEncontrados = resp.result;
        },(err:any)=>{
            
        })

    }

    periodoSeleccionated2(event:any){
        
        this.periodo_seleccionado2 = event;

        this.searchService.getnIndicadoresByPeriod2(this.periodo_seleccionado2, this.order_seleccionado2).subscribe((resp:any)=>{
            this.indicadoresEncontrados = resp.result;
        },(err:any)=>{

        })

    }
    orderSelectionated(event:any){
        this.order_seleccionado = event;

        
        if(this.id_seleccionada == 1){
            this.searchService.getnIndicadoresByPeriod(this.periodo_seleccionado, this.order_seleccionado).subscribe((resp:any)=>{
                this.indicadoresEncontrados = resp.result;
            },(err:any)=>{
                
            })
        }
        
    }

    orderSelectionated2(event:any){
        this.order_seleccionado2 = event;

        this.searchService.getnIndicadoresByPeriod2(this.periodo_seleccionado2, this.order_seleccionado2).subscribe((resp:any)=>{
            this.indicadoresEncontrados = resp.result;
        },(err:any)=>{

        })

       
        
    }

    orderSelectionated3(event:any){
        this.order_seleccionado3 = event;

        this.searchService.getnCSV(this.order_seleccionado3).subscribe((resp:any)=>{
            this.indicadoresEncontrados = resp.result;
        },(err:any)=>{

        })

       
        
    }
    filterByYears(){
        this.mensaje = false;
        this.noEncontrado = false;


        this.searchService.getIndicadoresByYears(this.value, this.highValue).subscribe((resp:any)=>{
            let cercano = resp.message
            
            
            if(cercano != undefined){
                if(cercano == 1){
                    this.mensaje = true
                    this.indicadoresEncontrados = resp.result;
                    console.log(this.indicadoresEncontrados)
                }
                
            }else if(cercano == undefined){
                
                this.indicadoresEncontrados = resp.result;
            }
            
        },(err:any)=>{

        })
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
}   