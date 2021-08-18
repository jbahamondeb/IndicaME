import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { SearchServiceService } from '../../search/search-service.service';
import { GetDataIndicadorService } from '../../search/get-data-indicador.service';


import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'ngx-byothers2',
    templateUrl: './byothers2.component.html',
    styleUrls: ['./byothers2.component.scss']
})


export class ByOthers2Component implements OnInit {
    selectedFiltro = '1'
    
    filtros = [
        {
            texto: 'Por N° de búsquedas',
            id: 1
        },
        {
            texto: 'Por N° de indicadores aportados',
            id: 2
        }

    ]

    selectedPeriod = '1'



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


    id_seleccionada: number;

    periodo_seleccionado: number;
    
    order_seleccionado: number;
    order_seleccionado2: number;


    documentosEncontrados:any;
    p: number = 1;



    servicios_indicador: any;
    categoria_aportada: any;
    formatos_documento: any;


    private alive = true;
    breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
    breakpoints: any;

    constructor(private searchService: SearchServiceService,private getDataIndicador:GetDataIndicadorService,private breakpointService: NbMediaBreakpointsService,
    private themeService: NbThemeService) {
        this.id_seleccionada = 1;
        this.periodo_seleccionado = 1;
        this.order_seleccionado = 1

        this.order_seleccionado2 = 1;
    }   

    ngOnInit(): void {
        this.themeService.onMediaQueryChange()
        .pipe(takeWhile(() => this.alive))
        .subscribe(([oldValue, newValue]) => {
            this.breakpoint = newValue;
        });
        this.searchService.getnDocumentosByPeriod(this.periodo_seleccionado, this.order_seleccionado).subscribe((resp:any)=>{
            this.documentosEncontrados = resp.result;
        },(err:any)=>{
            
        })
    }
    filtroSeleccionado(event:any){
        this.id_seleccionada = event;
        this.documentosEncontrados = []
        if(this.id_seleccionada == 1){
            this.searchService.getnDocumentosByPeriod(this.periodo_seleccionado, this.order_seleccionado).subscribe((resp:any)=>{
                this.documentosEncontrados = resp.result;
            },(err:any)=>{
                
            })
        }else if(this.id_seleccionada == 2){
            this.searchService.getnAportesDocumento(this.order_seleccionado2).subscribe((resp:any)=>{
                this.documentosEncontrados = resp.result;
            },(err:any)=>{
    
            })
        }

    }

    periodoSeleccionated(event:any){
        this.periodo_seleccionado = event;

        this.searchService.getnDocumentosByPeriod(this.periodo_seleccionado, this.order_seleccionado).subscribe((resp:any)=>{
            this.documentosEncontrados = resp.result;
            console.log(this.documentosEncontrados)
        },(err:any)=>{
            
        })

    }

    orderSelectionated(event:any){
        this.order_seleccionado = event;

        
        if(this.id_seleccionada == 1){
            this.searchService.getnDocumentosByPeriod(this.periodo_seleccionado, this.order_seleccionado).subscribe((resp:any)=>{
                this.documentosEncontrados = resp.result;
            },(err:any)=>{
                
            })
        }
        
    }

    orderSelectionated2(event:any){
        this.order_seleccionado2 = event;

        this.searchService.getnAportesDocumento(this.order_seleccionado2).subscribe((resp:any)=>{
            this.documentosEncontrados = resp.result;
        },(err:any)=>{

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

}