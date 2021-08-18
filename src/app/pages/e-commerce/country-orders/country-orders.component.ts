import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { CountryOrderData } from '../../../@core/data/country-order';


import {DatosGranularidadService} from './datos-granularidad.service'

@Component({
  selector: 'ngx-country-orders',
  templateUrl: './country-orders.component.html',
  styleUrls: ['./country-orders.component.scss'],

})
export class CountryOrdersComponent implements OnInit, OnDestroy {

  private alive = true;


  regionName = '';

  provinciaName = '';

  comunaName = '';

  countryName = '';
  countryName2 = '';
  countryName3 = '';
  countryData: number[] = [];

  regionData: any

  provinciaData: any

  comunaData: any;

  countryData2: number[] = [];
  countryData3: number[] = [];
  countriesCategories: string[];

  categories: any;
  categoriesNames: string[] = [];

  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;

  selected_tab  = 1;


  mapaRegiones = new Map();

  region:boolean = true;

  provincia:boolean = false;

  comuna: boolean = false;

  tabSeleccionada: any;


  constructor(private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private countryOrderService: CountryOrderData,
              private datosGranularidadService: DatosGranularidadService) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();

    this.tabSeleccionada = 'Regiones'

    
  }

  ngOnInit() {
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;

        
      });

    this.datosGranularidadService.getCategories()
      .pipe(takeWhile(() => this.alive))
      .subscribe((categories: any)=>{


          this.categories = categories.result;
          for(let i=0;i<this.categories.length;i++){
           
            this.categoriesNames.push(this.categories[i].nombre)
          }
          
          
      })
    this.countryOrderService.getCountriesCategories()
      .pipe(takeWhile(() => this.alive))
      .subscribe((countriesCategories) => {
        this.countriesCategories = countriesCategories;
        
      });
  }

  selectCountryById(regionName: string) {

    
    if(this.tabSeleccionada === 'Regiones'){
      if(typeof regionName == 'string'){
        this.regionName = regionName
        this.countryName = regionName;
    
        this.datosGranularidadService.getRegionesCategoriesData(regionName)
          .pipe(takeWhile(() => this.alive))
          .subscribe((regionData) => {
            this.regionData = regionData;
          });
        
    
    
        this.countryOrderService.getCountriesCategoriesData(regionName)
          .pipe(takeWhile(() => this.alive))
          .subscribe((countryData) => {
            this.countryData = countryData;
          });
      }
    }else if(this.tabSeleccionada === 'Provincias'){
      
      if(typeof regionName == 'string'){
        this.regionName = regionName;
        this.countryName = regionName;
        
  
        this.datosGranularidadService.getRegionesCategoriesData(regionName)
          .pipe(takeWhile(() => this.alive))
          .subscribe((provinciaData) => {
            this.provinciaData = provinciaData;
          });
        
  
        this.countryOrderService.getCountriesCategoriesData(regionName)
          .pipe(takeWhile(() => this.alive))
          .subscribe((countryData2) => {
            this.countryData2 = countryData2;
          });
      }
    }else{
      if(typeof regionName == 'string'){
        this.regionName = regionName;
        this.countryName = regionName
  
        this.countryOrderService.getCountriesCategoriesData(regionName)
          .pipe(takeWhile(() => this.alive))
          .subscribe((countryData3) => {
            this.countryData3 = countryData3;
          });
      }
    }
    
   
  }

  selectCountryById2(provinciaName: string) {

    if(typeof provinciaName == 'string'){
      this.provinciaName = provinciaName;
      this.countryName2 = provinciaName;
      

      this.datosGranularidadService.getRegionesCategoriesData(provinciaName)
        .pipe(takeWhile(() => this.alive))
        .subscribe((provinciaData) => {
          this.provinciaData = provinciaData;
        });
      

      this.countryOrderService.getCountriesCategoriesData(provinciaName)
        .pipe(takeWhile(() => this.alive))
        .subscribe((countryData2) => {
          this.countryData2 = countryData2;
        });
    }
    
  }
  selectCountryById3(comunaName: string) {

    if(typeof comunaName == 'string'){
      this.comunaName = comunaName;
      this.countryName3 = comunaName

      this.countryOrderService.getCountriesCategoriesData(comunaName)
        .pipe(takeWhile(() => this.alive))
        .subscribe((countryData3) => {
          this.countryData3 = countryData3;
        });
    }
    
  }

  ngOnDestroy() {
    this.alive = false;
  }

  changeTab(event:any){

    
    if(event.tabTitle == 'Regiones'){
      this.region = true
      this.provincia = false
      this.comuna = false
    }else if(event.tabTitle == 'Provincias'){
      this.region = false
      this.provincia = true
      this.comuna = false
    }else if(event.tabTitle == 'Comunas'){
      this.region = false;
      this.provincia = false;
      this.comuna = true;
    }
    window.dispatchEvent(new Event('resize'));
    
    this.tabSeleccionada = event.tabTitle
    
   
    
  }


}
