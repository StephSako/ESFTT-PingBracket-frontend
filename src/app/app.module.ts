import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgTournamentTreeModule } from 'ng-tournament-tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthGuardService } from './auth-guard.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorInterceptor } from './Service/auth-interceptor.interceptor';
import { AuthModules } from './AuthModule/auth.modules';
import { TournamentModules } from './TournamentModule/tournament.modules';
import { GestionModules } from './GestionModule/gestion.modules';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { WildcardModules } from './wildcard.modules';

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NgTournamentTreeModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AuthModules,
    TournamentModules,
    GestionModules,
    WildcardModules
  ],
  providers: [AuthGuardService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
