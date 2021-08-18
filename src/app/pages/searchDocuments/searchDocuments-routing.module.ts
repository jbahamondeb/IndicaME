import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {SearchDocumentsComponent} from './searchDocuments.component'

import { BynameComponent } from './byname/byname/byname.component';
import { ByfiltersComponent } from './byfilters/byfilters/byfilters.component'
import { ByOthers2Component } from './byothers/byothers2.component';



const routes: Routes = [{
  path: '',
  component: SearchDocumentsComponent,
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
      component: ByOthers2Component
    }
  ]
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchDocumentsRoutingModule { }

