import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableauComponent } from './tableau/tableau.component';
import { GestionComponent } from './gestion/gestion.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { ConfirmFormulaireComponent } from './confirm-formulaire/confirm-formulaire.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'tableau/:tableau', component: TableauComponent, canActivate: [AuthGuardService] },
  { path: 'gestion', component: GestionComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'formulaire', component: FormulaireComponent },
  { path: 'inscription_terminee', component: ConfirmFormulaireComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    BrowserModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
