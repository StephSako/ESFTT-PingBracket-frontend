import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormulaireComponent } from './formulaire/formulaire.component';
import { ConfirmFormulaireComponent } from './confirm-formulaire/confirm-formulaire.component';

const routes: Routes = [
  { path: '', component: FormulaireComponent, pathMatch: 'full' },
  { path: 'submitted', component: ConfirmFormulaireComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class FormulaireRoutingModule { }
