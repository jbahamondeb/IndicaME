import { OnInit ,AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import {GraficasIndicadoresService} from '../../graficas-indicadores.service'

import {Categoria} from './categoria'

import * as $ from 'jquery';

@Component({
  selector: 'ngx-grafica-indicadores-categoria',
  templateUrl: './grafica-indicadores-categoria.component.html',
  styleUrls: ['./grafica-indicadores-categoria.component.scss']
})
export class GraficaIndicadoresCategoriaComponent implements  OnInit, AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  categorias:  string[] = [];

  n_indicadores_categorias: string[] = [];

  array_categorias: Categoria[] = []

  colores: any;

  colores_usar: string[] = []

  count_colors: number = 0;

  constructor(private theme: NbThemeService, private graficasIndicadores: GraficasIndicadoresService) {

    
   }

  ngOnInit(){
    
  }

  ngAfterViewInit() {
    this.graficasIndicadores.getColors().subscribe((resp:any)=>{
      console.log(resp)
      this.colores = resp;
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

        this.graficasIndicadores.getNIndicadoresPerCategories().subscribe((resp:any)=>{
          
          for(let i=0;i<resp.result.length;i++){
            let new_categoria = new Categoria()
  
            new_categoria.name = resp.result[i].nombre
            new_categoria.value = resp.result[i].n_indicadores
  
            this.array_categorias.push(new_categoria)
            
            this.categorias.push(resp.result[i].nombre)

            if(i>this.colores.length){
              this.count_colors++
            }

            this.colores_usar.push(this.colores[i][this.count_colors])


          }

          console.log(this.colores_usar)
  
          const colors = config.variables;
          const echarts: any = config.variables.echarts;

          this.options = {
            backgroundColor: echarts.bg,
            color: this.colores_usar,
            tooltip: {
              trigger: 'item',
              position: 'inside',
              formatter: '{c} ({d}%)',
              
            },
            legend: {
              type: 'scroll',
              top: 10,
              data: this.categorias,
              textStyle: {
                color: echarts.textColor,
              },
            },
            series: [
              {
                name: 'Categoria',
                type: 'pie',
                radius: '70%',
                center: ['50%', '50%'],
                data:this.array_categorias,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: echarts.itemHoverShadowColor,
                  },
                },
                label: {
                  
                  normal: {
                    show: false,
                    textStyle: {
                      color: echarts.textColor,
                    },
                  },
                },
                labelLine: {
                  
                  normal: {
                    show: false,
                    lineStyle: {
                      color: echarts.axisLineColor,
                    },
                  },
                },
              },
            ],
          };

          
          /*
          if ($(window).width() < 3600 && $(window).width() > 1200) {
            console.log("3600")
            
            
            
          }else if($(window).width() < 1200 && $(window).width() > 992){
            console.log("1200")
          }else if($(window).width() < 992 && $(window).width() > 768){
            console.log("992")
          }else if($(window).width() < 768 && $(window).width() > 576){
            console.log("768")
          }else if($(window).width() < 576 && $(window).width() > 480){
            console.log("576")
          }else if($(window).width() < 480){
            console.log("480")
          }
          */

          

          

          
  
         
        })
  
        
      })
    },(err:any)=>{

    })
    
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
