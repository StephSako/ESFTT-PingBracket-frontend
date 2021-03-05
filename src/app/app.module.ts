import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TournamentModules } from './TournamentModule/tournament.modules';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { WildcardModules } from './wildcard.modules';
import { CoreModules } from './core.modules';
import { HttpClientModule } from '@angular/common/http';
import { FormulaireModules } from './FormulaireModule/formulaire.modules';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatSnackBarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TournamentModules,
    FormulaireModules,
    WildcardModules,
    CoreModules
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
