import { MatchInterface } from './../../Interface/Match';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BracketService } from '../../Service/bracket.service';
import { TableauInterface } from '../../Interface/Tableau';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import { HandicapService } from 'src/app/Service/handicap.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {
  @Input() match: MatchInterface;
  @Input() phase: string;
  @Input() tableau: TableauInterface = {
    format: null,
    _id: null,
    is_launched: null,
    nom: null,
    poules: null,
    consolante: null,
    maxNumberPlayers: null,
    age_minimum: null,
    nbPoules: null,
    handicap: null,
  };
  @Output() updateBracket: EventEmitter<any> = new EventEmitter();
  public disabledMatChip = false;
  public disabledCancelButton = false;

  constructor(
    private tournoiService: BracketService,
    private snackBar: MatSnackBar,
    private notifyService: NotifyService,
    private readonly handicapService: HandicapService
  ) {}

  ngOnInit(): void {}

  setWinner(winnerId: string): void {
    if (
      this.match.joueurs.length > 1 &&
      this.tableau.is_launched !== 2 &&
      !this.match.joueurs[0].winner &&
      ((this.match.joueurs[1] && !this.match.joueurs[1].winner) ||
        !this.match.joueurs[1])
    ) {
      this.disabledMatChip = true;
      this.disabledCancelButton = true;
      const looserId =
        this.match.joueurs.length === 2 &&
        this.match.joueurs[0]._id &&
        this.match.joueurs[1]._id
          ? this.match.joueurs.filter(
              (joueur) => joueur._id._id !== winnerId
            )[0]._id._id
          : null;
      this.tournoiService
        .edit(
          this.tableau._id,
          this.match.round,
          this.match.id,
          winnerId,
          looserId,
          this.phase
        )
        .subscribe(
          () => {
            this.updateBracket.emit();
            this.disabledMatChip = false;
            this.disabledCancelButton = false;
          },
          (err) => {
            this.notifyService.notifyUser(
              err.error,
              this.snackBar,
              'error',
              'OK'
            );
            this.disabledMatChip = false;
            this.disabledCancelButton = false;
          }
        );
    }
  }

  isClickable(): string {
    return this.match.joueurs.length > 1 &&
      !this.match.joueurs[0].winner &&
      ((this.match.joueurs[1] && !this.match.joueurs[1].winner) ||
        !this.match.joueurs[1])
      ? 'clickable'
      : '';
  }

  getColor(joueur: any): string {
    if (
      (this.match.joueurs.length < 2 && !this.match.joueurs[0].winner) ||
      (!this.match.joueurs[0].winner && !this.match.joueurs[1].winner)
    ) {
      return 'undefined';
    } else {
      return joueur.winner ? 'winner' : 'looser';
    }
  }

  getName(entity: any): string {
    if (this.tableau.format === 'simple') {
      return this.formatGetName(entity.nom + ' - ' + entity.classement);
    } else if (this.tableau.format === 'double') {
      return this.formatGetName(
        entity.joueurs
          ? entity.joueurs.map((joueur) => joueur.nom).join(' - ')
          : ''
      );
    }
  }

  formatGetName(name_s: string): string {
    return name_s.length > 30 && this.tableau.format === 'double'
      ? name_s.substring(0, 27) + '...'
      : name_s;
  }

  getHandicap(): any[] {
    return this.handicapService.calculHandicap(
      this.match.joueurs[0]._id.classement,
      this.match.joueurs[1]._id.classement
    );
  }

  matchHasTwoPlayers(): boolean {
    return (
      this.match.joueurs.length === 2 &&
      this.match.joueurs.every((j: any) => j.hasOwnProperty('_id'))
    );
  }

  displayFinalIcons(): boolean {
    return (
      this.matchHasTwoPlayers() &&
      !(!this.match.joueurs[0].winner && !this.match.joueurs[1].winner) &&
      this.match.round === 1
    );
  }

  isCancelable(): boolean {
    return this.matchHasTwoPlayers() && this.match.isCancelable;
  }

  cancelMatchResult(): void {
    this.disabledMatChip = true;
    this.disabledCancelButton = true;
    this.tournoiService
      .cancelMatchResult(
        this.tableau._id,
        this.phase,
        this.match.id,
        this.match.round,
        this.match.joueurs.find((j) => j.winner)._id._id,
        this.match.joueurs.find((j) => !j.winner)._id._id
      )
      .subscribe(
        () => {
          this.updateBracket.emit();
          this.disabledMatChip = false;
          this.disabledCancelButton = false;
        },
        (err) => {
          this.disabledMatChip = false;
          this.disabledCancelButton = false;
          this.notifyService.notifyUser(
            err.error,
            this.snackBar,
            'error',
            'OK'
          );
        }
      );
  }
}
