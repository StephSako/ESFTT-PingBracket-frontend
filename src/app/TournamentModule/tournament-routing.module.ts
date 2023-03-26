import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableauComponent } from './tableau/tableau.component';
import { AuthGuardService } from '../auth-guard.service';

const routes: Routes = [
  {
    path: 'tableau/:tableau',
    component: TableauComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TournamentRoutingModule {}
