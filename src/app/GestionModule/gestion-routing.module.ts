import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionComponent } from './gestion/gestion.component';
import { AuthGuardService } from '../auth-guard.service';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { ConfirmFormulaireComponent } from './confirm-formulaire/confirm-formulaire.component';

const routes: Routes = [
  { path: 'gestion', component: GestionComponent, canActivate: [AuthGuardService] },
  { path: 'formulaire', component: FormulaireComponent },
  { path: 'inscription_terminee', component: ConfirmFormulaireComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class GestionRoutingModule { }
