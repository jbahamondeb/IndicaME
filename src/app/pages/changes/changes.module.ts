import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
  
  
  NbIconModule,
  
  NbListModule,
  

  NbLayoutModule,

  
  
  NbFormFieldModule,
  NbStepperModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';


import { ChangesComponent } from './changes.component';
import { ChangesRoutingModule } from './changes-routing.component';





import { FormsModule as ngFormsModule,ReactiveFormsModule } from '@angular/forms';

import { ChangeDataComponent } from './changeData/changedata.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    
    NbButtonModule,
    NbIconModule,
    
    
    NbListModule,
    
    NbProgressBarModule,
    
    NbIconModule,
    
    NbLayoutModule,
    
    
    
    
    ngFormsModule,
    NbFormFieldModule,
    ChangesRoutingModule,
    ReactiveFormsModule,
    
    
    
    NbStepperModule,
    Ng2SmartTableModule
    
    
  ],
  declarations: [
    ChangesComponent,
    ChangeDataComponent,
    
  ],
  providers: [

    
  ]
})
export class ChangesModule { }
