import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*
import { EditCategoriaComponent } from './categoria/editCategoria.component';
import { EditDocumentoComponent } from './documento/editDocumento.component';

*/
import { RequestComponent } from './request.component';
import { NewRequestComponent } from './newRequest/newrequest.component';



/*
import { EditIndicadorComponent } from './indicador/editIndicador.component';
import { EditInstitucionComponent } from './institucion/editInstitucion.component';


*/


const routes: Routes = [{
  path: '',
  component: RequestComponent,
  children: [
    {
      path: 'newrequests',
      component: NewRequestComponent,
    }
  ]
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoutingModule { }

