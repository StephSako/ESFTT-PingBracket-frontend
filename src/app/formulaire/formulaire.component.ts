import { Component, OnInit } from '@angular/core';
import { TableauInterface } from '../Interface/Tableau';
import { TableauService } from '../Service/tableau.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss']
})
export class FormulaireComponent implements OnInit {

  tableaux: TableauInterface[];
  prenomControl = new FormControl('');
  nomControl = new FormControl('');
  tableauxControl = new FormControl('');

  constructor(private tableauService: TableauService) { }

  ngOnInit(): void {
    this.tableauService.getAll().subscribe(tableaux => this.tableaux = tableaux, error => console.log(error));
  }

  showAgeForm(): void {
    if (this.tableauxControl.value.find(tableau => tableau.nom === 'jeune')) {
      console.log(this.tableauxControl.value);
    }
  }
}
