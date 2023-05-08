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

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss'],
})
export class FormulaireComponent implements OnInit {
  /* Champs du formulaire pour les joueurs */
  public tableaux: TableauInterface[];
  public spinnerShown = false;

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
  public dataSource = new MatTableDataSource<JoueurInterface>([]);

  constructor(
    private tableauService: TableauService,
    private parametreService: ParametresService,
    private joueurService: JoueurService,
    private buffetService: BuffetService,
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
        (this.tableaux = tableaux.filter((t) => t.is_launched === 0)),
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

  addJoueur($item): void {
    this.joueurData = {
      tableaux: [],
      classement: null,
      nom: null,
      buffet: true,
      age: null,
      _id: null,
      pointage: false,
    };
    this.listeJoueurs.push($item);
    this.dataSource.data = this.listeJoueurs;
  }

  removeItem($item): void {
    this.listeJoueurs.splice(this.listeJoueurs.indexOf($item), 1);
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
      const tableauxSubscribed = <TableauInterface[]>[
        ...new Set(
          this.listeJoueurs
            .map((joueur) =>
              joueur.tableaux.filter(
                (tableau) =>
                  tableau.poules &&
                  tableau.format === 'simple' &&
                  tableau.is_launched === 0
              )
            )
            .reduce((acc, val) => acc.concat(val), [])
        ),
      ];
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
          joueur.nom.toUpperCase() +
          '</b><br><b>Classement :</b> ' +
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

  disabledSubmit(): boolean {
    return (
      (this.listeJoueurs.length === 0 &&
        this.buffet.enfant === 0 &&
        this.buffet.ado_adulte === 0 &&
        this.buffet.plats.length === 0) ||
      this.spinnerShown ||
      this.isPlayerSubscribing()
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

  typing(joueur: JoueurInterface): void {
    joueur.tableaux = joueur.tableaux.filter(
      (tableau) =>
        !(joueur.age <= tableau.age_minimum && tableau.age_minimum !== null)
    );
  }

  isPlayerSubscribing(): boolean {
    return !(
      this.joueurData.age === null &&
      (this.joueurData.nom === null || this.joueurData.nom === '') &&
      this.joueurData.tableaux.length === 0 &&
      this.joueurData.classement === null
    );
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
}
