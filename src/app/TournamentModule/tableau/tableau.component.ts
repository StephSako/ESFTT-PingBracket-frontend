import { AppService } from './../../app.service';
import { Component, OnInit } from '@angular/core';
import { TableauService } from '../../Service/tableau.service';
import { TableauInterface } from '../../Interface/Tableau';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import { PoulesService } from '../../Service/poules.service';
import { PouleInterface } from '../../Interface/Poule';
import { BinomeService } from '../../Service/binome.service';
import { BinomeInterface } from '../../Interface/Binome';
import { JoueurService } from '../../Service/joueur.service';
import { JoueurInterface } from '../../Interface/Joueur';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.scss'],
})
export class TableauComponent implements OnInit {
  tableau: TableauInterface = {
    _id: null,
    format: null,
    nom: null,
    poules: null,
    is_launched: null,
    consolante: null,
    maxNumberPlayers: null,
    age_minimum: null,
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

  // Input variables
  poules: PouleInterface[] = [];
  binomes: BinomeInterface[] = [];
  subscribedUnassignedPlayers: JoueurInterface[] = [];

  constructor(
    public appService: AppService,
    private tableauService: TableauService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private notifyService: NotifyService,
    private pouleService: PoulesService,
    private binomeService: BinomeService,
    private joueurService: JoueurService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.getTableau(params.tableau);
    });
  }

  getTableau(idTableau: string): void {
    this.tableauService.getTableau(idTableau).subscribe(
      (tableau) => (this.tableau = tableau),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
        this.router.navigate(['/error-page']);
      }
    );
  }

  changeStateTableau(nextState: number): void {
    const stateToChange: Dialog = {
      id: 'true',
      action:
        this.tableau.is_launched ===
        this.appService.getTableauState().BracketState
          ? 'Clôturer le tableau ?'
          : 'Lancer les ' +
            (this.tableau.poules ? 'poules' : 'phases finales') +
            ' ?',
      option:
        this.tableau.is_launched ===
        this.appService.getTableauState().PointageState
          ? (this.tableau.format !== 'double'
              ? 'Les inscriptions seront fermées'
              : 'Les inscriptions et les binômes seront fermés,') +
            ' et les absents seront éliminés'
          : this.tableau.is_launched ===
            this.appService.getTableauState().PouleState
          ? 'Les ' +
            (this.tableau.poules ? 'poules' : 'binômes') +
            ' seront validé' +
            (this.tableau.poules ? 'e' : '') +
            's et bloqué' +
            (this.tableau.poules ? 'e' : '') +
            's'
          : 'Les phases finales seront fermées',
      action_button_text: 'Valider',
    };

    this.dialog
      .open(DialogComponent, {
        width: '55%',
        data: stateToChange,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.tableau.is_launched = nextState;
          this.tableauService.tableauxEditSource.next(this.tableau);
          this.tableauService.changeLaunchState(this.tableau).subscribe(
            () => {
              if (
                this.tableau.poules &&
                this.tableau.is_launched ===
                  this.appService.getTableauState().BracketState
              ) {
                this.pouleService
                  .validateAllPoules(this.tableau._id)
                  .subscribe();
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
      });
  }

  // Output functions
  getAllPoules(): void {
    this.pouleService.getAll(this.tableau._id, this.tableau.format).subscribe(
      (poules) => (this.poules = poules),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  generatePoules(): void {
    this.pouleService.generatePoules(this.tableau).subscribe(
      () => this.getAllPoules(),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  getAllBinomes(): void {
    this.binomeService.getAll(this.tableau._id).subscribe(
      (binomes) => (this.binomes = binomes),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  getSubscribedUnassignedPlayers(): void {
    this.joueurService
      .getSubscribedUnassignedDouble(this.tableau._id)
      .subscribe(
        (joueurs) => (this.subscribedUnassignedPlayers = joueurs),
        (err) =>
          this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK')
      );
  }

  showTypeLicence(idTypeLicence: number): string {
    return this.tableauService.showTypeLicence(idTypeLicence);
  }
}
