import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { JoueurInterface } from '../Interface/Joueur';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-form-joueur',
  templateUrl: './form-joueur.component.html',
  styleUrls: ['./form-joueur.component.scss']
})
export class FormJoueurComponent implements OnInit {

  @Input() joueur: JoueurInterface = {
    nom: null,
    classement: null,
    _id: null
  };
  @Input() allPlayers: any[] = [];

  public nomControl = new FormControl('', [Validators.required]);
  optionsListJoueurs: Observable<JoueurInterface[]>;

  constructor() { }

  ngOnInit(): void {
    this.optionsListJoueurs = this.nomControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  getErrorMessageInput(): string {
    if (this.nomControl.hasError('required')) {
      return 'Nom du joueur obligatoire';
    }
  }

  private _filter(value: string): JoueurInterface[] {
    const filterValue = value.toLowerCase();
    return this.allPlayers.filter(option => option.nom.toLowerCase().includes(filterValue));
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent): void {
    this.joueur.classement = this.allPlayers.filter(joueur => joueur.nom === event.option.value)[0].classement;
  }

}
