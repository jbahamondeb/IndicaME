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
  
  
  NbFormFieldModule,
  NbStepperModule,
  NbToggleModule,
  NbTagModule,
  NbSpinnerModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { RequestComponent } from './request.component';

import { RequestRoutingModule } from './request-routing.component';


import { NewRequestComponent } from './newRequest/newrequest.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';


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
    NbSpinnerModule,
    

    NbFormFieldModule,
    RequestRoutingModule,

    NbStepperModule,
    NbToggleModule,
    NbTagModule,
    Ng2SmartTableModule
  ],
  declarations: [
    RequestComponent,
    NewRequestComponent,
    
    
  ],
  providers: [

    
  ]
})
export class RequestModule { }
