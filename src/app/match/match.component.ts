import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TournoiService } from '../Service/tournoi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  @Input() match: any;
  @Output() updateBracket: EventEmitter<any> = new EventEmitter();

  constructor(private tournoiService: TournoiService, private router: Router) { }

  ngOnInit(): void {
  }

  setWinner(round: number, id_match: number, winnerId: number, joueur1: number, joueur2: number): void{
    this.tournoiService.edit(this.router.url.split('/').pop(), round, id_match, winnerId,
      (winnerId === joueur1 ? joueur2 : joueur1)).subscribe(() => {
      this.updateBracket.emit();
    });
  }
}
