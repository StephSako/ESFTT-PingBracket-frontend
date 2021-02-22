import { Component, Input, OnInit } from '@angular/core';
import { TableauInterface } from '../Interface/Tableau';
import { categoriesAge, formats } from '../options-tableaux';

@Component({
  selector: 'app-form-tableau',
  templateUrl: './form-tableau.component.html',
  styleUrls: ['./form-tableau.component.scss']
})
export class FormTableauComponent implements OnInit {

  @Input() tableau: TableauInterface = {
    nom: null,
    format: null,
    _id: null,
    poules: null,
    consolante: null,
    age_minimum: null,
    nbPoules: null
  };
  formats: string[] = [];
  categoriesAge: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.formats = formats;
    this.categoriesAge = categoriesAge;
  }

}
