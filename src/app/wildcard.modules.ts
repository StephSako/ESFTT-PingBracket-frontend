import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ErrorPageComponent } from './error-page/error-page.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ErrorPageComponent],
  imports: [
    RouterModule.forChild([
      { path: '**', component: ErrorPageComponent },
      { path: 'error-page', component: ErrorPageComponent },
    ]),
    MatIconModule,
  ],
  exports: [RouterModule],
})
export class WildcardModules {}
