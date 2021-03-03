import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/gestion', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./AuthModule/auth.modules').then(m => m.AuthModules) },
  { path: 'gestion', loadChildren: () => import('./GestionModule/gestion.modules').then(m => m.GestionModules) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
