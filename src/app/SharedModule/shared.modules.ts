import { MatchComponent } from './match/match.component';
import { BracketComponent } from './bracket/bracket.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormJoueurComponent } from './form-joueur/form-joueur.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from './dialog/dialog.component';
import { NoSanitizePipe } from './no-sanitize.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { NgTournamentTreeModule } from 'ng-tournament-tree';
import { MatChipsModule } from '@angular/material/chips';
import { DialogPrintListComponent } from './dialog-print-list/dialog-print-list';
import { DialogPrintPouleComponent } from './dialog-print-poule/dialog-print-poule.component';

@NgModule({
  declarations: [
    FormJoueurComponent,
    BracketComponent,
    MatchComponent,
    DialogComponent,
    DialogPrintListComponent,
    DialogPrintPouleComponent,
    NoSanitizePipe,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    NgTournamentTreeModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatChipsModule,
  ],
  exports: [
    FormJoueurComponent,
    BracketComponent,
    MatchComponent,
    NoSanitizePipe,
  ],
})
export class SharedModules {}
