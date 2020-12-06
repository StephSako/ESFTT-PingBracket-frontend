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
  tableau_id: string;

  constructor(private tournoiService: TournoiService, private router: Router) { }

  ngOnInit(): void {
    this.tableau_id = this.router.url.split('/').pop();
  }

  setWinner(match: any, winnerId: string): void{
    if (!match.joueurs[0].winner && ((match.joueurs[1] && !match.joueurs[1].winner) || !match.joueurs[1])){
      this.tournoiService.edit(this.tableau_id, match.round, match.id, winnerId,
        (winnerId === match.joueurs[0]._id._id ? (match.joueurs[1] ? match.joueurs[1]._id._id : null) : match.joueurs[0]._id._id))
        .subscribe(() => this.updateBracket.emit());
    }
  }

  isClickable(match: any): string {
    return (!match.joueurs[0].winner && ((match.joueurs[1] && !match.joueurs[1].winner) || !match.joueurs[1]) ? 'clickable' : '');
  }

  getColor(match: any, joueur: any): string {
    if ((match.joueurs.length < 2 && !match.joueurs[0].winner) || (!match.joueurs[0].winner && !match.joueurs[1].winner)) { return 'undefined'; }
    else { return (joueur.winner ? 'winner' : 'looser'); }
  }
}
