import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BracketService } from '../../Service/bracket.service';
import { TableauInterface } from '../../Interface/Tableau';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';

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
    is_launched: null,
    nom: null,
    poules: null,
    consolante: null,
    age_minimum: null,
    nbPoules: null
  };

  constructor(private tournoiService: BracketService, private snackBar: MatSnackBar, private notifyService: NotifyService) { }

  ngOnInit(): void {}

  setWinner(match: any, winnerId: string): void{
    if (match.joueurs.length !== 1 && this.tableau.is_launched !== 2) {
      if (!match.joueurs[0].winner && ((match.joueurs[1] && !match.joueurs[1].winner) || !match.joueurs[1])){
        const looserId = (match.joueurs.length === 2 && (match.joueurs[0]._id && match.joueurs[1]._id) ?
          match.joueurs.filter(joueur => joueur._id._id !== winnerId)[0]._id._id : null);
        this.tournoiService.edit(this.tableau._id, match.round, match.id, winnerId, looserId, this.phase)
          .subscribe(() => this.updateBracket.emit(), err => {
            this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
          });
      }
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
    if (this.tableau.format === 'simple') { return entity.nom + ' - ' + entity.classement + ' points'; }
    else if (this.tableau.format === 'double') { return (entity.joueurs ? entity.joueurs.map(joueur => joueur.nom).join(' - ') : ''); }
  }
}
