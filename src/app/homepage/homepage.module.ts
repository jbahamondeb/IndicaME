import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { ThemeModule } from '../@theme/theme.module';

import { HomePageComponent } from './homepage.component';


import {
    NbButtonModule,
    NbCardModule,
    
  } from '@nebular/theme';

@NgModule({
    imports: [
        
        ThemeModule,
        CommonModule,
        FormsModule,
        RouterModule,
        NbCardModule,
        NbButtonModule,

      ],

    declarations: [
        HomePageComponent
    ],
})


export class HomePageModule {
}

