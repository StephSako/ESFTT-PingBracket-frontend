import { NgModule } from '@angular/core';
import { GestionAccountComponent } from './gestion-account/gestion-account.component';
import { GestionStockComponent } from './gestion-stock/gestion-stock.component';
import { FormStockComponent } from './form-stock/form-stock.component';
import { EditStockComponent } from './edit-stock/edit-stock.component';
import { EditJoueurComponent } from './edit-joueur/edit-joueur.component';
import { GestionComponent } from './gestion/gestion.component';
import { GestionJoueursComponent } from './gestion-joueurs/gestion-joueurs.component';
import { GestionTableauxComponent } from './gestion-tableaux/gestion-tableaux.component';
import { FormTableauComponent } from './form-tableau/form-tableau.component';
import { EditTableauComponent } from './edit-tableau/edit-tableau.component';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { ConfirmFormulaireComponent } from './confirm-formulaire/confirm-formulaire.component';
import { GestionFormulaireComponent } from './gestion-formulaire/gestion-formulaire.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { GestionRoutingModule } from './gestion-routing.module';
import { SharedModules } from '../SharedModule/shared.modules';

@NgModule({
  declarations: [
    GestionAccountComponent,
    GestionStockComponent,
    FormStockComponent,
    EditStockComponent,
    EditJoueurComponent,
    GestionComponent,
    GestionJoueursComponent,
    GestionTableauxComponent,
    FormTableauComponent,
    EditTableauComponent,
    FormulaireComponent,
    ConfirmFormulaireComponent,
    GestionFormulaireComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    MatDialogModule,
    MatTabsModule,
    MatChipsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    GestionRoutingModule,
    SharedModules
  ]
})
export class GestionModules {}
