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
  NbToggleModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { AddDataComponent } from './addData.component';


import { AddDataRoutingModule } from './addData-routing.module';




import { FormsModule as ngFormsModule,ReactiveFormsModule } from '@angular/forms';


import {NgxPaginationModule} from 'ngx-pagination';



import {MatExpansionModule} from '@angular/material/expansion';


import { AddIndicadorComponent } from './addIndicador/addIndicador.component';
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
    AddDataRoutingModule,
    ReactiveFormsModule,
    
    MatExpansionModule,
    NgxPaginationModule,
    NbStepperModule,
    NbToggleModule
  ],
  declarations: [
    AddDataComponent,
    AddIndicadorComponent
    
  ],
  providers: [

    
  ]
})
export class AddDataModule { }
