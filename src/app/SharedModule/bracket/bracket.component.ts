import { AppService } from './../../app.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { BracketService } from '../../Service/bracket.service';
import { MatDialog } from '@angular/material/dialog';
import { TableauInterface } from '../../Interface/Tableau';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import { BracketInterface } from 'src/app/Interface/Bracket';
import { TableauState } from 'src/app/SharedModule/TableauState.enum';
import { InfosParisJoueurInterface } from 'src/app/Interface/Pari';
import { ResponseGetBracket } from 'src/app/Interface/ResponseGetBracket';
import { AccountService } from 'src/app/Service/account.service';
import { PariService } from 'src/app/Service/pari.service';

@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss'],
})
export class BracketComponent implements OnInit, OnDestroy {
  @Input() isPari = false;
  @Input() infosParisJoueur: InfosParisJoueurInterface = {
    _id: null,
    id_prono_vainqueur: null,
    id_pronostiqueur: null,
    paris: [],
  };
  @Input() phase: string;
  @Input() tableau: TableauInterface = {
    _id: null,
    nom: null,
    poules: null,
    format: null,
    consolante: null,
    maxNumberPlayers: null,
    age_minimum: null,
    is_launched: null,
    nbPoules: null,
    handicap: null,
    palierQualifies: null,
    palierConsolantes: null,
    hasChapeau: null,
    type_licence: null,
    pariable: null,
    consolantePariable: null,
    ptsGagnesParisWB: null,
    ptsPerdusParisWB: null,
    ptsGagnesParisLB: null,
    ptsPerdusParisLB: null,
  };
  spinnerShown: boolean;
  idTableau: string;
  public bracket: BracketInterface;
  private intervalUpdateMatches = null;

  constructor(
    private bracketService: BracketService,
    private appService: AppService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private accountService: AccountService,
    private notifyService: NotifyService,
    private readonly pariService: PariService
  ) {}

  ngOnDestroy(): void {
    this.isPari = false;
    clearInterval(this.intervalUpdateMatches);
  }

  ngOnInit(): void {
    this.spinnerShown = false;
    this.idTableau = this.tableau._id;
    this.getBracket();

    if (this.isPari) {
      this.intervalUpdateMatches = setInterval(() => {
        this.spinnerShown = true;
        this.getBracket();
      }, 5000);
    }
  }

  generateBracket(): void {
    const accountToDelete: Dialog = {
      id: 'true',
      action: 'Régénérer le tableau ?',
      option: null,
      action_button_text: 'Régénérer',
    };

    this.dialog
      .open(DialogComponent, {
        width: '45%',
        data: accountToDelete,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value) {
          this.spinnerShown = true;
          this.bracketService
            .generateBracket(
              this.tableau._id,
              this.tableau.format,
              this.phase,
              this.tableau.poules,
              this.tableau.maxNumberPlayers,
              this.tableau.palierQualifies,
              this.tableau.palierConsolantes
            )
            .subscribe(
              () => this.getBracket(),
              (err) => {
                this.spinnerShown = false;
                this.bracket = null;
                this.notifyService.notifyUser(
                  err.error,
                  this.snackBar,
                  'error',
                  'OK'
                );
              }
            );
        }
      });
  }

  getBracket(): void {
    if (this.isPari) {
      this.pariService.updateScoreTableauPhaseWaiting(
        this.tableau,
        this.phase,
        true
      );
    }

    this.bracketService
      .getBracket(
        this.idTableau,
        this.phase,
        this.isPari && !!this.accountService.getParieur(),
        this.accountService.getParieur()?._id
      )
      .subscribe(
        (response: ResponseGetBracket) => {
          this.bracket = response.bracket;

          // Gestion des paris
          if (this.isPari) {
            this.pariService.updateInfoParisJoueur.next(response.parisJoueur);
            this.pariService.updateListeParisMatches.next(
              response.parisJoueur.paris
            );
            this.infosParisJoueur = response.parisJoueur;

            this.pariService.updateScoreTableauPhaseWaiting(
              this.tableau,
              this.phase,
              false,
              response.bracket.rounds,
              response.parisJoueur.paris
            );
          }

          this.spinnerShown = false;
        },
        (err) => {
          this.spinnerShown = false;
          this.notifyService.notifyUser(
            err.error,
            this.snackBar,
            'error',
            'OK'
          );
        }
      );
  }

  isConsolante(): boolean {
    return this.phase === 'consolante';
  }

  getTableauState(): typeof TableauState {
    return this.appService.getTableauState();
  }
}
