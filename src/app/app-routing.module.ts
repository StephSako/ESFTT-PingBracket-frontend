import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableauComponent } from './tableau/tableau.component';
import { GestionComponent } from './gestion/gestion.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'tableau/:tableau', component: TableauComponent },
  { path: 'gestion', component: GestionComponent }
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
