import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
  NbTabsetModule,
  NbUserModule,
  NbIconModule,
  NbSelectModule,
  NbListModule,
  NbDatepickerModule,
  NbInputModule,
  NbFormFieldModule,

  NbAutocompleteModule,


  NbToggleModule,




   

    NbLayoutModule,
    NbAccordionModule

  
} from '@nebular/theme';


import {NbMomentDateModule} from '@nebular/moment'

import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { ECommerceComponent } from './e-commerce.component';

import { ChartModule } from 'angular2-chartjs';



import { CountryOrdersComponent } from './country-orders/country-orders.component';
import { MapAndGraphic } from './country-orders/mapAndGraphic/mapandgraphic.component';
import { CountryOrdersMapComponent } from './country-orders/map/country-orders-map.component';
import { CountryOrdersMapService } from './country-orders/map/country-orders-map.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CountryOrdersChartComponent } from './country-orders/chart/country-orders-chart.component';
import { CountryOrdersProvinciaMapComponent } from './country-orders/map/country-orders-provincia-map/country-orders-provincia-map.component';
import { CountryOrdersComunaMapComponent } from './country-orders/map/country-orders-comuna-map/country-orders-comuna-map.component';
import { GraficaIndicadoresCategoriaComponent } from './graficas/indicadoresCategorias/grafica-indicadores-categoria/grafica-indicadores-categoria.component';
import { GraficaIndicadoresAnyosComponent } from './graficas/indicadoresAnyos/grafica-indicadores-anyos/grafica-indicadores-anyos.component';
import { CountryOrdersProvinciaChartComponent } from './country-orders/chart/country-orders-provincia-chart/country-orders-provincia-chart/country-orders-provincia-chart.component';
import { CountryOrdersComunaChartComponent } from './country-orders/chart/country-orders-comuna-chart/country-orders-comuna-chart/country-orders-comuna-chart.component';


import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { AngularOpenlayersModule } from "ngx-openlayers";

import { FormsModule as ngFormsModule,ReactiveFormsModule } from '@angular/forms';




import { CountryOrdersMapComponent2 } from './country-orders/map2/country-orders-map2.component';


@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    NbListModule,
    ChartModule,
    NbProgressBarModule,
    NgxEchartsModule,
    NgxChartsModule,
    LeafletModule,
    NbDatepickerModule,
    NbInputModule,
    NbMomentDateModule,
    NbLayoutModule,
    NbFormFieldModule,
    NgxSliderModule,
    AngularOpenlayersModule,
    NbAutocompleteModule,
    ngFormsModule,
    ReactiveFormsModule,
    NbAccordionModule,
    NbToggleModule
  ],
  declarations: [
    ECommerceComponent,
    CountryOrdersComponent,
    CountryOrdersMapComponent,
    CountryOrdersChartComponent,
    CountryOrdersProvinciaMapComponent,
    CountryOrdersComunaMapComponent,
    GraficaIndicadoresCategoriaComponent,
    GraficaIndicadoresAnyosComponent,
    CountryOrdersProvinciaChartComponent,
    CountryOrdersComunaChartComponent,
    CountryOrdersMapComponent2,
    MapAndGraphic
  ],
  providers: [
    CountryOrdersMapService,
    
  ],
})
export class ECommerceModule { }
