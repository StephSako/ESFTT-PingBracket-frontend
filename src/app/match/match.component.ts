import {Component, Input, OnInit} from '@angular/core';
import {MatchUpdate} from '../Interface/MatchUpdate';
import {TournoiService} from '../Service/tournoi.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  @Input() match: any;

  constructor(private tournoiService: TournoiService) { }

  ngOnInit(): void {
  }

  click(round: number, id_match: number, winnerId: number): void{
    this.tournoiService.edit(this.getNextStep(round, id_match, winnerId)).subscribe(req => console.log(req));
  }

  getNextStep(round: number, id_match: number, winnerId: number): MatchUpdate {
    let idNextMatch = id_match;
    if (idNextMatch % 2 !== 0) { idNextMatch++; }
    let nextRound = round;
    nextRound--;
    return {
      actualRound: round,
      actualIdMatch: id_match,
      nextRound,
      nexIdMatch: idNextMatch / 2,
      winnerId
    };
  }

}
