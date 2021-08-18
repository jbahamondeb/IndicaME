/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule
} from '@nebular/theme';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import {NbDateFnsDateModule} from '@nebular/date-fns'

import { NgxSliderModule } from '@angular-slider/ngx-slider';

import {
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
  NbTabsetModule,
  NbUserModule,
  NbIconModule,
  NbSelectModule,
  NbListModule,
  NbInputModule,
  NbAutocompleteModule,
  NbActionsModule,
  NbLayoutModule,
  NbAccordionModule,
  NbCheckboxModule,
  NbRadioModule,
  
  NbBadgeModule,
  NbFormFieldModule,
  NbStepperModule
} from '@nebular/theme';

import { HomePageComponent } from './homepage/homepage.component';



import {NgxPaginationModule} from 'ngx-pagination';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService } from './pages/auth/auth.service';

import { CanActivateViaAuthGuard } from './pages/activateGuard';


import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [AppComponent,HomePageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    NbDateFnsDateModule.forRoot({ 
      format: 'dd.MM.yyyy',
      parseOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
      formatOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
    
    }),
    NbDateFnsDateModule.forChild({ format: 'dd.MM.yyyy' }),
    FormsModule,
    NgxSliderModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbCardModule,
    NbProgressBarModule,
    NbTabsetModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbListModule,
    NbInputModule,
    NbAutocompleteModule,
    NbActionsModule,
    NbLayoutModule,
    NbAccordionModule,
    NbCheckboxModule,
    NbRadioModule,
    
    
    NbFormFieldModule,
    NbStepperModule,
    NgxPaginationModule,
    NgxCaptchaModule,
    NbBadgeModule
  ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true
    }, 
    CanActivateViaAuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
