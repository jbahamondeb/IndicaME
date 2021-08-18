import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCategoriaComponent } from './categoria/editCategoria.component';
import { EditDocumentoComponent } from './documento/editDocumento.component';


import { EditComponent } from './edit.component';

import { EditIndicadorComponent } from './indicador/editIndicador.component';
import { EditInstitucionComponent } from './institucion/editInstitucion.component';





const routes: Routes = [{
  path: '',
  component: EditComponent,
  children: [
    {
      path: 'indicador',
      component: EditIndicadorComponent,
    },
    {
      path: 'categoria',
      component: EditCategoriaComponent
    },
    {
      path: 'institucion',
      component: EditInstitucionComponent
    },
    {
      path: 'documento',
      component: EditDocumentoComponent
    }
  ]
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRoutingModule { }

