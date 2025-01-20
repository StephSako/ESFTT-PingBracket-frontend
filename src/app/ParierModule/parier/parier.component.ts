import {
  PariVainqueurTableauResult,
  PronoVainqueur,
} from './../../Interface/Pari';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { AppService } from 'src/app/app.service';
import { DetailsParisComponent } from 'src/app/GestionModule/gestion-paris/details-paris/details-paris.component';
import { RoundInterface } from 'src/app/Interface/Bracket';
import { IdNomInterface } from 'src/app/Interface/IdNomInterface';
import {
  JoueurMatchInterface,
  MatchInterface,
  TableauMatchInterface,
} from 'src/app/Interface/Match';
import {
  PariInterface,
  InfosParisJoueurInterface,
  ResultatPariJoueur,
} from 'src/app/Interface/Pari';
import {
  PariableTableauInterface,
  TableauInterface,
} from 'src/app/Interface/Tableau';
import { AccountService } from 'src/app/Service/account.service';
import { NotifyService } from 'src/app/Service/notify.service';
import { PariService } from 'src/app/Service/pari.service';
import { TableauService } from 'src/app/Service/tableau.service';

@Component({
  selector: 'app-parier',
  templateUrl: './parier.component.html',
  styleUrls: ['./parier.component.scss'],
})
export class ParierComponent implements OnInit, OnDestroy {
  public tableauxPariables: PariableTableauInterface[] = [];
  public infosParisJoueur: InfosParisJoueurInterface = {
    _id: null,
    pronos_vainqueurs: [],
    id_pronostiqueur: null,
    paris: [],
  };
  public tableauxGet = false;
  public listeJoueursParTableaux = [];
  public resultatParisJoueur: ResultatPariJoueur = {
    score: 0,
    details: [],
    nom: null,
    parisVainqueursTableauxResults: [],
  };
  public tableauxMatches: TableauMatchInterface[] = [];

  constructor(
    private readonly pariService: PariService,
    private readonly tableauService: TableauService,
    private titleService: Title,
    private notifyService: NotifyService,
    private readonly accountService: AccountService,
    private snackBar: MatSnackBar,
    public appService: AppService,
    public dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.pariService.scoresParTableauPhase = [];
  }

  ngOnInit(): void {
    this.titleService.setTitle('Tournoi ESFTT - Parier');

    this.getParisAndBracket();

    this.tableauService.getPariables().subscribe(
      (tableauxPariables: PariableTableauInterface[]) => {
        this.tableauxPariables = tableauxPariables;
        this.tableauxGet = true;

        this.pariService.initScoreParTableau(this.tableauxPariables);
      },
      () => {
        this.tableauxGet = true;
      }
    );

    // Observables permettant la mise à jour des données en temps réèl
    this.pariService.updateParisLoggIn.subscribe((ok: boolean) => {
      if (ok) {
        this.getParisAndBracket();
      }
    });

    this.pariService.updateListeTableauxPariables.subscribe(
      (tableauxPariablesResponse: TableauInterface[]) => {
        if (tableauxPariablesResponse !== null) {
          this.tableauxPariables.forEach(
            (tableauPariable: PariableTableauInterface, index: number) => {
              const indexSearchTableau = tableauxPariablesResponse.findIndex(
                (tableauPariableResponse: TableauInterface) =>
                  tableauPariable.tableau._id === tableauPariableResponse._id
              );
              if (indexSearchTableau !== -1) {
                tableauPariable.tableau =
                  tableauxPariablesResponse[indexSearchTableau];
              } else {
                delete this.tableauxPariables[index];
              }
            }
          );

          this.tableauxPariables = this.tableauxPariables.filter(
            (tableaupariableToClean: PariableTableauInterface) =>
              !!tableaupariableToClean
          );
          this.pariService.initScoreParTableau(this.tableauxPariables);
        }
      }
    );

    this.pariService.updateInfoParisJoueur.subscribe(
      (infosParisJoueur: InfosParisJoueurInterface) => {
        if (infosParisJoueur) {
          this.infosParisJoueur = infosParisJoueur;
        }
      }
    );

    this.pariService.addPariToListeParisMatches.subscribe(
      (pariToAdd: PariInterface) => {
        if (pariToAdd) {
          this.infosParisJoueur.paris.push(pariToAdd);
          this.pariService.updateListeParisMatches.next(
            this.infosParisJoueur.paris
          );
        }
      }
    );

    this.pariService.deletePariToListeParisMatches.subscribe(
      (pariToDelete: PariInterface) => {
        if (pariToDelete) {
          this.infosParisJoueur.paris = this.infosParisJoueur.paris.filter(
            (pari: PariInterface) =>
              JSON.stringify(pari) !== JSON.stringify(pariToDelete)
          );
          this.pariService.updateListeParisMatches.next(
            this.infosParisJoueur.paris
          );
        }
      }
    );

    this.pariService.updateScorePariJoueur.subscribe(
      (resultatParisJoueur: ResultatPariJoueur) => {
        if (resultatParisJoueur) {
          this.resultatParisJoueur = resultatParisJoueur;
          this.resultatParisJoueur.nom = this.getNomParieur();
        }
      }
    );

    this.pariService.updateMatchesTableaux.subscribe(
      (resultatParisJoueur: TableauMatchInterface) => {
        let tableauMatches: TableauMatchInterface = this.tableauxMatches.find(
          (tableauMatch: TableauMatchInterface) =>
            tableauMatch?.tableauId === resultatParisJoueur.tableauId &&
            tableauMatch?.phase === resultatParisJoueur.phase
        );

        if (tableauMatches) {
          tableauMatches.match = resultatParisJoueur.match;
        } else {
          this.tableauxMatches.push(resultatParisJoueur);
        }
      }
    );
  }

  grandVainqueurPariable(tableau: TableauInterface, phase: string): boolean {
    // Tableaux sans poules dont les 1ers tours n'ont pas encore commencé (comme le tableau Double - Compétiteur)
    if (
      !tableau.poules &&
      tableau.is_launched === this.appService.getTableauState().BracketState
    ) {
      const tableauMatches: TableauMatchInterface = this.tableauxMatches.find(
        (tableauMatch: TableauMatchInterface) =>
          tableauMatch?.tableauId === tableau._id &&
          tableauMatch?.phase === phase
      );
      if (tableauMatches) {
        return (
          tableauMatches.match.filter((round: RoundInterface) => {
            return (
              round.matches[0].joueurs.length === 2 &&
              round.matches[0].joueurs.filter(
                (joueur: JoueurMatchInterface) => joueur.winner
              ).length > 0
            );
          }).length === 0
        );
      } else {
        return true;
      }
    }
    // Tableaux avec des poules avant que le bracket ne commence (comme le tableau Open)
    else if (
      tableau.poules &&
      tableau.is_launched === this.appService.getTableauState().PouleState
    ) {
      return true;
    } else {
      return false;
    }
  }

  getParisAndBracket(): void {
    if (this.isParieurLoggedIn()) {
      this.pariService
        .getAllParisJoueur(this.accountService.getParieur()._id)
        .subscribe((infosParisJoueur: InfosParisJoueurInterface) => {
          this.infosParisJoueur = infosParisJoueur;
        });
    }
  }

  getNomParieur(): string {
    return this.accountService.getParieur()?.nom;
  }

  getIdParieur(): string {
    return this.accountService.getParieur()?._id;
  }

  logout(): void {
    this.accountService.logoutParieur();
  }

  isParieurLoggedIn(): boolean {
    return !!this.accountService.getParieur();
  }

  updateVainqueurTableau(
    event: MatSelectChange,
    id_tableau: string,
    objectRef: string
  ): void {
    this.pariService
      .parierVainqueur(
        this.accountService.getParieur()._id,
        event.value,
        id_tableau,
        objectRef,
        !this.infosParisJoueur.pronos_vainqueurs.find(
          (pronoVainqueurTableau: PronoVainqueur) =>
            pronoVainqueurTableau.id_tableau._id === id_tableau
        )
      )
      .subscribe(
        (result) => {
          this.notifyService.notifyUser(
            result.message,
            this.snackBar,
            'success',
            'OK'
          );
        },
        (err) =>
          this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK')
      );
  }

  getPronoVainqueurTableau(
    id_tableau: string,
    listeParticipants: IdNomInterface[]
  ): IdNomInterface | null {
    const pronoVainqueurTableauSearch =
      this.infosParisJoueur.pronos_vainqueurs.find(
        (pronoVainqueurTableau: PronoVainqueur) =>
          pronoVainqueurTableau.id_tableau._id === id_tableau
      );
    return pronoVainqueurTableauSearch
      ? listeParticipants.find(
          (participant: IdNomInterface) =>
            participant._id === pronoVainqueurTableauSearch.id_gagnant._id
        )
      : null;
  }

  openDetails(): void {
    this.dialog.open(DetailsParisComponent, {
      width: '100%',
      data: {
        resultatPariJoueur: this.resultatParisJoueur,
      },
    });
  }

  isPariVainqueurTableauOK(id_tableau: string): PariVainqueurTableauResult {
    return this.resultatParisJoueur.parisVainqueursTableauxResults.find(
      (pariVainqueurTableauResult: PariVainqueurTableauResult) =>
        pariVainqueurTableauResult.id_tableau === id_tableau
    );
  }
}
