import { Component, Input, OnInit } from '@angular/core';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { BracketService } from '../Service/bracket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgttTournament } from 'ng-tournament-tree';
import { TableauInterface } from '../Interface/Tableau';

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
    format: null,
    consolante: null
  };
  spinnerShown: boolean;
  idTableau: string;
  public bracket: NgttTournament;

  constructor(private tournoiService: BracketService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) { }

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
      option: null
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: accountToDelete
    }).afterClosed().subscribe(value => {
      if (value){
        this.spinnerShown = true;
        this.tournoiService.generateBracket(this.tableau._id, this.tableau.format, this.phase)
          .subscribe(() => this.getBracket(), () => this.spinnerShown = false);
      }
    });
  }

  getBracket(): void {
    this.tournoiService.getBracket(this.idTableau, this.phase).subscribe(matches => {
      this.bracket = matches;
      this.spinnerShown = false;
    });
  }

}
