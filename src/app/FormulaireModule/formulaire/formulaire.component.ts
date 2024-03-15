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
import { Dialog } from 'src/app/Interface/Dialog';
import { DialogComponent } from 'src/app/SharedModule/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss'],
})
export class FormulaireComponent implements OnInit {
  /* Champs du formulaire pour les joueurs */
  public tableaux: TableauInterface[] = [];
  public spinnerShown = false;

  public minParticipantsEnfantsBuffet = 0;
  public minParticipantsAdosAdultesBuffet = 0;

  public listeJoueursSubscribed: string[] = [];

  public parametres: ParametreInterface = {
    texte_debut: null,
    _id: null,
    date: null,
    titre: null,
    texte_buffet: null,
    texte_fin: null,
    consignes_tableaux: null,
    open: null,
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
    plats: [],
  };
  public platsAlreadyCooked: string[] = [];

  /* Dupliquer le formulaire pour un nouveau joueur */
  public joueurData: JoueurInterface = {
    tableaux: [],
    classement: null,
    nom: null,
    buffet: true,
    age: null,
    _id: null,
    pointage: false,
  };
  public listeJoueurs: JoueurInterface[] = [];
  public joueursParticipantsBuffet = new MatTableDataSource<JoueurInterface>(
    []
  );

  constructor(
    private tableauService: TableauService,
    private parametreService: ParametresService,
    private joueurService: JoueurService,
    private buffetService: BuffetService,
    public appService: AppService,
    private router: Router,
    private snackBar: MatSnackBar,
    private logsService: LogsService,
    private notifyService: NotifyService,
    private pouleService: PoulesService,
    private titleService: Title,
    private datepipe: DatePipe,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getParametres();
    this.titleService.setTitle('Tournoi ESFTT - Formulaire');
  }

  getTableaux(): void {
    this.tableauService.getAllTableaux().subscribe(
      (tableaux) =>
        (this.tableaux = tableaux.filter(
          (t) =>
            t.is_launched === this.appService.getTableauState().PointageState
        )),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  getPlayersAlreadySubscribed(): void {
    this.joueurService.getTableauPlayersNames().subscribe(
      (joueurs) => (this.listeJoueursSubscribed = joueurs),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  getParametres(): void {
    this.parametreService.getParametres().subscribe(
      (parametres) => {
        this.parametres = parametres;
        if (this.parametres.open) {
          this.getTableaux();
          this.getPlayersAlreadySubscribed();
          this.getPlatsAlreadyCooked();
        }
      },
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  getPlatsAlreadyCooked(): void {
    this.buffetService.platsAlreadyCooked().subscribe(
      (plats) => (this.platsAlreadyCooked = plats),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.buffet.plats.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  remove(plat: string): void {
    const index = this.buffet.plats.indexOf(plat);
    if (index >= 0) {
      this.buffet.plats.splice(index, 1);
    }
  }

  addJoueur(joueur: JoueurInterface): void {
    this.joueurData = {
      tableaux: [],
      classement: null,
      nom: null,
      buffet: true,
      age: null,
      _id: null,
      pointage: false,
    };
    this.listeJoueurs.push(joueur);
    this.joueursParticipantsBuffet.data = this.listeJoueurs;
    this.addParticipantBuffet(joueur);
    this.updateMinAllParticipantsBuffet();
  }

  removeItem(joueur: JoueurInterface): void {
    this.listeJoueurs.splice(this.listeJoueurs.indexOf(joueur), 1);
    this.joueursParticipantsBuffet.data = this.listeJoueurs;
    this.removeParticipantBuffet(joueur);
    this.updateMinAllParticipantsBuffet();
  }

  async submit(): Promise<void> {
    this.spinnerShown = true;
    const errOf: string[] = [];
    const tabOf: any = [];

    // Enregistrement des données du buffet
    tabOf.push(this.buffetService.register(this.buffet));

    if (this.listeJoueurs.length > 0) {
      // Inscription des joueurs
      this.listeJoueurs.forEach((joueur) => {
        tabOf.push(this.joueurService.create(joueur.tableaux, joueur));
      });

      // Tableaux des joueurs souscris
      const tableauxSubscribed = [
        ...new Set(
          this.listeJoueurs
            .map((joueur) =>
              joueur.tableaux.filter(
                (tableau) =>
                  tableau.poules &&
                  tableau.format === 'simple' &&
                  tableau.is_launched ===
                    this.appService.getTableauState().PointageState
              )
            )
            .reduce((acc, val) => acc.concat(val), [])
        ),
      ] as TableauInterface[];
      if (tableauxSubscribed.length > 0) {
        tableauxSubscribed.forEach((tabSub) =>
          tabOf.push(this.pouleService.generatePoules(tabSub))
        );
      }
    }

    const summary: string = this.getSubmitSummary();
    tabOf.push(this.logsService.addLogs(summary));

    for (const obs of tabOf) {
      await obs
        .toPromise()
        .then()
        .catch((err) => errOf.push(err.error));
    }

    this.spinnerShown = false;
    if (errOf.length > 0) {
      this.notifyService.notifyUser(
        errOf.join(' - '),
        this.snackBar,
        'error',
        'OK'
      );
    } else {
      this.router.navigate(['submitted'], {
        state: { summary: this.getSubmitSummary() },
      });
    }
  }

  getSubmitSummary(): string {
    let summary: string =
      '<p><i>Inscription le ' +
      this.datepipe.transform(new Date(), 'dd/MM/yyyy à HH:mm') +
      '</i><br>';
    summary +=
      '<h3 style="margin-bottom: 2px;"><b><u>Buffet :</u></b></h3><b>Nombre d\'enfants :</b> ' +
      this.buffet.enfant +
      "<br><b>Nombre d'ados/adultes :</b> " +
      this.buffet.ado_adulte +
      '<br><b>Plats préparés :</b> ' +
      (this.buffet.plats.length > 0
        ? this.buffet.plats.join(', ')
        : '<i>Aucun</i>') +
      '<br><br><h3 style="margin-bottom: 2px;"><b><u>Inscription des joueurs :</u></b></h3>';

    if (this.listeJoueurs.length > 0) {
      this.listeJoueurs.forEach((joueur) => {
        summary +=
          '<b style="color: #3f51b5">' +
          this.formatNom(joueur.nom) +
          '</b><br><b>Points mensuels :</b> ' +
          (joueur.classement || joueur.classement > 0
            ? joueur.classement
            : '/') +
          '<br><b>Âge :</b> ' +
          (joueur.age ? +joueur.age + ' ans' : '/') +
          '<br><b>Tableaux :</b> ' +
          joueur.tableaux
            .map(
              (t) =>
                '<span style="text-transform: capitalize">' + t.nom + '</span>'
            )
            .join(', ') +
          '<br><b>Buffet :</b> ' +
          (joueur.buffet ? 'Oui' : 'Non') +
          '<br><br>';
      });
    } else {
      summary += '<i>Aucun joueur inscrit</i>';
    }

    return summary + '</p>';
  }

  disabledAddPlayer(joueurData: JoueurInterface): boolean {
    return !(
      joueurData.nom !== null &&
      joueurData.nom !== '' &&
      joueurData.tableaux.length > 0
    );
  }

  listeJoueursHasInvalidPlayer(): JoueurInterface[] {
    return this.listeJoueurs.filter((j) => this.disabledAddPlayer(j));
  }

  disabledSubmit(): boolean {
    return (
      (this.listeJoueurs.length === 0 &&
        this.buffet.enfant === 0 &&
        this.buffet.ado_adulte === 0 &&
        this.buffet.plats.length === 0) ||
      this.spinnerShown ||
      this.isPlayerSubscribing() ||
      this.hasSameNamePlayers().length > 0 ||
      this.isAlreadySubscribed().length > 0 ||
      this.listeJoueursHasInvalidPlayer().length > 0
    );
  }

  platsAlreadyCookedEmpty(): boolean {
    return this.platsAlreadyCooked
      ? this.platsAlreadyCooked.length === 0
      : false;
  }

  clickable(tableau: TableauInterface, joueurAge: number): boolean {
    return (
      tableau.age_minimum !== null &&
      (joueurAge === null || joueurAge >= tableau.age_minimum)
    );
  }

  setAuthorizedTableaux(joueur: JoueurInterface): void {
    joueur.tableaux = joueur.tableaux.filter(
      (tableau) =>
        !(tableau.age_minimum !== null && joueur.age >= tableau.age_minimum)
    );
    this.updateMinAllParticipantsBuffet();
  }

  isPlayerSubscribing(): boolean {
    return !(
      this.joueurData.age === null &&
      (this.joueurData.nom === null || this.joueurData.nom === '') &&
      this.joueurData.tableaux.length === 0 &&
      this.joueurData.classement === null
    );
  }

  hasSameNamePlayers(): string[] {
    const sameNames: string[] = [];
    this.listeJoueurs.forEach((j_f: JoueurInterface) => {
      if (
        !this.hasNoName(j_f.nom) &&
        !sameNames.includes(this.formatNom(j_f.nom)) &&
        this.listeJoueurs.filter(
          (j) => this.formatNom(j.nom) === this.formatNom(j_f.nom)
        ).length > 1
      ) {
        sameNames.push(this.formatNom(j_f.nom));
      }
    });
    return sameNames;
  }

  isAlreadySubscribed(): string[] {
    const errorAlreadySubscribed: string[] = [];
    this.listeJoueurs.forEach((j_f: JoueurInterface) => {
      if (
        !this.hasNoName(j_f.nom) &&
        !errorAlreadySubscribed.includes(this.formatNom(j_f.nom)) &&
        this.listeJoueursSubscribed.filter(
          (j_nom) => this.formatNom(j_nom) === this.formatNom(j_f.nom)
        ).length > 0
      ) {
        errorAlreadySubscribed.push(this.formatNom(j_f.nom));
      }
    });
    return errorAlreadySubscribed;
  }

  isInSameNamePlayers(nom: string): boolean {
    return this.hasSameNamePlayers().includes(this.formatNom(nom));
  }

  isInAlreadySubscribedPlayers(nom: string): boolean {
    return this.isAlreadySubscribed().includes(this.formatNom(nom));
  }

  hasNoName(nom: string): boolean {
    return nom.trim() === '';
  }

  hasNoTableau(tableaux: TableauInterface[]): boolean {
    return tableaux.length === 0;
  }

  openConfirmModale(): void {
    const playerToDelete: Dialog = {
      id: 'confirm',
      action: 'Vérifiez les informations',
      text: this.getSubmitSummary(),
      action_button_text: 'Confirmer',
      h1_class: 'form_modale',
      close_button: 'Modifier',
    };

    this.dialog
      .open(DialogComponent, {
        width: 'auto',
        data: playerToDelete,
      })
      .afterClosed()
      .subscribe(
        (res) => {
          if (res) {
            this.submit().then();
          }
        },
        (err) => {
          this.notifyService.notifyUser(
            err.error,
            this.snackBar,
            'error',
            'OK'
          );
        }
      );
  }

  updateMinJoueursEnfantsBuffet(): void {
    this.minParticipantsEnfantsBuffet = this.listeJoueurs.filter(
      (j) => j.age && j.age < 14 && j.buffet
    ).length;

    if (this.buffet.enfant < this.minParticipantsEnfantsBuffet) {
      this.buffet.enfant = this.minParticipantsEnfantsBuffet;
    }
  }

  updateMinJoueursAdosAdultesBuffet(): void {
    this.minParticipantsAdosAdultesBuffet = this.listeJoueurs.filter(
      (j) => (j.age === null || j.age >= 14) && j.buffet
    ).length;

    if (this.buffet.ado_adulte < this.minParticipantsAdosAdultesBuffet) {
      this.buffet.ado_adulte = this.minParticipantsAdosAdultesBuffet;
    }
  }

  removeParticipantBuffet(joueur: JoueurInterface): void {
    if (joueur.age !== null && joueur.age < 14) {
      this.buffet.enfant--;
    } else if (joueur.age === null || joueur.age >= 14) {
      this.buffet.ado_adulte--;
    }
  }

  addParticipantBuffet(joueur: JoueurInterface): void {
    if (joueur.age !== null && joueur.age < 14) {
      this.buffet.enfant++;
    } else if (joueur.age === null || joueur.age >= 14) {
      this.buffet.ado_adulte++;
    }
  }

  updateMinAllParticipantsBuffet(): void {
    this.updateMinJoueursAdosAdultesBuffet();
    this.updateMinJoueursEnfantsBuffet();
  }

  changeSwitchBuffet(joueur: JoueurInterface): void {
    joueur.buffet = !joueur.buffet;
    if (!joueur.buffet) {
      this.removeParticipantBuffet(joueur);
    } else {
      this.addParticipantBuffet(joueur);
    }
    this.updateMinAllParticipantsBuffet();
  }

  checkAge(joueur: JoueurInterface): void {
    if (joueur.age) {
      if (joueur.age < 5) {
        joueur.age = 5;
      } else if (joueur.age > 17) {
        joueur.age = 17;
      }
    }
  }

  formatNom(nom: string): string {
    return nom
      .toUpperCase()
      .trim()
      .replace(/\s{2,}/g, ' ');
  }
}
