import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'

@Component({
    selector: 'ngx-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
    animations:[
      trigger('fade', [
        transition('void => *', [style({ opacity: 0 }), animate('100ms', style({ opacity: 1 }))]),
        transition('* => void', [style({ opacity: 1 }), animate('100ms', style({ opacity: 0 }))]),
      ])
    ]
  })


export class HomePageComponent implements OnInit {
  current = 0;
  img_list = [
    //{ url: '../../assets/images/coropleticos3.gif', title: 'Mapas Coropléticos!'},
    { url: '../../assets/images/interactivos3.gif', title: 'Mapas Interactivos!'},
    { url: '../../assets/images/busqueda3.gif', title: 'Búsqueda'},
    { url: '../../assets/images/grafica1v3.gif', title: 'Gráficos de torta interactivos!'},
    { url: '../../assets/images/grafica2v3.gif', title: 'Gráficos comparativos!'}
  ];
    constructor(){

    }

    ngOnInit(): void {
      const el = document.getElementById('nb-global-spinner');
      if (el) {
        el.style['display'] = 'none';
      }
      setInterval(() => {
        this.current = ++this.current % this.img_list.length;
      }, 8000);
    }
}