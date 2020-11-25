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
    type: null,
    classement: null,
    _id: null
  };

  constructor(@Inject(MAT_DIALOG_DATA) public joueurData: JoueurInterface) {
    this.joueur = joueurData;
  }

  isInvalid(): boolean {
    return (this.joueur.nom != null);
  }
}
