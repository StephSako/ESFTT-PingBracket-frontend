import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchComponent } from './match/match.component';
import { NgTournamentTreeModule } from 'ng-tournament-tree';

@NgModule({
  declarations: [
    AppComponent,
    MatchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgTournamentTreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
