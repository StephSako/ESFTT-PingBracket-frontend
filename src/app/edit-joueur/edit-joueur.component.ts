import {Component, Inject, OnInit} from '@angular/core';
import { JoueurInterface } from '../Interface/Joueur';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import {TableauInterface} from '../Interface/Tableau';
import {TableauService} from '../Service/tableau.service';
import {Dialog} from '../Interface/Dialog';
import {DialogComponent} from '../dialog/dialog.component';
import {ActivatedRoute} from '@angular/router';
import {JoueurService} from '../Service/joueur.service';
import {PoulesService} from '../Service/poules.service';

@Component({
  selector: 'app-edit-joueur',
  templateUrl: './edit-joueur.component.html',
  styleUrls: ['./edit-joueur.component.scss']
})
export class EditJoueurComponent implements OnInit {

  reactiveForm = new FormGroup({
    nom: new FormControl(''),
    classement: new FormControl('')
  });
  tableaux: TableauInterface[];
  joueur: JoueurInterface = {
    nom: null,
    classement: null,
    _id: null,
    tableaux: null
  };
  createModeInput = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data, private route: ActivatedRoute, private gestionService: TableauService,
              private joueurService: JoueurService, public dialog: MatDialog, private pouleService: PoulesService) {
    this.joueur = data.joueur;
    this.createModeInput = data.createMode;
  }

  ngOnInit(): void {
    this.getAllTableaux();
  }

  isInvalid(): boolean {
    return (this.joueur.nom != null);
  }

  getAllTableaux(): void{
    this.gestionService.getAll().subscribe(tableaux => this.tableaux = tableaux);
  }

  generatePoules(tableau_id: string): void {
    this.pouleService.generatePoules(tableau_id).subscribe(() => {}, err => console.log(err));
  }

  getJoueur(): void{
    this.joueurService.getPlayer(this.joueur._id).subscribe(joueur => this.joueur = joueur);
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

  isInscrit(tableaux: TableauInterface[], tableau_id: string): boolean {
    return tableaux.some(tableau => tableau._id === tableau_id);
  }
}
