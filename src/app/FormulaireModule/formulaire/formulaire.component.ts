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
import { PoulesService } from '../../Service/poules.service';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { LogsService } from 'src/app/Service/logs.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss']
})
export class FormulaireComponent implements OnInit {
  /* Champs du formulaire pour les joueurs */
  public tableaux: TableauInterface[];
  public spinnerShown: boolean = false;

  public parametres: ParametreInterface = {
    texte_debut: null,
    _id: null,
    date: null,
    titre: null,
    texte_buffet: null,
    texte_fin: null,
    consignes_tableaux: null,
    open: null
  };

  /* Paramètres de l'input avec les Chips */
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  public buffet: BuffetInterface = {
    ado_adulte: 0,
    enfant: 0,
    _id: null,
    plats: []
  };
  public platsAlreadyCooked: string[] = [];

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
              private buffetService: BuffetService, private router: Router, private snackBar: MatSnackBar, private logsService: LogsService,
              private notifyService: NotifyService, private pouleService: PoulesService, private titleService: Title,
              private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.getParametres();
    this.titleService.setTitle('Tournoi ESFTT - Formulaire');
  }

  getTableaux(): void{
    this.tableauService.getAllTableaux().subscribe(tableaux => this.tableaux = tableaux.filter(t => t.is_launched === 0), err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
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
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  getPlatsAlreadyCooked(): void{
    this.buffetService.platsAlreadyCooked().subscribe(plats => this.platsAlreadyCooked = plats, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) this.buffet.plats.push(value.trim());
    if (input) { input.value = ''; }
  }

  remove(plat: string): void {
    const index = this.buffet.plats.indexOf(plat);
    if (index >= 0) this.buffet.plats.splice(index, 1);
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

    // On construit le log
    let logMessage: string = 'Le ' + this.datepipe.transform(new Date(), 'dd/MM/yyyy à HH:mm') + ' :\n';
    logMessage += 'Buffet :\n  - Nombre d\'enfants : ' + this.buffet.enfant + '\n  - Nombre d\'ados/adultes : ' + this.buffet.ado_adulte + '\n  - Plats préparés : ' + (this.buffet.plats.length > 0 ? this.buffet.plats.join(', ') : '(aucun)') + '\n\n';

    // Enregistrement des données du buffet
    tabOf.push(this.buffetService.register(this.buffet));

    if (this.listeJoueurs.length > 0) {
      // Inscription des joueurs
      this.listeJoueurs.forEach(joueur => {
        logMessage += 'Nom : ' + joueur.nom.toUpperCase() + ' - Classement : ' + ((joueur.classement || joueur.classement > 0) ? joueur.classement + ' pts' : '/' ) + ' - Age : ' + (joueur.age ? + joueur.age + ' ans' : '/' ) + ' - Tableaux : [' + joueur.tableaux.map(t => t.nom.toUpperCase()).join(' , ') + '] - Buffet : ' + (joueur.buffet ? 'oui' : 'non') + '\n';
        tabOf.push(this.joueurService.create(joueur.tableaux, joueur));
      });

      // Tableaux des joueurs souscris
      const tableauxSubscribed: TableauInterface[] = <TableauInterface[]>[...new Set(this.listeJoueurs.map(joueur => joueur.tableaux.filter(tableau => tableau.poules && tableau.format === 'simple' && tableau.is_launched === 0)).reduce((acc, val) => acc.concat(val), []))];
      if (tableauxSubscribed.length > 0) tableauxSubscribed.forEach(tabSub => tabOf.push(this.pouleService.generatePoules(tabSub)));
    } else logMessage += '(pas de joueurs)';

    tabOf.push(this.logsService.addLogs(logMessage));

    for (let obs of tabOf){
      await obs.toPromise().then().catch(err => errOf.push(err.error));
    };

    this.spinnerShown = false;
    if (errOf.length > 0) this.notifyService.notifyUser(errOf.join(' - '), this.snackBar, 'error', 'OK');
    else this.router.navigate(['submitted'], { state: { summary: logMessage } });
  }

  disabledAddPlayer(joueurData: JoueurInterface): boolean {
    return !(joueurData.nom !== null && joueurData.nom !== '' && joueurData.tableaux.length > 0);
  }

  disabledSubmit(): boolean {
    return (this.listeJoueurs.length === 0 && this.buffet.enfant === 0 && this.buffet.ado_adulte === 0 && this.buffet.plats.length === 0) || this.spinnerShown || this.isPlayerSubscribing();
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

  isPlayerSubscribing(): boolean {
    return !(this.joueurData.age === null && (this.joueurData.nom === null || this.joueurData.nom === '') && this.joueurData.tableaux.length === 0 && this.joueurData.classement === null);
  }
}
