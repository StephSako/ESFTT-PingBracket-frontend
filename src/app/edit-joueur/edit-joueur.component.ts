import {Component, Inject, OnInit } from '@angular/core';
import { JoueurInterface } from '../Interface/Joueur';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { TableauInterface } from '../Interface/Tableau';
import { TableauService } from '../Service/tableau.service';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ActivatedRoute } from '@angular/router';
import { JoueurService } from '../Service/joueur.service';
import { PoulesService } from '../Service/poules.service';
import {toTitleCase} from 'codelyzer/util/utils';

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
    this.reactiveForm.setValue({
      nom: this.joueur.nom,
      classement: this.joueur.classement,
    });
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
      option: null,
      third_button_text: null,
      action_button_text: 'Désinscrire',
      third_button: false
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

  editPlayer(): void {
    const tableauxSimlesToRegenerate = this.joueur.tableaux.filter(tableau => tableau.format === 'simple');
    if (this.joueur.tableaux.length > 0 && (this.reactiveForm.get('classement').value !== this.joueur.classement)) {
      const tableauToDelete: Dialog = {
        id: this.joueur._id,
        action: 'Le classement ' + ((this.reactiveForm.get('nom').value !== this.joueur.nom) ?
          'et le nom on eté modifiés' : 'a été modifié') + '. Régénérer les poules ' +
          tableauxSimlesToRegenerate.map(tableau => tableau.nom[0].toUpperCase() + tableau.nom.slice(1)).join(', ') + ' ?',
        option: null,
        action_button_text: 'Modifier et régénérer',
        third_button_text: ((this.reactiveForm.get('nom').value !== this.joueur.nom) ? 'Modifier que le nom et ne pas régénérer' : null),
        third_button: this.reactiveForm.get('nom').value !== this.joueur.nom
      };

      this.dialog.open(DialogComponent, {
        width: '85%',
        data: tableauToDelete
      }).afterClosed().subscribe(id_action => {
        if (id_action) {
          if (id_action === true) {
            this.joueur.nom = this.reactiveForm.get('nom').value;
            this.joueurService.edit(this.joueur).subscribe(() => {}, err => console.error(err));
            this.reactiveForm.get('classement').setValue(this.joueur.classement);
          } // On change que le nom
          else if (id_action === this.joueur._id) {
            this.joueur.nom = this.reactiveForm.get('nom').value;
            this.joueur.classement = this.reactiveForm.get('classement').value;
            this.joueurService.edit(this.joueur).subscribe(() => {}, err => console.error(err));
            this.joueur.tableaux.forEach(tableau => this.generatePoules(tableau._id));
          } // On change tout le joueur
        }
      }, err => { console.error(err); });
    }
    this.joueur.nom = this.reactiveForm.get('nom').value;
    this.joueurService.edit(this.joueur).subscribe(() => {}, err => console.error(err));
  }

  isInscrit(tableaux: TableauInterface[], tableau_id: string): boolean {
    return tableaux.some(tableau => tableau._id === tableau_id);
  }
  isModified(): boolean {
    return ((this.reactiveForm.get('nom').value !== this.joueur.nom)
      || (this.reactiveForm.get('classement').value !== this.joueur.classement));
  }
}
