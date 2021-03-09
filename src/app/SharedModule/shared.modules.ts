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

@NgModule({
  declarations: [
    FormJoueurComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    FormJoueurComponent
  ]
})
export class SharedModules {}
