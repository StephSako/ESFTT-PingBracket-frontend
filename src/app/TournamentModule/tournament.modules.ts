import { NgModule } from '@angular/core';
import { MatchComponent } from './match/match.component';
import { TableauComponent } from './tableau/tableau.component';
import { ListPlayersComponent } from './list-players/list-players.component';
import { PouleComponent } from './poule/poule.component';
import { BracketComponent } from './bracket/bracket.component';
import { BinomeComponent } from './binome/binome.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgTournamentTreeModule } from 'ng-tournament-tree';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { TournamentRoutingModule } from './tournament-routing.module';
import { SharedModules } from '../SharedModule/shared.modules';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HandicapComponent } from './poule/handicap/handicap.component';


@NgModule({
  declarations: [
    MatchComponent,
    TableauComponent,
    ListPlayersComponent,
    PouleComponent,
    BracketComponent,
    BinomeComponent,
    HandicapComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    DragDropModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgTournamentTreeModule,
    NgTournamentTreeModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatTabsModule,
    FormsModule,
    TournamentRoutingModule,
    SharedModules
  ]
})
export class TournamentModules {}
