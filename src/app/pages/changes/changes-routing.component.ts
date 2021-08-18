import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangesComponent } from './changes.component';
import { ChangeDataComponent } from './changeData/changedata.component';






const routes: Routes = [{
  path: '',
  component: ChangesComponent,
  children: [
    {
      path: 'data',
      component: ChangeDataComponent,
    }
  ]
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangesRoutingModule { }

