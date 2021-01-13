import { Component, OnInit } from '@angular/core';
import { TableauInterface } from '../Interface/Tableau';
import { TableauService } from '../Service/tableau.service';
import { ParametresService } from '../Service/parametres.service';
import { ParametreInterface } from '../Interface/Parametre';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { BuffetInterface } from '../Interface/Buffet';
import { JoueurInterface } from '../Interface/Joueur';
import {JoueurService} from '../Service/joueur.service';
import {BuffetService} from '../Service/buffet.service';
import {Router} from '@angular/router';

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
    texte_buffet: null,
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
  platsAlreadyCooked: string[];

  /* Dupliquer le formulaire pour un nouveau joueur */
  public joueurData: JoueurInterface = {
    tableaux: [],
    classement: null,
    nom: null,
    age: null,
    _id: null
  };
  public listeJoueurs: JoueurInterface[] = [];

  constructor(private tableauService: TableauService, private parametreService: ParametresService, private joueurService: JoueurService,
              private buffetService: BuffetService, private router: Router) { }

  ngOnInit(): void {
    this.tableauService.getAll().subscribe(tableaux => this.tableaux = tableaux, error => console.log(error));
    this.getParametres();
    this.getPlatsAlreadyCooked();
  }

  getParametres(): void{
    this.parametreService.getParametres().subscribe(parametres => this.parametres = parametres);
  }

  getPlatsAlreadyCooked(): void{
    this.buffetService.platsAlreadyCooked().subscribe(plats => this.platsAlreadyCooked = plats);
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
      tableaux: [],
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
    // Inscription des joueurs
    if (this.listeJoueurs.length > 0) {
      this.listeJoueurs.forEach(joueur => this.joueurService.create(joueur.tableaux, joueur).subscribe(() => {}));
    }

    // Enregistrement des données du buffet
    if (!(this.buffet.plats.length === 0 && this.buffet.nb_moins_13_ans === 0 && this.buffet.nb_plus_13_ans === 0)){
      this.buffetService.register(this.buffet).subscribe(() => {});
    }
    this.router.navigateByUrl('/inscription_terminee').then(() => {});
  }

  disabledAddPlayer(joueurData: JoueurInterface): boolean {
    return !(joueurData.nom !== null && joueurData.nom !== '' && joueurData.tableaux.length > 0);
  }

  disabledSubmit(): boolean {
    return (this.listeJoueurs.length === 0 && this.buffet.plats.length === 0 && this.buffet.nb_moins_13_ans === 0
      && this.buffet.nb_plus_13_ans === 0);
  }

  platsAlreadyCookedEmpty(): boolean {
    return (this.platsAlreadyCooked ? this.platsAlreadyCooked.length === 0 : false);
  }

  clickable(tableau: TableauInterface, joueurAge: number): boolean {
    return tableau.age_minimum !== null && (joueurAge === null || joueurAge < tableau.age_minimum);
  }

  typing(joueur: JoueurInterface): void {
    joueur.tableaux = joueur.tableaux.filter(tableau => !(joueur.age <= tableau.age_minimum));
    console.log(joueur.tableaux, joueur.age);
  }
}
