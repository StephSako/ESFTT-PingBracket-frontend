import {Component, Input, OnInit} from '@angular/core';


// tslint:disable-next-line:class-name
interface nextMatch {
  actualRound: number;
  actualIdMatch: number;
  nextRound: number;
  nexIdMatch: number;
}

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  @Input() match: any;

  constructor() { }

  ngOnInit(): void {
  }

  click(round: number, id_match: number): void{
    console.log(this.getNextStep(round, id_match));
  }

  getNextStep(round: number, id_match: number): nextMatch {
    let idNextMatch = id_match;
    if (idNextMatch % 2 !== 0) { idNextMatch++; }
    let nextRound = round;
    nextRound--;
    return {
      actualRound: round,
      actualIdMatch: id_match,
      nextRound,
      nexIdMatch: idNextMatch / 2
    };
  }

}
