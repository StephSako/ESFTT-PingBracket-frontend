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
    age_minimum: null
  };
  formats = ['simple', 'double'];

  constructor() { }

  ngOnInit(): void { }

}
