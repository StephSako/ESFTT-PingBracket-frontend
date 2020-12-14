import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JoueurInterface } from '../Interface/Joueur';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { TableauInterface } from '../Interface/Tableau';
import { GestionService } from '../Service/gestion.service';
import {Dialog} from '../Interface/Dialog';
import {DialogComponent} from '../dialog/dialog.component';
import {JoueurService} from '../Service/joueur.service';
import {MatDialog} from '@angular/material/dialog';
import {PoulesService} from '../Service/poules.service';

@Component({
  selector: 'app-form-joueur',
  templateUrl: './form-joueur.component.html',
  styleUrls: ['./form-joueur.component.scss']
})
export class FormJoueurComponent implements OnInit {

  @Input() joueur: JoueurInterface = {
    nom: null,
    classement: null,
    _id: null,
    tableaux: null
  };
  @Input() otherPlayers: JoueurInterface[];
  @Input() editMode = false;
  @Input() createMode = false;
  tableaux: TableauInterface[];

  public nomControl = new FormControl('');
  optionsListJoueurs: Observable<JoueurInterface[]>;
  showAutocomplete = false;

  constructor(private route: ActivatedRoute, private gestionService: GestionService, private joueurService: JoueurService,
              public dialog: MatDialog, private pouleService: PoulesService) { }

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

  isInscrit(tableaux: TableauInterface[], tableau_id: string): boolean {
    return tableaux.some(tableau => tableau._id === tableau_id);
  }

  generatePoules(tableau_id: string): void {
    this.pouleService.generatePoules(tableau_id).subscribe(() => {}, err => console.log(err));
  }


  subscribe(tableau: TableauInterface): void {
    this.joueurService.subscribe([tableau], this.joueur).subscribe(() => {
      this.getJoueur();
      this.generatePoules(tableau._id);
    }, err => console.error(err));
  }

  unsubscribe(tableau: TableauInterface): void {
    const tableauToDelete: Dialog = {
      id: tableau._id,
      action: 'Désinscrire le joueur du tableau ?',
      option: null
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: tableauToDelete
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau){
        this.joueurService.unsubscribe(tableau, this.joueur._id).subscribe(() => {
          this.getJoueur();
          this.generatePoules(tableau._id);
        }, err => { console.error(err); });
      }
    });
  }
}
