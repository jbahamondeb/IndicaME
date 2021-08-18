import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {SearchComponent} from './search.component'
import { BynameComponent } from './byname/byname/byname.component';
import {ByfiltersComponent} from './byfilters/byfilters/byfilters.component'
import { ByOthersComponent } from './byothers/byothers.component';


const routes: Routes = [{
  path: '',
  component: SearchComponent,
  
  children: [
    {
    path: 'byname',
    component: BynameComponent,
    },
    {
      path: 'byfilters',
      component: ByfiltersComponent,
    },
    {
      path: 'byothers',
      component: ByOthersComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule { }

