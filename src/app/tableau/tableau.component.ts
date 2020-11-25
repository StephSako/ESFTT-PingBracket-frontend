import { Component, OnInit } from '@angular/core';
import {NgttTournament} from 'ng-tournament-tree';
import {TournoiService} from '../Service/tournoi.service';

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.scss']
})
export class TableauComponent implements OnInit {

  public singleEliminationTournament: NgttTournament;
  public doubleEliminationTournament: NgttTournament;

  public render: string;

  constructor(private matchService: TournoiService) {
  }

  ngOnInit(): void {
    this.render = 'list_players';
    this.matchService.getAll().subscribe(matches => this.singleEliminationTournament = matches);
    this.matchService.getAll().subscribe(matches => this.doubleEliminationTournament = matches);
  }

}