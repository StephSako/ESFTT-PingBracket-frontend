import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import {
  PariInterface,
  InfosParisJoueurInterface,
} from 'src/app/Interface/Pari';
import { PariableTableauInterface } from 'src/app/Interface/Tableau';
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
    id_prono_vainqueur: null,
    id_pronostiqueur: null,
    paris: [],
  };
  public tableauxGet = false;
  public listeJoueursParTableaux = [];
  public scoreTotal = 0;

  constructor(
    private readonly pariService: PariService,
    private readonly tableauService: TableauService,
    private titleService: Title,
    private notifyService: NotifyService,
    private readonly accountService: AccountService,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.pariService.scoresParTableauPhase = [];
  }

  ngOnInit(): void {
    this.titleService.setTitle('Tournoi ESFTT - Parier');

    if (this.isParieurLoggedIn()) {
      this.getParisAndBracket();
    }

    this.pariService.updateParisLoggIn.subscribe((ok: boolean) => {
      if (ok) {
        this.getParisAndBracket();
      }
    });

    this.tableauService.getPariables().subscribe(
      (tableauxPariables: PariableTableauInterface[]) => {
        this.tableauxPariables = tableauxPariables;
        this.tableauxGet = true;

        this.pariService.setScoreParTableau(this.tableauxPariables);
      },
      () => {
        this.tableauxGet = true;
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

    this.pariService.updateScorePariJoueur.subscribe((scoreGeneral: number) => {
      if (scoreGeneral) {
        this.scoreTotal = scoreGeneral;
      }
    });
  }

  getParisAndBracket(): void {
    this.pariService
      .getAllParisJoueur(this.accountService.getParieur()._id)
      .subscribe((infosParisJoueur: InfosParisJoueurInterface) => {
        this.infosParisJoueur = infosParisJoueur;
      });
  }

  getNomParieur(): string {
    return this.accountService.getParieur().nom;
  }

  getIdParieur(): string {
    return this.accountService.getParieur()._id;
  }

  logout(): void {
    this.accountService.logoutParieur();
  }

  isParieurLoggedIn(): boolean {
    return !!this.accountService.getParieur();
  }

  updateVainqueur(event: MatSelectChange): void {
    this.pariService
      .parierVainqueur(this.accountService.getParieur()._id, event.value)
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

  getNgModelVainqueur(): string | null {
    return this.infosParisJoueur.id_prono_vainqueur
      ? this.infosParisJoueur.id_prono_vainqueur._id
      : null;
  }
}
