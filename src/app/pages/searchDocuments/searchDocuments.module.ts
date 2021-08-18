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
  
  
  NbFormFieldModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import {SearchDocumentsComponent} from './searchDocuments.component'
import { BynameComponent } from './byname/byname/byname.component';
import { ByfiltersComponent } from './byfilters/byfilters/byfilters.component';

import { SearchDocumentsRoutingModule } from './searchDocuments-routing.module';


import { FormsModule as ngFormsModule,ReactiveFormsModule } from '@angular/forms';


import {NgxPaginationModule} from 'ngx-pagination';



import {MatExpansionModule} from '@angular/material/expansion';


import { ByOthers2Component } from './byothers/byothers2.component';
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
    SearchDocumentsRoutingModule,
    ReactiveFormsModule,
    
    MatExpansionModule,
    NgxPaginationModule
  ],
  declarations: [
    SearchDocumentsComponent,
    BynameComponent,
    ByfiltersComponent,
    ByOthers2Component
    
  ],
  providers: [

    
  ]
})
export class SearchDocumentsModule { }
