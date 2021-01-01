import { Component, OnInit } from '@angular/core';
import { TableauInterface } from '../Interface/Tableau';
import { TableauService } from '../Service/tableau.service';
import { ParametresService } from '../Service/parametres.service';
import { ParametreInterface } from '../Interface/Parametre';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { BuffetInterface } from '../Interface/Buffet';
import { JoueurInterface } from '../Interface/Joueur';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss']
})
export class FormulaireComponent implements OnInit {

  /* Champs du formulaire pour les joueurs */
  tableaux: TableauInterface[];

  parametres: ParametreInterface = {
    texte_debut: null,
    _id: null,
    date: null,
    titre: null,
    texte_fin: null
  };

  /* Paramètres de l'input avec les Chips */
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  buffet: BuffetInterface = {
    nb_plus_13_ans: 0,
    nb_moins_13_ans: 0,
    _id: null,
    plats: []
  };

  /* Dupliquer le forumulaire pour un nouveau joueur */
  public joueurData: JoueurInterface = {
    tableaux: null,
    classement: null,
    nom: null,
    age: null,
    _id: null
  };
  public listeJoueurs: JoueurInterface[] = [{
    tableaux: null,
    classement: 111,
    nom: 'Stephen',
    age: null,
    _id: null
  }, {
    tableaux: null,
    classement: 222,
    nom: 'Theo',
    age: null,
    _id: null
  }];

  constructor(private tableauService: TableauService, private parametreService: ParametresService) { }

  ngOnInit(): void {
    this.tableauService.getAll().subscribe(tableaux => this.tableaux = tableaux, error => console.log(error));
    this.getParametres();
  }

  getParametres(): void{
    this.parametreService.getParametres().subscribe(parametres => this.parametres = parametres);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) { this.buffet.plats.push(value.trim()); } // Add our fruit
    if (input) { input.value = ''; } // Reset the input value
  }

  remove(plat: string): void {
    const index = this.buffet.plats.indexOf(plat);
    if (index >= 0) { this.buffet.plats.splice(index, 1); }
  }

  addJoueur($item): void {
    this.joueurData = {
      tableaux: null,
      classement: null,
      nom: null,
      age: null,
      _id: null
    };
    this.listeJoueurs.push($item);
  }

  removeItem($item): void {
    this.listeJoueurs.splice( this.listeJoueurs.indexOf($item), 1);
  }

  submit(): void {
    console.log(this.buffet);
    console.log(this.listeJoueurs);
  }
}
