import { Component, OnInit } from '@angular/core';
import { NgttTournament } from 'ng-tournament-tree';
import { TournoiService } from '../Service/tournoi.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GestionService} from '../Service/gestion.service';
import {TableauInterface} from '../Interface/Tableau';
import {Dialog} from '../Interface/Dialog';
import {DialogComponent} from '../dialog/dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotifyService} from '../Service/notify.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.scss']
})
export class TableauComponent implements OnInit {

  public winnerbracket: NgttTournament;
  public looserBracket: NgttTournament;
  idTableau: string;
  tableau: TableauInterface = {
    _id: null,
    format: null,
    nom: null,
    consolante: null
  };
  spinnerShown: boolean;

  constructor(private tournoiService: TournoiService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog,
              private gestionService: GestionService, private snackbar: MatSnackBar, private notifyService: NotifyService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.spinnerShown = false;
      this.idTableau = this.router.url.split('/').pop();
      this.getTableau();
      this.updateBracket();
    });
  }

  getTableau(): void {
    this.gestionService.getTableau(this.idTableau).subscribe(tableau => this.tableau = tableau);
  }

  updateBracket(): void {
    this.tournoiService.getBracket(this.idTableau).subscribe(matches => {
      this.winnerbracket = matches;
      this.spinnerShown = false;
    });
  }

  generateBracket(): void {
    const accountToDelete: Dialog = {
      id: 'true',
      action: 'Regénérer le tableau ?',
      option: null
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: accountToDelete
    }).afterClosed().subscribe(value => {
      if (value){
        this.spinnerShown = true;
        this.tournoiService.generateBracket(this.idTableau, this.tableau.format)
          .subscribe(() => this.updateBracket(), () => this.spinnerShown = false);
      }
    });
  }
}
