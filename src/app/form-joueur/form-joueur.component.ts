import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JoueurInterface } from '../Interface/Joueur';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { TableauInterface } from '../Interface/Tableau';
import { TableauService } from '../Service/tableau.service';
import { JoueurService } from '../Service/joueur.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form-joueur',
  templateUrl: './form-joueur.component.html',
  styleUrls: ['./form-joueur.component.scss']
})
export class FormJoueurComponent implements OnInit {

  @Input() joueur: JoueurInterface = {
    nom: null,
    classement: null,
    age: null,
    _id: null,
    tableaux: null
  };
  @Input() otherPlayers: JoueurInterface[];
  @Input() createMode = false;
  tableaux: TableauInterface[];

  nomControl = new FormControl('');
  optionsListJoueurs: Observable<JoueurInterface[]>;
  showAutocomplete = false;

  constructor(private route: ActivatedRoute, private gestionService: TableauService, private joueurService: JoueurService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getAllTableaux();
      if (this.otherPlayers) {
        this.optionsListJoueurs = this.nomControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }
    });
  }

  getAllTableaux(): void{
    this.gestionService.getAll().subscribe(tableaux => this.tableaux = tableaux);
  }

  getJoueur(): void{
    this.joueurService.getPlayer(this.joueur._id).subscribe(joueur => this.joueur = joueur);
  }

  private _filter(value: string): JoueurInterface[] {
    if (value && this.otherPlayers != null){
      const filterValue = value.toLowerCase();
      return this.otherPlayers.filter(joueur => joueur.nom.toLowerCase().includes(filterValue));
    } else { return []; }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent): void {
    this.joueur.classement = this.otherPlayers.filter(joueur => joueur.nom === event.option.value)[0].classement;
  }

  typing(event): void{
    this.showAutocomplete = event && event.length > 0;
  }

  compareTableauWithOther(tableau1: TableauInterface, tableau2: TableauInterface): boolean {
    return tableau1 && tableau2 ? tableau1.nom === tableau2.nom : tableau1 === tableau2;
  }
}
