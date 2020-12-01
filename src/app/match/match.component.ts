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

  setWinner(match: any, winnerId: number): void{
    if (match.joueurs.length === 2 && (!match.joueurs[0].winner && !match.joueurs[1].winner)){
      this.tournoiService.edit(this.router.url.split('/').pop(), match.round, match.id, winnerId,
        (winnerId === match.joueurs[0] ? match.joueurs[1] : match.joueurs[0])).subscribe(() => {
        this.updateBracket.emit();
      });
    }
  }

  getColor(match: any, joueur: any): string {
    if (match.joueurs.length < 2 || (!match.joueurs[0].winner && !match.joueurs[1].winner)) { return 'undefined'; }
    else if (match.joueurs.length === 2) { return (joueur.winner ? 'winner' : 'looser'); }
  }
}
