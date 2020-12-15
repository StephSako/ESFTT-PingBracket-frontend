import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BracketService } from '../Service/bracket.service';
import { TableauInterface } from '../Interface/Tableau';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  @Input() match: any;
  @Input() phase: string;
  @Output() updateBracket: EventEmitter<any> = new EventEmitter();
  @Input() tableau: TableauInterface = {
    format: null,
    _id: null,
    nom: null,
    consolante: null
  };

  constructor(private tournoiService: BracketService) { }

  ngOnInit(): void {}

  setWinner(match: any, winnerId: string): void{
    if (!match.joueurs[0].winner && ((match.joueurs[1] && !match.joueurs[1].winner) || !match.joueurs[1])){
      const looserId = (match.joueurs.length === 2 && (match.joueurs[0]._id && match.joueurs[1]._id) ?
        match.joueurs.filter(joueur => joueur._id._id !== winnerId)[0]._id._id : null);
      this.tournoiService.edit(this.tableau._id, match.round, match.id, winnerId, looserId, this.phase)
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

  getName(entity: any): string {
    if (this.tableau.format === 'simple'){ return entity.nom; }
    else { return (entity.joueurs ? entity.joueurs.map(joueur => joueur.nom).join(' - ') : ''); }
  }
}
