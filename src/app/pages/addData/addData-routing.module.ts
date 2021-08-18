import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AddDataComponent } from './addData.component';

import { AddIndicadorComponent } from './addIndicador/addIndicador.component';




const routes: Routes = [{
  path: '',
  component: AddDataComponent,
  children: [
    {
      path: 'addIndicador',
      component: AddIndicadorComponent,
    }
  ]
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDataRoutingModule { }

