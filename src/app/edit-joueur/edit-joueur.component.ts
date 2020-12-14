import { Component, Inject } from '@angular/core';
import { JoueurInterface } from '../Interface/Joueur';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-joueur',
  templateUrl: './edit-joueur.component.html',
  styleUrls: ['./edit-joueur.component.scss']
})
export class EditJoueurComponent {

  joueur: JoueurInterface = {
    nom: null,
    classement: null,
    _id: null,
    tableaux: null
  };
  editModeInput = false;
  createModeInput = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.joueur = data.joueur;
    this.editModeInput = data.editMode;
    this.createModeInput = data.createMode;
  }

  isInvalid(): boolean {
    return (this.joueur.nom != null);
  }
}
