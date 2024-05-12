import { AppService } from './../../app.service';
import { Component, Input, OnInit } from '@angular/core';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { BracketService } from '../../Service/bracket.service';
import { MatDialog } from '@angular/material/dialog';
import { TableauInterface } from '../../Interface/Tableau';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import { BracketInterface } from 'src/app/Interface/Bracket';
import { TableauState } from 'src/app/SharedModule/TableauState.enum';
import { ParisJoueurInterface } from 'src/app/Interface/Pari';

@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss'],
})
export class BracketComponent implements OnInit {
  @Input() isPari: boolean = false;
  @Input() pariJoueur: ParisJoueurInterface = {
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
  };
  spinnerShown: boolean;
  idTableau: string;
  public bracket: BracketInterface;

  constructor(
    private tournoiService: BracketService,
    private appService: AppService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private notifyService: NotifyService
  ) {}

  ngOnInit(): void {
    this.spinnerShown = false;
    this.idTableau = this.tableau._id;
    this.getBracket();
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
          this.tournoiService
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
    this.tournoiService.getBracket(this.idTableau, this.phase).subscribe(
      (matches: BracketInterface) => {
        this.bracket = matches;
        this.spinnerShown = false;
      },
      (err) =>
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK')
    );
  }

  getTableauState(): typeof TableauState {
    return this.appService.getTableauState();
  }
}
