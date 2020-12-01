import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchComponent } from './match/match.component';
import { NgTournamentTreeModule } from 'ng-tournament-tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TableauComponent } from './tableau/tableau.component';
import { MatIconModule } from '@angular/material/icon';
import { ListPlayersComponent } from './list-players/list-players.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { EditJoueurComponent } from './edit-joueur/edit-joueur.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormJoueurComponent } from './form-joueur/form-joueur.component';
import { MatDialogModule } from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { PouleComponent } from './poule/poule.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { GestionComponent } from './gestion/gestion.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    TableauComponent,
    ListPlayersComponent,
    EditJoueurComponent,
    FormJoueurComponent,
    DialogComponent,
    PouleComponent,
    GestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgTournamentTreeModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    MatSnackBarModule,
    MatGridListModule,
    DragDropModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
