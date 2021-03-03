import { NgModule } from '@angular/core';
import { MatchComponent } from './match/match.component';
import { TableauComponent } from './tableau/tableau.component';
import { ListPlayersComponent } from './list-players/list-players.component';
import { PouleComponent } from './poule/poule.component';
import { BracketComponent } from './bracket/bracket.component';
import { BinomeComponent } from './binome/binome.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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


@NgModule({
  declarations: [
    MatchComponent,
    TableauComponent,
    ListPlayersComponent,
    PouleComponent,
    BracketComponent,
    BinomeComponent
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
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatTabsModule,
    TournamentRoutingModule
  ]
})
export class TournamentModules {

}
