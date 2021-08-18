import { AfterViewInit, Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import {GraficasIndicadoresService} from '../../graficas-indicadores.service'


import {DatoGrafico} from './DatoGrafico'

import { Options } from "@angular-slider/ngx-slider";
@Component({
  selector: 'ngx-grafica-indicadores-anyos',
  templateUrl: './grafica-indicadores-anyos.component.html',
  styleUrls: ['./grafica-indicadores-anyos.component.scss']
})




export class GraficaIndicadoresAnyosComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;


  categorias: string[] = [];

  fecha_inicio: Date;
  fecha_fin: Date;

  array_years: string[] = [];

  datosGraficos: DatoGrafico[] = []

  value: number = 40;
  highValue: number = 60;
  opcionesSlider: Options = {
    floor: 1950,
    ceil: 3000,
  };

  echartsInstance:any;

  colors:any;
  echarts: any;


  colores: any;

  colores_usar: string[] = []

  count_colors: number = 0;
  constructor(private theme: NbThemeService, private graficasIndicadores: GraficasIndicadoresService) { 

    
    let anio_actual = new Date().getFullYear();
    let anio_pasado = anio_actual - 5;
    this.fecha_inicio = new Date(anio_pasado,0)
    this.fecha_fin = new Date(anio_actual,0)

    this.opcionesSlider.ceil = anio_actual

    this.value = Number(this.fecha_inicio.getFullYear())
    this.highValue = Number(this.fecha_fin.getFullYear())



    for(let i=this.fecha_inicio.getFullYear();i<=this.fecha_fin.getFullYear();i++){
 
      this.array_years.push(i.toString())
    }

    
  }



  ngAfterViewInit() {


    this.chargeDataGraphic()

    
    
  }

  chargeDataGraphic(){
    this.categorias = []
    this.colores_usar = []
    this.graficasIndicadores.getColors().subscribe((resp:any)=>{
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

        this.colores = resp;
        this.graficasIndicadores.getNIndicadoresPerYearAndCategories(this.value, this.highValue).subscribe((resp:any)=>{
          let respuesta = resp.result;

          let cantidad_anyos = this.array_years.length
          //let array_aux = []
          for(let i=0;i<respuesta.length;i=i+cantidad_anyos){
            // 
            this.categorias.push(respuesta[i].nombre)
            let array_data = []
            for(let j = i;j<i+cantidad_anyos;j++){
              array_data.push(respuesta[j].n_indicadores)
            }
            
            
            let new_data = new DatoGrafico()
            new_data.name = respuesta[i].nombre
            new_data.type = 'line'
            new_data.data = array_data
            this.datosGraficos.push(new_data)

             

            
          }

           
           
          
          
          for(let i=0;i<this.categorias.length;i++){
            if(i>this.colores.length){
              this.count_colors++
            }
            // 
            this.colores_usar.push(this.colores[i][this.count_colors])
          }
           

          
          
          /*
          
          let cantidad_anyos = this.array_years.length
          for(let i=0;i<respuesta.length;i++){
            this.categorias.push(respuesta[i].nombre)
            let array_data = []
            for(let j = 0;j<cantidad_anyos;j++){
              array_data.push(this.getRandomArbitrary(0,250))
            }
            let new_data = new DatoGrafico()
            new_data.name = respuesta[i].nombre
            new_data.type = 'line'
            new_data.data = array_data
  
            this.datosGraficos.push(new_data)

            if(i>this.colores.length){
              this.count_colors++
            }

            this.colores_usar.push(this.colores[i][this.count_colors])
          }*/

          let dif_years = this.highValue - this.value

          let interval

          if(dif_years > 40){
              interval = 10

          }else{
              if(dif_years <=40 && dif_years > 20){
                interval = 5
                  
              }else if(dif_years<=20 && dif_years > 15){
                interval = 2
              }else{
                interval = 0
              }
                
          }


          const colors: any = config.variables;
         const echarts: any = config.variables.echarts;
          
          this.colors = colors;
          this.echarts = echarts;
         this.options = {
          backgroundColor: echarts.bg,
          color: this.colores_usar,
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}',
          },
          legend: {
            type: 'scroll',
            top: 10,
  
            data: this.categorias,
            
  
          },
          xAxis: [
            {
              type: 'category',
              data: this.array_years,
              axisTick: {
                alignWithLabel: true,
              },
              axisLine: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
              axisLabel: {
                interval: interval,
                textStyle: {
                  color: echarts.textColor,
                },
              },
              
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
              splitLine: {
                lineStyle: {
                  color: echarts.splitLineColor,
                },
              },
              axisLabel: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
          ],
          grid: {
  
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '50',
            containLabel: true,
          },
          series: this.datosGraficos
        };
        
        
        })  
        
        
      })

    })
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  filterByYears(){

    this.array_years = []
    this.fecha_inicio = new Date(this.value,0)
    this.fecha_fin = new Date(this.highValue,0)

    for(let i=this.fecha_inicio.getFullYear();i<=this.fecha_fin.getFullYear();i++){
 
      this.array_years.push(i.toString())
    }

    

    this.datosGraficos = []

      this.chargeDataGraphic()
    /*
    let cantidad_anyos = this.array_years.length
    for(let i=0;i<this.categorias.length;i++){

      let array_data = []
      for(let j = 0;j<cantidad_anyos;j++){
        array_data.push(this.getRandomArbitrary(0,250))
      }
      let new_data = new DatoGrafico()
      new_data.name = this.categorias[i]
      new_data.type = 'line'
      new_data.data = array_data

      this.datosGraficos.push(new_data)
    }


    let dif_years = this.highValue - this.value

    let interval

    if(dif_years > 40){
      interval = 10

    }else{
      if(dif_years <=40 && dif_years > 20){
        interval = 5
        
      }else if(dif_years<=20 && dif_years > 15){
        interval = 2
      }else{
        interval = 0
      }
      
    }


    const colors: any = this.colors
       const echarts: any = this.echarts
    this.echartsInstance.setOption({
      backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight, colors.danger, colors.dangerLight, colors.primaryLight, colors.info],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}',
        },
        legend: {
          left: 'left',
          data: this.categorias,
          textStyle: {
            color: echarts.textColor,
          },
          itemGap: 2,

        },
        xAxis: [
          {
            type: 'category',
            data: this.array_years,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              interval: interval,
              textStyle: {
                color: echarts.textColor,
              },
            },
            
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        grid: {

          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '70',
          containLabel: true,
        },
        series: this.datosGraficos,
    });*/
    
  }
  

  
  onChartInit(ec) {

    this.echartsInstance = ec;
  }

}
