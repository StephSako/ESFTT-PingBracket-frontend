import { Component, OnInit } from '@angular/core';
import { TableauInterface } from '../Interface/Tableau';
import { TableauService } from '../Service/tableau.service';
import {FormControl} from '@angular/forms';
import {ParametresService} from '../Service/parametres.service';
import {ParametreInterface} from '../Interface/Parametre';

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

  parametres: ParametreInterface = {
    texte_debut: null,
    _id: null,
    date: null,
    titre: null,
    texte_fin: null
  };

  constructor(private tableauService: TableauService, private parametreService: ParametresService) { }

  ngOnInit(): void {
    this.tableauService.getAll().subscribe(tableaux => this.tableaux = tableaux, error => console.log(error));
    this.getParametres();
  }

  showAgeForm(): void {
    if (this.tableauxControl.value.find(tableau => tableau.nom === 'jeune')) {
      console.log(this.tableauxControl.value);
    }
  }

  getParametres(): void{
    this.parametreService.getParametres().subscribe(parametres => this.parametres = parametres);
  }
}
