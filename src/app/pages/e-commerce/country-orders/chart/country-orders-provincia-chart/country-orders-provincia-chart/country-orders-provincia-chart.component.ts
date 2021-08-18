import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { LayoutService } from '../../../../../../@core/utils/layout.service';


import { CountryOrderData } from '../../../../../../@core/data/country-order';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'ngx-country-orders-provincia-chart',
  templateUrl: './country-orders-provincia-chart.component.html',
  styleUrls: ['./country-orders-provincia-chart.component.scss']
})
export class CountryOrdersProvinciaChartComponent  implements AfterViewInit, OnDestroy, OnChanges{
  @Input() countryName: string;
  @Input() data: number[];
  @Input() maxValue: number;
  @Input() labels: string[];


  private alive = true;

  option: any = {};
  echartsInstance;

  label: string;


  fecha1: any;
  fecha2: any;

  @ViewChild('autoInputUser') inputUser : ElementRef;

  constructor(private theme: NbThemeService,
              private layoutService: LayoutService,
              private countryOrder: CountryOrderData) { 
                
                
                this.layoutService.onSafeChangeLayoutSize()
                .pipe(
                  takeWhile(() => this.alive),
                )
                .subscribe(() => this.resizeChart());
              }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && !changes.data.isFirstChange()) {
      this.echartsInstance.setOption({
        series: [
          {
            data: this.data.map(v => this.maxValue),
          },
          {
            data: this.data,
          },
          {
            data: this.data,
          },
        ],
      });
    }
  }

  ngAfterViewInit() {
    
    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        
        const countriesTheme: any = config.variables.countryOrders;

        this.option = Object.assign({}, {
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            top: '3%',
            containLabel: true,
          },
          xAxis: {
            axisLabel: {
              color: countriesTheme.chartAxisTextColor,
              fontSize: countriesTheme.chartAxisFontSize,
            },
            axisLine: {
              lineStyle: {
                color: countriesTheme.chartAxisLineColor,
                width: '2',
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: countriesTheme.chartAxisSplitLine,
                width: '1',
              },
            },
          },
          yAxis: {
            data: this.labels,
            axisLabel: {
              color: countriesTheme.chartAxisTextColor,
              fontSize: 11,
            },
            axisLine: {
              lineStyle: {
                color: countriesTheme.chartAxisLineColor,
                width: '2',
              },
            },
            axisTick: {
              show: false,
            },
          },
          series: [
            { // For shadow
              type: 'bar',
              data: this.data.map(v => this.maxValue),
              cursor: 'default',
              itemStyle: {
                normal: {
                  color: countriesTheme.chartInnerLineColor,
                },
                opacity: 1,
              },
              barWidth: '40%',
              barGap: '-100%',
              barCategoryGap: '30%',
              animation: false,
              z: 1,
            },
            { // For bottom line
              type: 'bar',
              data: this.data,
              cursor: 'default',
              itemStyle: {
                normal: {
                  color: countriesTheme.chartLineBottomShadowColor,
                },
                opacity: 1,
              },
              barWidth: '40%',
              barGap: '-100%',
              barCategoryGap: '30%',
              z: 2,
            },
            {
              type: 'bar',
              barWidth: '35%',
              data: this.data,
              cursor: 'default',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                    offset: 0,
                    color: countriesTheme.chartGradientFrom,
                  }, {
                    offset: 1,
                    color: countriesTheme.chartGradientTo,
                  }]),
                },
              },
              z: 3,
            },
          ],
        });
      });
  }

  onChartInit(ec) {
    
    this.echartsInstance = ec;
  }

  resizeChart() {

    if (this.echartsInstance) {

      this.echartsInstance.resize();
    }
  } 

  onEventStartEndRange(event:any){
    
    
    if(event.start){
      this.fecha1 = event.start
      if(event.end){
        this.fecha2 = event.end;
        this.countryOrder.getCountriesCategoriesData('131')
        .pipe(takeWhile(() => this.alive))
        .subscribe((countryData) => {
          this.data = countryData;
          this.echartsInstance.setOption({
            series: [
              {
                data: this.data.map(v => this.maxValue),
              },
              {
                data: this.data,
              },
              {
                data: this.data,
              },
            ],
          });
        });
      }
    }
  }

  reset(){
    this.fecha1 = ''
    this.fecha2 = ''
    this.inputUser.nativeElement.value = ''; 
    this.countryOrder.getCountriesCategoriesData('131')
        .pipe(takeWhile(() => this.alive))
        .subscribe((countryData) => {
          this.data = countryData;
          this.echartsInstance.setOption({
            series: [
              {
                data: this.data.map(v => this.maxValue),
              },
              {
                data: this.data,
              },
              {
                data: this.data,
              },
            ],
          });
        });


  }

  ngOnDestroy() {
    this.alive = false;
  }

}
