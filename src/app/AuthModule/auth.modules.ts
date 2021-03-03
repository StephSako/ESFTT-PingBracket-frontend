import { NgModule } from '@angular/core';
import { FormAccountComponent } from './form-account/form-account.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    FormAccountComponent,
    LoginComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    FlexLayoutModule,
    AuthRoutingModule
  ]
})
export class AuthModules {

}
