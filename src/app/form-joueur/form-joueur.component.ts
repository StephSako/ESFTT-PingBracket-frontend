import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JoueurInterface } from '../Interface/Joueur';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { TableauInterface } from '../Interface/Tableau';
import { TableauService } from '../Service/tableau.service';
import { JoueurService } from '../Service/joueur.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../Service/notify.service';

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
  @Input() ageMinimumRequis = 0;
  tableaux: TableauInterface[];

  joueurControl = new FormControl('');
  optionsListJoueurs: Observable<JoueurInterface[]>;
  showAutocomplete = false;

  constructor(private route: ActivatedRoute, private gestionService: TableauService, private joueurService: JoueurService,
              public dialog: MatDialog, private snackBar: MatSnackBar, private notifyService: NotifyService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getAllTableaux();
      if (this.otherPlayers) {
        this.optionsListJoueurs = this.joueurControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }
    });
  }

  _filter(value: string): JoueurInterface[] {
    if (value && this.otherPlayers != null){
      const filterValue = value.toLowerCase();
      return this.otherPlayers.filter(joueur => joueur.nom.toLowerCase().includes(filterValue)
        && (this.ageMinimumRequis !== null ? (joueur.age !== null && joueur.age < this.ageMinimumRequis) : true));
    } else { return []; }
  }

  getAllTableaux(): void{
    this.gestionService.getAll().subscribe(tableaux => this.tableaux = tableaux, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  getJoueur(): void{
    this.joueurService.getPlayer(this.joueur._id).subscribe(joueur => this.joueur = joueur, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  typingAutocomplete(event): void{
    this.showAutocomplete = event && event.length > 0;
  }

  typingAge(): void {
    this.joueur.tableaux = this.joueur.tableaux.filter(tableau =>
      !(this.joueur.age <= tableau.age_minimum && tableau.age_minimum !== null));
  }

  compareTableauWithOther(tableau1: TableauInterface, tableau2: TableauInterface): boolean {
    return tableau1 && tableau2 ? tableau1.nom === tableau2.nom : tableau1 === tableau2;
  }

  clickable(tableau: TableauInterface): boolean {
    return tableau.age_minimum !== null && (this.joueur.age === null || this.joueur.age < tableau.age_minimum);
  }
}
