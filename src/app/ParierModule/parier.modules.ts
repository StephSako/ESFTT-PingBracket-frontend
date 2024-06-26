import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParierComponent } from './parier/parier.component';
import { ParierRoutingModule } from './parier-routing.modules';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModules } from '../SharedModule/shared.modules';
import { ConnexionParieurComponent } from './connexion-parieur/connexion-parieur.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ParierComponent, ConnexionParieurComponent],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatTabsModule,
    MatChipsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    ParierRoutingModule,
    SharedModules,
    AngularEditorModule,
  ],
})
export class ParierModule {}
