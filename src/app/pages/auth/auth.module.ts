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
  NbInputModule,
  NbAutocompleteModule,
  NbActionsModule,
  NbLayoutModule,
  NbAccordionModule,
  NbCheckboxModule,
  NbRadioModule,
  
  NbSpinnerModule,
  NbFormFieldModule,
  NbStepperModule,
  NbToggleModule,
  NbTagModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { AuthComponent } from './auth.component';


import { AuthRoutingModule } from './auth-routing.component';



import { FormsModule as ngFormsModule,ReactiveFormsModule } from '@angular/forms';


import {NgxPaginationModule} from 'ngx-pagination';



import {MatExpansionModule} from '@angular/material/expansion';


import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecoverComponent } from './recoverPassword/recoverpassword.component';
import { NgxCaptchaModule } from 'ngx-captcha';




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
    NbAutocompleteModule,
    NbProgressBarModule,
    NbInputModule,
    NbIconModule,
    NbActionsModule,
    NbLayoutModule,
    NbAccordionModule,
    NbCheckboxModule,
    NbRadioModule,
    
    ngFormsModule,
    NbFormFieldModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    
    MatExpansionModule,
    NgxPaginationModule,
    NbStepperModule,
    NbToggleModule,
    NbTagModule,
    NgxCaptchaModule,
    NbSpinnerModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    RecoverComponent
    
  ],
  providers: [

    
  ]
})
export class AuthModule { }
