import { Component, OnInit } from '@angular/core';
import { TableauInterface } from '../../Interface/Tableau';
import { TableauService } from '../../Service/tableau.service';
import { ParametresService } from '../../Service/parametres.service';
import { ParametreInterface } from '../../Interface/Parametre';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { BuffetInterface } from '../../Interface/Buffet';
import { JoueurInterface } from '../../Interface/Joueur';
import { JoueurService } from '../../Service/joueur.service';
import { BuffetService } from '../../Service/buffet.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import {PoulesService} from '../../Service/poules.service';
import {MatTableDataSource} from '@angular/material/table';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss']
})
export class FormulaireComponent implements OnInit {
  /* Champs du formulaire pour les joueurs */
  tableaux: TableauInterface[];
  spinnerShown: boolean;

  parametres: ParametreInterface = {
    texte_debut: null,
    _id: null,
    date: null,
    titre: null,
    texte_buffet: null,
    texte_fin: null,
    open: null
  };

  /* Paramètres de l'input avec les Chips */
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  buffet: BuffetInterface = {
    nb_plus_13_ans: 0,
    nb_moins_13_ans: 0,
    _id: null,
    plats: []
  };
  platsAlreadyCooked: string[];

  /* Dupliquer le formulaire pour un nouveau joueur */
  public joueurData: JoueurInterface = {
    tableaux: [],
    classement: null,
    nom: null,
    buffet: true,
    age: null,
    _id: null
  };
  public listeJoueurs: JoueurInterface[] = [];
  public dataSource = new MatTableDataSource<JoueurInterface>([]);

  constructor(private tableauService: TableauService, private parametreService: ParametresService, private joueurService: JoueurService,
              private buffetService: BuffetService, private router: Router, private snackBar: MatSnackBar,
              private notifyService: NotifyService, private pouleService: PoulesService, private titleService: Title) { }

  ngOnInit(): void {
    this.spinnerShown = false;
    this.getParametres();
    this.titleService.setTitle('Tournoi ESFTT - Formulaire');
  }

  getTableaux(): void{
    this.tableauService.getAllTableaux().subscribe(tableaux => this.tableaux = tableaux, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  getParametres(): void{
    this.parametreService.getParametres().subscribe(parametres => {
      this.parametres = parametres;
      if (this.parametres.open) {
        this.getTableaux();
        this.getPlatsAlreadyCooked();
      }
    }, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  getPlatsAlreadyCooked(): void{
    this.buffetService.platsAlreadyCooked().subscribe(plats => this.platsAlreadyCooked = plats, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) { this.buffet.plats.push(value.trim()); }
    if (input) { input.value = ''; }
  }

  remove(plat: string): void {
    const index = this.buffet.plats.indexOf(plat);
    if (index >= 0) { this.buffet.plats.splice(index, 1); }
  }

  addJoueur($item): void {
    this.joueurData = {
      tableaux: [],
      classement: null,
      nom: null,
      buffet: true,
      age: null,
      _id: null
    };
    this.listeJoueurs.push($item);
    this.dataSource.data = this.listeJoueurs;
  }

  removeItem($item): void {
    this.listeJoueurs.splice( this.listeJoueurs.indexOf($item), 1);
  }

  async submit() {
    this.spinnerShown = true;
    let errOf: string[] = [];
    let tabOf: any = [];

    // Enregistrement des données du buffet
    tabOf.push(this.buffetService.register(this.buffet));

    if (this.listeJoueurs.length > 0) {
      // Inscription des joueurs
      this.listeJoueurs.forEach(joueur => tabOf.push(this.joueurService.create(joueur.tableaux, joueur)));

      // Tableaux des joueurs souscris
      const tableauxSubscribed: TableauInterface[] = <TableauInterface[]>[...new Set(this.listeJoueurs.map(joueur => joueur.tableaux.filter(tableau => tableau.poules && tableau.format === 'simple')).reduce((acc, val) => acc.concat(val), []))];
      if (tableauxSubscribed.length > 0) tableauxSubscribed.forEach(tabSub => tabOf.push(this.pouleService.generatePoules(tabSub)));
    }

    for (let obs of tabOf){
      await obs().toPromise().then().catch(err => errOf.push(err));
    };

    this.spinnerShown = false;
    if (errOf.length > 0) this.notifyService.notifyUser(errOf.join(' - '), this.snackBar, 'error', 20000, 'OK');
    else this.router.navigateByUrl('/submitted');
  }

  disabledAddPlayer(joueurData: JoueurInterface): boolean {
    return !(joueurData.nom !== null && joueurData.nom !== '' && joueurData.tableaux.length > 0);
  }

  disabledSubmit(): boolean {
    return (this.listeJoueurs.length === 0) || this.spinnerShown;
  }

  platsAlreadyCookedEmpty(): boolean {
    return (this.platsAlreadyCooked ? this.platsAlreadyCooked.length === 0 : false);
  }

  clickable(tableau: TableauInterface, joueurAge: number): boolean {
    return tableau.age_minimum !== null && (joueurAge === null || joueurAge >= tableau.age_minimum);
  }

  typing(joueur: JoueurInterface): void {
    joueur.tableaux = joueur.tableaux.filter(tableau => !(joueur.age <= tableau.age_minimum && tableau.age_minimum !== null));
  }
}
