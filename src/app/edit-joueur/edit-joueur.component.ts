import { Component, Inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-edit-joueur',
  templateUrl: './edit-joueur.component.html',
  styleUrls: ['./edit-joueur.component.scss']
})

export class EditJoueurComponent implements OnInit {

  reactiveForm = new FormGroup({
    nom: new FormControl(''),
    classement: new FormControl(''),
    age: new FormControl('')
  });
  tableaux: TableauInterface[];
  joueur: JoueurInterface = {
    nom: null,
    age : null,
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
      age: this.joueur.age
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
    this.joueurService.create([tableau], this.joueur).subscribe(() => {
      this.joueur.tableaux.push(tableau);
      this.joueur.tableaux.sort((tableau1, tableau2) => {
        if (tableau1.nom < tableau2.nom) { return -1; }
        if (tableau1.nom > tableau2.nom) { return 1; }
        return 0;
      });
      this.generatePoules(tableau._id);
    }, err => console.error(err));
  }

  unsubscribe(tableau: TableauInterface): void {
    const tableauToDelete: Dialog = {
      id: tableau._id,
      action: 'Désinscrire le joueur du tableau ?',
      option: null,
      action_button_text: 'Désinscrire'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: tableauToDelete
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau){
        this.joueurService.unsubscribe(tableau, this.joueur._id).subscribe(() => {
          this.joueur.tableaux = this.joueur.tableaux.filter(tableauFilter => tableauFilter._id !== id_tableau );
          this.generatePoules(tableau._id);
        }, err => { console.error(err); });
      }
    });
  }

  editPlayer(): void {
    const classementEdited = this.joueur.tableaux.filter(tableau => tableau.format === 'simple').length > 0
      && (this.reactiveForm.get('classement').value !== this.joueur.classement);
    const ageEdited = this.joueur.tableaux.filter(tableau => (
      tableau.age_minimum !== null
      && (this.reactiveForm.get('age').value === null || this.reactiveForm.get('age').value >= tableau.age_minimum))).length > 0
      && (this.reactiveForm.get('age').value !== this.joueur.age);

    if (classementEdited) {
      const tableauToDelete: Dialog = {
        id: this.joueur._id,
        action: 'Le classement a été modifié.',
        option: 'Régénérer les poules des tableaux ' +
          this.joueur.tableaux.filter(tableau => tableau.format === 'simple').map(
            tableau => tableau.nom[0].toUpperCase() + tableau.nom.slice(1)).join(', ') + ' ?',
        action_button_text: 'Modifier le joueur et régénérer les poules'
      };

      this.dialog.open(DialogComponent, {
        width: '85%',
        data: tableauToDelete
      }).afterClosed().subscribe(id_action => {
        if (id_action === this.joueur._id) {
          this.joueur.nom = this.reactiveForm.get('nom').value;
          this.joueur.classement = this.reactiveForm.get('classement').value;
          this.joueur.age = this.reactiveForm.get('age').value;
          this.joueurService.edit(this.joueur).subscribe(() => {}, err => console.error(err));
          this.joueur.tableaux.forEach(tableau => this.generatePoules(tableau._id));
        }
      }, err => { console.error(err); });
    }
    if (ageEdited) {
      const tableauToDelete: Dialog = {
        id: this.joueur._id,
        action: 'L\'âge a été modifié.',
        option: 'Désinscrire le joueur et régénérer les poules des tableaux ' + this.joueur.tableaux.filter(
          tableau => tableau.age_minimum !== null).map(tableau => tableau.nom[0].toUpperCase() + tableau.nom.slice(1)).join(', ') + ' ?',
        action_button_text: 'Modifier le joueur et régénérer les poules'
      };

      this.dialog.open(DialogComponent, {
        width: '85%',
        data: tableauToDelete
      }).afterClosed().subscribe(id_action => {
        if (id_action === this.joueur._id) {
          this.joueur.nom = this.reactiveForm.get('nom').value;
          this.joueur.classement = this.reactiveForm.get('classement').value;
          this.joueur.age = this.reactiveForm.get('age').value;
          this.joueurService.edit(this.joueur).subscribe(() => {}, err => console.error(err));
          this.joueur.tableaux.filter(tableau => (tableau.age_minimum !== null
            && (this.reactiveForm.get('age').value === null || this.reactiveForm.get('age').value >= tableau.age_minimum)))
            .forEach(tableau => {
            this.joueurService.unsubscribe(tableau, this.joueur._id).subscribe(() => {
              this.joueur.tableaux = this.joueur.tableaux.filter(value => !this.joueur.tableaux.filter(tableauFiltered => (
                tableauFiltered.age_minimum !== null && (this.reactiveForm.get('age').value === null || this.reactiveForm.get('age').value
                >= tableauFiltered.age_minimum))).includes(value));
              this.generatePoules(tableau._id);
            }, err => { console.error(err); });
          });
        }
      }, err => { console.error(err); });
    } else if (!ageEdited && !classementEdited) {
      this.joueur.nom = this.reactiveForm.get('nom').value;
      this.joueur.classement = this.reactiveForm.get('classement').value;
      this.joueur.age = this.reactiveForm.get('age').value;
      this.joueurService.edit(this.joueur).subscribe(() => {}, err => console.error(err));
    }
  }

  isInscrit(tableaux: TableauInterface[], tableau_id: string): boolean {
    return tableaux.some(tableau => tableau._id === tableau_id);
  }

  isModified(): boolean {
    return ((this.reactiveForm.get('nom').value !== this.joueur.nom) || this.classementModifying() || this.ageModifying());
  }

  classementModifying(): boolean {
    return this.reactiveForm.get('classement').value !== this.joueur.classement;
  }

  ageModifying(): boolean {
    return this.reactiveForm.get('age').value !== this.joueur.age;
  }

  enabled(tableau: TableauInterface): boolean {
    return (tableau.age_minimum !== null && this.joueur.age !== null && this.joueur.age < tableau.age_minimum)
      || tableau.age_minimum === null;
  }

  errorAgeJoueur(tableau: TableauInterface): string {
    return (this.joueur.age === null ? 'L\'âge du joueur est requis' : 'Le joueur doit avoir moins de ' + tableau.age_minimum + ' ans');
  }
}
