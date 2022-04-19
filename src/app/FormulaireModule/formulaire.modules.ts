import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormulaireRoutingModule } from './formulaire-routing.module';
import { MatCardModule } from '@angular/material/card';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { ConfirmFormulaireComponent } from './confirm-formulaire/confirm-formulaire.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NoSanitizePipe } from './no-sanitize.pipe';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    FormulaireComponent,
    ConfirmFormulaireComponent,
    NoSanitizePipe
  ],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormulaireRoutingModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    FlexLayoutModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatSlideToggleModule
  ]
})
export class FormulaireModules {}
