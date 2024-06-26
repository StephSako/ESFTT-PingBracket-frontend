import { AccountService } from './../../Service/account.service';
import { JoueurMatchInterface, MatchInterface } from './../../Interface/Match';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BracketService } from '../../Service/bracket.service';
import { TableauInterface } from '../../Interface/Tableau';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import { HandicapService } from 'src/app/Service/handicap.service';
import { AppService } from 'src/app/app.service';
import { PariService } from 'src/app/Service/pari.service';
import {
  PariInterface,
  InfosParisJoueurInterface,
} from 'src/app/Interface/Pari';
import { TableauState } from '../TableauState.enum';
import { IdNomInterface } from 'src/app/Interface/IdNomInterface';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit, OnDestroy {
  @Input() isPari = false;
  @Input() infosParisJoueur: InfosParisJoueurInterface = {
    _id: null,
    pronos_vainqueurs: [],
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
    consolantePariable: null,
    ptsGagnesParisVainqueur: null,
    ptsPerdusParisVainqueur: null,
    ptsGagnesParisWB: null,
    ptsPerdusParisWB: null,
    ptsGagnesParisLB: null,
    ptsPerdusParisLB: null,
  };
  @Output() updateBracket: EventEmitter<any> = new EventEmitter();

  public disabledMatChip = false;
  public disabledCancelButton = false;
  public disabledLockToBets = false;
  public pariMatch: PariInterface = null;

  constructor(
    private bracketService: BracketService,
    private snackBar: MatSnackBar,
    private appService: AppService,
    private notifyService: NotifyService,
    private readonly handicapService: HandicapService,
    private readonly pariService: PariService,
    private readonly accountService: AccountService
  ) {}

  ngOnDestroy(): void {
    this.isPari = false;
  }

  ngOnInit(): void {
    if (this.isPari) {
      this.setMatchPari();

      this.pariService.updateListeParisMatches.subscribe(
        (listeParisJoueur: PariInterface[]) => {
          if (listeParisJoueur) {
            this.infosParisJoueur.paris = listeParisJoueur;
            this.setMatchPari();
          }
        }
      );
    }
  }

  onClickJoueur(winner: IdNomInterface): void {
    this.toogleDisablers();

    // Ne pas pouvoir modifier le résultat du match si le résultat a déjà été renseigné ou si le pari a déjà été effectué
    if (
      this.match.joueurs.length > 1 &&
      this.tableau.is_launched ===
        this.appService.getTableauState().BracketState &&
      !this.match.joueurs[0].winner &&
      ((this.match.joueurs[1] && !this.match.joueurs[1].winner) ||
        !this.match.joueurs[1]) &&
      (!this.isPari ||
        (this.isPari && !this.pariMatch && !this.isMatchLocked()))
    ) {
      if (this.isPari) {
        this.parierWinner(winner);
      } else {
        this.setWinner(winner._id);
      }
    } else {
      this.toogleDisablers();
    }
  }

  parierWinner(winner: IdNomInterface): void {
    const pariFromMatch: PariInterface = {
      id_tableau: {
        _id: this.tableau._id,
        nom: this.tableau.nom,
        format: this.tableau.format,
      },
      phase: this.phase,
      id_gagnant: winner,
      id_match: this.match.id,
      round: this.match.round,
    };
    this.pariService
      .addPariFromMatch(this.infosParisJoueur._id, pariFromMatch)
      .subscribe(
        () => {
          this.toogleDisablers();
          this.pariService.addPariToListeParisMatches.next(pariFromMatch);
        },
        (err) => {
          this.notifyService.notifyUser(
            err.error,
            this.snackBar,
            'error',
            'OK'
          );
          this.toogleDisablers();
        }
      );
  }

  setMatchPari(): void {
    if (
      this.infosParisJoueur !== null &&
      this.infosParisJoueur.hasOwnProperty('paris')
    ) {
      this.pariMatch = this.infosParisJoueur.paris.find(
        (pari: PariInterface) =>
          pari.id_match === this.match.id &&
          pari.round === this.match.round &&
          pari.phase === this.phase &&
          pari.id_tableau._id === this.tableau._id
      );
    }
  }

  setWinner(winnerId: string): void {
    const looserId = this.match.joueurs.filter(
      (joueur) => joueur._id._id !== winnerId
    )[0]._id._id;
    this.bracketService
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
          this.toogleDisablers();
        },
        (err) => {
          this.notifyService.notifyUser(
            err.error,
            this.snackBar,
            'error',
            'OK'
          );
          this.toogleDisablers();
        }
      );
  }

  lockMatchToBets(): void {
    this.toogleDisablers();

    this.bracketService
      .lockMatchToBets(
        this.tableau._id,
        this.match.round,
        this.match.id,
        this.phase,
        this.match.isLockToBets
      )
      .subscribe(
        () => {
          this.match.isLockToBets = !this.match.isLockToBets;
          this.toogleDisablers();
        },
        (err) => {
          this.notifyService.notifyUser(
            err.error,
            this.snackBar,
            'error',
            'OK'
          );
          this.toogleDisablers();
        }
      );
  }

  isClickable(): string {
    return this.isClickableToSetWinner() || this.isClickableToBet()
      ? 'clickable'
      : '';
  }

  isClickableToSetWinner(): boolean {
    return (
      this.match.joueurs.length > 1 &&
      this.matchHasTwoPlayers() &&
      this.tableau.is_launched ===
        this.appService.getTableauState().BracketState &&
      !this.match.joueurs[0]?.winner &&
      !this.match.joueurs[1]?.winner
    );
  }

  isClickableToBet(): boolean {
    return (
      this.isPari &&
      !this.pariMatch &&
      !this.isMatchLocked() &&
      !this.match.isLockToBets
    );
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
      this.match.joueurs.filter((joueur) => joueur.winner).length === 1
    );
  }

  getColorPari(joueur?: JoueurMatchInterface): { color: string; icon: string } {
    const idJoueur =
      joueur === undefined
        ? this.match.joueurs.filter(
            (joueurM: JoueurMatchInterface) => joueurM.winner
          )[0]?._id._id
        : joueur._id._id;
    if (this.isPari && this.pariMatch) {
      return {
        color:
          idJoueur === this.pariMatch?.id_gagnant._id
            ? 'pari-winner'
            : 'pari-looser',
        icon:
          idJoueur === this.pariMatch?.id_gagnant._id
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

  isMatchLocked(): boolean {
    return (
      this.isPari &&
      this.match.joueurs.filter((joueur) => joueur.winner).length === 0 &&
      (this.match.joueurs.filter(
        (joueur: JoueurMatchInterface) =>
          joueur?._id?._id === this.accountService.getParieur()._id
      ).length > 0 ||
        this.match.isLockToBets)
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
    return this.isMatchResultCancelable() || this.isPariCancelable();
  }

  isMatchResultCancelable(): boolean {
    return (
      !this.isPari &&
      this.matchHasTwoPlayers() &&
      this.match.isCancelable &&
      this.tableau.is_launched === this.getTableauxStates().BracketState
    );
  }

  isMatchLockableForBets(): boolean {
    return (
      this.tableau.pariable &&
      !this.isPari &&
      this.matchHasTwoPlayers() &&
      !(this.match.joueurs[0]?.winner || this.match.joueurs[1]?.winner) &&
      !this.isCancelable() &&
      this.tableau.is_launched === this.getTableauxStates().BracketState
    );
  }

  isPariCancelable(): boolean {
    return (
      this.isPari &&
      !!this.getColorPari().color &&
      !this.showResultatPari() &&
      !this.match.isLockToBets
    );
  }

  onCancelClick(): void {
    this.toogleDisablers();

    if (this.isPari) {
      this.cancelPariMatch();
    } else {
      this.cancelMatchResult();
    }
  }

  cancelMatchResult(): void {
    this.bracketService
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
          this.toogleDisablers();
        },
        (err) => {
          this.toogleDisablers();
          this.notifyService.notifyUser(
            err.error,
            this.snackBar,
            'error',
            'OK'
          );
        }
      );
  }

  cancelPariMatch(): void {
    this.pariService
      .cancel(this.infosParisJoueur._id, this.pariMatch)
      .subscribe(
        () => {
          this.pariService.deletePariToListeParisMatches.next(this.pariMatch);
          this.toogleDisablers();
        },
        (err) => {
          this.toogleDisablers();
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

  toogleDisablers(): void {
    this.disabledMatChip = !this.disabledMatChip;
    this.disabledCancelButton = !this.disabledCancelButton;
    this.disabledLockToBets = !this.disabledLockToBets;
  }
}
