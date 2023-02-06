import { Component, Input, OnInit } from '@angular/core';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { BracketService } from '../../Service/bracket.service';
import {ActivatedRoute, Params} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgttTournament } from 'ng-tournament-tree';
import { TableauInterface } from '../../Interface/Tableau';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotifyService} from '../../Service/notify.service';

@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss']
})
export class BracketComponent implements OnInit {

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
    handicap: null
  };
  spinnerShown: boolean;
  idTableau: string;
  public bracket: NgttTournament;

  constructor(private tournoiService: BracketService, private route: ActivatedRoute, private dialog: MatDialog,
              private snackBar: MatSnackBar, private notifyService: NotifyService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.spinnerShown = false;
      this.idTableau = params.tableau;
      this.getBracket();
    });
  }

  generateBracket(): void {
    const accountToDelete: Dialog = {
      id: 'true',
      action: 'Régénérer le tableau ?',
      option: null,
      action_button_text: 'Régénérer'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: accountToDelete
    }).afterClosed().subscribe(value => {
      if (value){
        this.spinnerShown = true;
        this.tournoiService.generateBracket(this.tableau._id, this.tableau.format, this.phase, this.tableau.poules, this.tableau.maxNumberPlayers)
          .subscribe(() => this.getBracket(), (err) => {
            this.spinnerShown = false;
            this.bracket = null;
            this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
          });
      }
    });
  }

  getBracket(): void {
    this.tournoiService.getBracket(this.idTableau, this.phase).subscribe(matches => {
      this.bracket = matches;
      this.spinnerShown = false;
    }, err => this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK'));
  }
}
