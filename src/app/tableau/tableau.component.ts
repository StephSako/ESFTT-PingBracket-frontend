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

  public singleEliminationTournament: NgttTournament;
  public doubleEliminationTournament: NgttTournament;

  public render: string;

  constructor(private tournoiService: TournoiService, private router: Router, private pouleService: PoulesService) {
  }

  ngOnInit(): void {
    this.render = 'winner';
    this.updateBracket();
    this.tournoiService.getAll(this.router.url.split('/').pop()).subscribe(matches => this.doubleEliminationTournament = matches);
  }

  updateBracket(): void {
    this.tournoiService.getAll(this.router.url.split('/').pop()).subscribe(matches => this.singleEliminationTournament = matches);
  }

  generateBracket(): void {
    this.pouleService.getAll(this.router.url.split('/').pop()).subscribe(poules => {
      this.tournoiService.generateBracket(this.router.url.split('/').pop(), poules)
        .subscribe(() => this.updateBracket());
    });
  }

  resetBracket(): void {
    this.tournoiService.resetBracket(this.router.url.split('/').pop()).subscribe(() => this.updateBracket());
  }
}
