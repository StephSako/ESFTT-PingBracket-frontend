import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnauthGuardService } from '../unauth-guard.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [UnauthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
