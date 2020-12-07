import { Component, OnInit } from '@angular/core';
import { NgttTournament } from 'ng-tournament-tree';
import { TournoiService } from '../Service/tournoi.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GestionService} from '../Service/gestion.service';
import {TableauInterface} from '../Interface/Tableau';

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.scss']
})
export class TableauComponent implements OnInit {

  public winnerbracket: NgttTournament;
  public looserBracket: NgttTournament;
  idTableau: string;
  tableau: TableauInterface;
  spinnerShown: boolean;

  constructor(private tournoiService: TournoiService, private router: Router, private route: ActivatedRoute,
              private gestionService: GestionService) {
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
    this.gestionService.getTableau(this.idTableau).subscribe(tableau => {
      this.tableau = tableau;
    });
  }

  updateBracket(): void {
    this.tournoiService.getBracket(this.idTableau).subscribe(matches => {
      this.winnerbracket = matches;
      this.spinnerShown = false;
    });
  }

  generateBracket(): void {
    this.spinnerShown = true;
    this.tournoiService.generateBracket(this.idTableau, this.tableau.format)
      .subscribe(() => this.updateBracket(), () => this.spinnerShown = false);
  }
}
