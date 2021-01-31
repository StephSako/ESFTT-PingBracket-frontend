import { Component, Input, OnInit } from '@angular/core';
import { TableauInterface } from '../Interface/Tableau';

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
  formats = ['simple', 'double'];
  categoriesAge = [
    { category: 'Poussin', age: 10},
    { category: 'Benjamin 1', age: 11},
    { category: 'Benjamin 2', age: 12},
    { category: 'Minime 1', age: 13},
    { category: 'Minime 2', age: 14},
    { category: 'Cadet 1', age: 15},
    { category: 'Cadet 2', age: 17}
  ];

  constructor() { }

  ngOnInit(): void { }

}
