import { TableauInterface } from './../../Interface/Tableau';
import { AppService } from './../../app.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { BracketService } from '../../Service/bracket.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import { BracketInterface } from 'src/app/Interface/Bracket';
import { TableauState } from 'src/app/SharedModule/TableauState.enum';
import { InfosParisJoueurInterface } from 'src/app/Interface/Pari';
import { ResponseGetBracket } from 'src/app/Interface/ResponseGetBracket';
import { AccountService } from 'src/app/Service/account.service';
import { PariService } from 'src/app/Service/pari.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss'],
})
export class BracketComponent implements OnInit, OnDestroy {
  @Input() isPari = false;
  @Input() infosParisJoueur: InfosParisJoueurInterface = {
    _id: null,
    pronos_vainqueurs: [],
    id_pronostiqueur: null,
    paris: [],
  };
  @Input() phase: string | any;
  @Input() tableau: TableauInterface | any = {
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
    ptsGagnesParisVainqueur: null,
    ptsPerdusParisVainqueur: null,
    ptsGagnesParisWB: null,
    ptsPerdusParisWB: null,
    ptsGagnesParisLB: null,
    ptsPerdusParisLB: null,
  };
  spinnerShown: boolean;
  hideBracket = false;
  public bracket: BracketInterface;
  private intervalUpdateMatches = null;
  private tableauxSubscription: Subscription;

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
    this.tableauxSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.spinnerShown = false;
    this.getBracket();

    if (this.isPari) {
      this.intervalUpdateMatches = setInterval(() => {
        this.spinnerShown = true;
        this.getBracket();
      }, 5000);
    }

    this.tableauxSubscription = this.bracketService.updateBracket.subscribe(
      () => {
        this.hideBracket = true;
        setTimeout(() => {
          this.getBracket();
        }, 500);
      }
    );
  }

  generateBracket(): void {
    const accountToDelete: Dialog = {
      id: 'true',
      action:
        'Régénérer le tableau ?' +
        ((this.phase === 'finale' && this.tableau.pariable) ||
        (this.phase === 'consolante' && this.tableau.consolantePariable)
          ? " Les paris de la phase '" + this.phase + "' seront supprimés."
          : ''),
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
              this.tableau.palierConsolantes,
              this.tableau.pariable,
              this.tableau.consolantePariable
            )
            .subscribe(
              () => {
                this.getBracket();
              },
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
        this.tableau._id,
        this.phase,
        true
      );
    }

    this.bracketService
      .getBracket(
        this.tableau._id,
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
              this.tableau._id,
              this.phase,
              false,
              response.parisJoueur.pronos_vainqueurs,
              response.bracket.rounds,
              response.parisJoueur.paris
            );

            this.pariService.updateListeTableauxPariables.next(
              response.tableauxPariables
            );
          }

          this.hideBracket = false;
          this.spinnerShown = false;
        },
        (err) => {
          this.spinnerShown = false;
          this.hideBracket = false;
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
