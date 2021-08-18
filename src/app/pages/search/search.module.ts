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
  NbTagModule,
  NbToggleModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import {SearchComponent} from './search.component'
import { SearchRoutingModule } from './search-routing.module';

import { BynameComponent } from './byname/byname/byname.component';

import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { ByfiltersComponent } from './byfilters/byfilters/byfilters.component';





import {MatExpansionModule} from '@angular/material/expansion';
import { AddFileComponent } from './addFile/add-file/add-file.component';


import {NgxPaginationModule} from 'ngx-pagination';


import { ByOthersComponent } from './byothers/byothers.component';


import { NgxSliderModule } from '@angular-slider/ngx-slider';
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
    NbStepperModule,
    
    FormsModule,
    NbFormFieldModule,
    SearchRoutingModule,
    ReactiveFormsModule,
    
    MatExpansionModule,
    NgxPaginationModule,
    NgxSliderModule,
    NbTagModule,
    NbToggleModule
  ],
  declarations: [
    SearchComponent,
    BynameComponent,
    ByfiltersComponent,
    AddFileComponent,
    ByOthersComponent
    
  ],
  providers: [

    
  ]
})
export class SearchModule { }
