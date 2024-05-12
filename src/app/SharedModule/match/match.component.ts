import { AccountService } from './../../Service/account.service';
import { JoueurMatchInterface, MatchInterface } from './../../Interface/Match';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BracketService } from '../../Service/bracket.service';
import { TableauInterface } from '../../Interface/Tableau';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import { HandicapService } from 'src/app/Service/handicap.service';
import { AppService } from 'src/app/app.service';
import { PariService } from 'src/app/Service/pari.service';
import { PariInterface, ParisJoueurInterface } from 'src/app/Interface/Pari';
import { TableauState } from '../TableauState.enum';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {
  @Input() isPari: boolean = false;
  @Input() pariJoueur: ParisJoueurInterface = {
    _id: null,
    id_prono_vainqueur: null,
    id_pronostiqueur: null,
    paris: [],
  };
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
    palierQualifies: null,
    palierConsolantes: null,
    hasChapeau: null,
    type_licence: null,
    pariable: null,
  };
  @Output() updateBracket: EventEmitter<any> = new EventEmitter();

  public disabledMatChip = false;
  public disabledCancelButton = false;
  public idParieur: string = null;
  public pariMatch: PariInterface = null;

  constructor(
    private tournoiService: BracketService,
    private snackBar: MatSnackBar,
    private appService: AppService,
    private notifyService: NotifyService,
    private readonly handicapService: HandicapService,
    private readonly pariService: PariService,
    private readonly accountService: AccountService
  ) {}

  ngOnInit(): void {
    if (this.isPari) {
      this.idParieur = this.accountService.getIdParieur();
      this.setMatchPari();

      this.pariService.updatePariMatch.subscribe(
        (pariJoueur: ParisJoueurInterface) => {
          this.pariJoueur = pariJoueur;
          this.setMatchPari();
        }
      );
    }
  }

  onClickJoueur(winnerId: string): void {
    this.disabledMatChip = true;

    // Ne pas pouvoir modifier le résultat du match si le résultat a déjà été renseigné ou si le pari a déjà été effectué
    if (
      this.match.joueurs.length > 1 &&
      this.tableau.is_launched ===
        this.appService.getTableauState().BracketState &&
      !this.match.joueurs[0].winner &&
      ((this.match.joueurs[1] && !this.match.joueurs[1].winner) ||
        !this.match.joueurs[1]) &&
      (!this.isPari || (this.isPari && !this.pariMatch && !this.isMyMatch()))
    ) {
      if (this.isPari) {
        this.parierWinner(winnerId);
      } else {
        this.setWinner(winnerId);
      }
    } else {
      this.disabledMatChip = false;
    }
  }

  parierWinner(winnerId: string): void {
    const pariFromMatch: PariInterface = {
      _id: this.pariJoueur._id,
      id_tableau: this.tableau._id,
      phase: this.phase,
      id_gagnant: winnerId,
      id_match: this.match.id,
      round: this.match.round,
    };
    this.pariService.addPariFromMatch(pariFromMatch).subscribe(
      (result: any) => {
        // console.error(result); // TODO Update les paris du joueur dans sa variable
        this.disabledMatChip = false;
        this.pariService.listeParisJoueurLoggedIn.next();
        //TODO AFFICHER LES MESSAGES
      },
      (err) => {
        //TODO AFFICHER LES MESSAGES
        this.disabledMatChip = false;
      }
    );
  }

  setMatchPari(): void {
    this.pariMatch = this.pariJoueur.paris.find(
      (pari: PariInterface) =>
        pari.id_match === this.match.id &&
        pari.round === this.match.round &&
        pari.phase === this.phase &&
        pari.id_tableau === this.tableau._id
    );
  }

  setWinner(winnerId: string): void {
    this.disabledCancelButton = true;
    const looserId = this.match.joueurs.filter(
      (joueur) => joueur._id._id !== winnerId
    )[0]._id._id;
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

  isClickable(): string {
    return this.match.joueurs.length > 1 &&
      !this.match.joueurs[0].winner &&
      ((this.match.joueurs[1] && !this.match.joueurs[1].winner) ||
        !this.match.joueurs[1]) &&
      (!this.isPari || (this.isPari && !this.pariMatch && !this.isMyMatch()))
      ? 'clickable'
      : '';
  }

  getColor(joueur: JoueurMatchInterface): string {
    if (
      (this.match.joueurs.length < 2 && !this.match.joueurs[0].winner) ||
      (!this.match.joueurs[0].winner && !this.match.joueurs[1].winner)
    ) {
      return '';
    } else {
      return joueur.winner ? 'winner' : 'looser';
    }
  }

  showResultatPari(): boolean {
    return (
      this.isPari &&
      this.getColorPari().icon &&
      this.match.joueurs.filter((joueur) => joueur.winner).length !== 0
    );
  }

  getColorPari(joueur?: JoueurMatchInterface): { color: string; icon: string } {
    const idJoueur =
      joueur === undefined
        ? this.match.joueurs.filter((joueur) => joueur.winner)[0]?._id._id
        : joueur._id._id;
    if (this.isPari && this.pariMatch) {
      return {
        color:
          idJoueur === this.pariMatch?.id_gagnant
            ? 'pari-winner'
            : 'pari-looser',
        icon:
          idJoueur === this.pariMatch?.id_gagnant
            ? 'thumb_up_alt'
            : 'thumb_down',
      };
    } else {
      return {
        color: '',
        icon: '',
      };
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

  isMyMatch(): boolean {
    return (
      this.isPari &&
      this.match.joueurs.filter(
        (joueur: JoueurMatchInterface) =>
          joueur?._id?._id === this.accountService.getIdParieur()
      ).length > 0
    );
  }

  formatGetName(name_s: string): string {
    return name_s.length > 30 && this.tableau.format === 'double'
      ? name_s.substring(0, 27) + '...'
      : name_s;
  }

  getHandicap(): any[] {
    if (!this.match.joueurs[0]._id || !this.match.joueurs[1]._id) {
      return [''];
    }
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

  getTableauxStates(): typeof TableauState {
    return this.appService.getTableauState();
  }
}
