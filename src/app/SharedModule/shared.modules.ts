import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormJoueurComponent } from './form-joueur/form-joueur.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    FormJoueurComponent
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    FormJoueurComponent
  ]
})
export class SharedModules {}
