import { Component, OnInit } from '@angular/core';
import { NgttTournament } from 'ng-tournament-tree';
import { TournoiService } from '../Service/tournoi.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.scss']
})
export class TableauComponent implements OnInit {

  public winnerbracket: NgttTournament;
  public looserBracket: NgttTournament;
  tableau_id: string;
  spinnerShown: boolean;

  constructor(private tournoiService: TournoiService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.spinnerShown = false;
      this.tableau_id = this.router.url.split('/').pop();
      this.updateBracket();
    });
  }

  updateBracket(): void {
    this.tournoiService.getBracket(this.tableau_id).subscribe(matches => {
      this.winnerbracket = matches;
      this.spinnerShown = false;
    });
  }

  generateBracket(): void {
    this.spinnerShown = true;
    this.tournoiService.generateBracket(this.tableau_id).subscribe(() => this.updateBracket(), () => this.spinnerShown = false);
  }
}
