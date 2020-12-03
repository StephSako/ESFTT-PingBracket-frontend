import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JoueurInterface } from '../Interface/Joueur';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';

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
  tableaux: string[] = ['open', 'double', 'famille', 'jeune'];

  public nomControl = new FormControl('');
  optionsListJoueurs: Observable<JoueurInterface[]>;
  showAutocomplete = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.optionsListJoueurs = this.nomControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
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
}
