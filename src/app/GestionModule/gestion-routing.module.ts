import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionComponent } from './gestion/gestion.component';
import { AuthGuardService } from '../auth-guard.service';

const routes: Routes = [
  { path: '', component: GestionComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionRoutingModule {}
