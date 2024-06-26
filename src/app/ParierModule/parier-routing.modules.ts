import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParierComponent } from './parier/parier.component';

const routes: Routes = [
  {
    path: '',
    component: ParierComponent,
    // , canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParierRoutingModule {}
