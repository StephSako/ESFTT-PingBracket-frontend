import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { JoueurInterface } from '../Interface/Joueur';

@Component({
  selector: 'app-form-joueur',
  templateUrl: './form-joueur.component.html',
  styleUrls: ['./form-joueur.component.scss']
})
export class FormJoueurComponent implements OnInit {

  @Input() joueur: JoueurInterface = {
    nom: null,
    type: null,
    classement: null,
    id: null
  };

  types: string[] = ['Compétiteur', 'Loisir' ];

  public nomControl = new FormControl('', [Validators.required]);

  constructor() { }

  ngOnInit(): void {
  }

  getErrorMessageInput(): string {
    if (this.nomControl.hasError('required')) {
      return 'Nom du joueur obligatoire';
    }
  }

}
