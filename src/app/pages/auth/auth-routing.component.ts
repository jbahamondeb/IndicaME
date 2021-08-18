import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*
import { EditCategoriaComponent } from './categoria/editCategoria.component';
import { EditDocumentoComponent } from './documento/editDocumento.component';

*/
import { AuthComponent } from './auth.component';

import { LoginComponent } from './login/login.component';
import { RecoverComponent } from './recoverPassword/recoverpassword.component';
import { RegisterComponent } from './register/register.component';

/*
import { EditIndicadorComponent } from './indicador/editIndicador.component';
import { EditInstitucionComponent } from './institucion/editInstitucion.component';


*/


const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [
    {
      path: 'login',
      component: LoginComponent,
    },
    {
      path: 'register',
      component: RegisterComponent
    },
    {
      path: 'recover',
      component: RecoverComponent
    }
  ]
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }

