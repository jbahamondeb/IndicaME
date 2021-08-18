import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';

import { MENU_ITEMS2 } from './pages-menu';


@Component({
  selector: 'ngx-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['pages.component.scss'],

})
export class PagesComponent implements OnInit {

  menu = MENU_ITEMS;

  menu2 = MENU_ITEMS2

  adminMode: boolean;

  constructor(){

  }
  ngOnInit(): void {
      let token = localStorage.getItem('token')

      if(token){
        this.adminMode = true
      }else{
        this.adminMode = false;
      }
  }


}
