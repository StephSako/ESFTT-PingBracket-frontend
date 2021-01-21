import { Component, Input, OnInit } from '@angular/core';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { BracketService } from '../Service/bracket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgttTournament } from 'ng-tournament-tree';
import { TableauInterface } from '../Interface/Tableau';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotifyService} from '../Service/notify.service';

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
    age_minimum: null
  };
  spinnerShown: boolean;
  idTableau: string;
  public bracket: NgttTournament;

  constructor(private tournoiService: BracketService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog,
              private snackBar: MatSnackBar, private notifyService: NotifyService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.spinnerShown = false;
      this.idTableau = this.router.url.split('/').pop();
      this.getBracket();
    });
  }

  generateBracket(): void {
    const accountToDelete: Dialog = {
      id: 'true',
      action: 'Regénérer le tableau ?',
      option: null,
      action_button_text: 'Régénérer'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: accountToDelete
    }).afterClosed().subscribe(value => {
      if (value){
        this.spinnerShown = true;
        this.tournoiService.generateBracket(this.tableau._id, this.tableau.format, this.phase)
          .subscribe(() => this.getBracket(), (err) => {
            this.spinnerShown = false;
            this.bracket = null;
            this.notifyService.notifyUser((this.tableau.format === 'simple' ? `${err.error} joueurs` : `${err} binômes complets` )
              , this.snackBar, 'error', 2000, 'OK');
          });
      }
    });
  }

  getBracket(): void {
    this.tournoiService.getBracket(this.idTableau, this.phase).subscribe(matches => {
      this.bracket = matches;
      this.spinnerShown = false;
    }, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

}
