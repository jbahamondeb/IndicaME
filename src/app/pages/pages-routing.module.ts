import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


import { PagesComponent } from './pages.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';


import{CanActivateViaAuthGuard} from './activateGuard'



const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    
    {
      path: 'search',
      loadChildren: () => import('./search/search.module')
        .then(m => m.SearchModule),
    },
    {
      path: 'searchDocuments',
      loadChildren: () => import('./searchDocuments/searchDocuments.module')
        .then(m => m.SearchDocumentsModule),
    },
    {
      path: 'addData',
      canActivate:[CanActivateViaAuthGuard],
      loadChildren: () => import('./addData/addData.module')
        .then(m => m.AddDataModule),
        
    },
    {
      path: 'edit',
      canActivate:[CanActivateViaAuthGuard],
      loadChildren: () => import ('./edit/edit.module')
        .then(m => m.EditModule),
     
    },
    {
      path: 'auth',
      loadChildren: () => import ('./auth/auth.module')
        .then(m => m.AuthModule),
    },
    {
      path: 'request',
      loadChildren: () => import ('./request/request.module')
        .then(m => m.RequestModule),
    },
    {
      path:'changes',
      loadChildren: () => import ('./changes/changes.module')
        .then(m => m.ChangesModule),
    }
    ,
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    }
    
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
