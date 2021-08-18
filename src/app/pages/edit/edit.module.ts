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
  NbTagModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { EditComponent } from './edit.component';

import { EditRoutingModule } from './edit-routing.component'




import { FormsModule as ngFormsModule,ReactiveFormsModule } from '@angular/forms';


import {NgxPaginationModule} from 'ngx-pagination';



import {MatExpansionModule} from '@angular/material/expansion';




import { EditIndicadorComponent } from './indicador/editIndicador.component';
import { EditCategoriaComponent } from './categoria/editCategoria.component';
import { EditDocumentoComponent } from './documento/editDocumento.component';
import { EditInstitucionComponent } from './institucion/editInstitucion.component';
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
    EditRoutingModule,
    ReactiveFormsModule,
    
    MatExpansionModule,
    NgxPaginationModule,
    NbStepperModule,
    NbToggleModule,
    NbTagModule
  ],
  declarations: [
    EditComponent,
    EditIndicadorComponent,
    EditCategoriaComponent,
    EditDocumentoComponent,
    EditInstitucionComponent
    
  ],
  providers: [

    
  ]
})
export class EditModule { }
