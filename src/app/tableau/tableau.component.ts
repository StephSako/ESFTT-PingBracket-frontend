import { Component, OnInit } from '@angular/core';
import { NgttTournament } from 'ng-tournament-tree';
import { TournoiService } from '../Service/tournoi.service';
import { Router } from '@angular/router';
import { PoulesService } from '../Service/poules.service';

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.scss']
})
export class TableauComponent implements OnInit {

  public winnerbracket: NgttTournament;
  public looserBracket: NgttTournament;

  nomTableau: string;
  spinnerShown: boolean;

  constructor(private tournoiService: TournoiService, private router: Router, private pouleService: PoulesService) {
  }

  ngOnInit(): void {
    this.spinnerShown = false;
    this.nomTableau = this.router.url.split('/').pop();
    this.updateBracket();
  }

  updateBracket(): void {
    this.tournoiService.getBracket(this.router.url.split('/').pop()).subscribe(matches => {
      this.winnerbracket = matches;
      this.spinnerShown = false;
    });
  }

  generateBracket(): void {
    this.spinnerShown = true;
    this.pouleService.getAll(this.router.url.split('/').pop()).subscribe(poules => {
      this.tournoiService.generateBracket(this.router.url.split('/').pop(), poules)
        .subscribe(() => this.updateBracket(), () => this.spinnerShown = false);
    });
  }
}
