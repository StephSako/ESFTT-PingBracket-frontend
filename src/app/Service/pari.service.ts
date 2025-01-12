import {
  PariVainqueurTableauResult,
  PronoVainqueur,
  ResultatPariJoueur,
} from './../Interface/Pari';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InfosParisJoueurInterface, PariInterface } from '../Interface/Pari';
import { RoundInterface } from '../Interface/Bracket';
import { JoueurMatchInterface, MatchInterface } from '../Interface/Match';
import { ScoreTableauPhaseInterface } from '../Interface/ScoreTableau';
import {
  PariableTableauInterface,
  TableauInterface,
} from '../Interface/Tableau';
import { BracketService } from './bracket.service';

@Injectable({
  providedIn: 'root',
})
export class PariService {
  private baseURL = environment.endpointNodeApi + 'paris/';
  updateParisLoggIn = new BehaviorSubject<boolean>(null);
  updateInfoParisJoueur = new BehaviorSubject<InfosParisJoueurInterface>(null);
  updateListeParisMatches = new BehaviorSubject<PariInterface[]>(null);
  updateListeTableauxPariables = new BehaviorSubject<TableauInterface[]>(null);
  addPariToListeParisMatches = new BehaviorSubject<PariInterface>(null);
  deletePariToListeParisMatches = new BehaviorSubject<PariInterface>(null);
  updateScorePariJoueur = new BehaviorSubject<ResultatPariJoueur>(null);

  public scoresParTableauPhase: ScoreTableauPhaseInterface[] = [];

  constructor(
    private http: HttpClient,
    private bracketService: BracketService
  ) {}

  public getGeneralResult(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public deleteParisTableauPhase(
    phase: string,
    idTableau: string
  ): Observable<any> {
    return this.http.delete(`${this.baseURL}delete/${idTableau}/${phase}`);
  }

  public getAllParisJoueur(idJoueur: string): Observable<any> {
    return this.http.get(`${this.baseURL}${idJoueur.toLowerCase()}`);
  }

  public addPariFromMatch(
    fichePariId: string,
    pariFromMatch: PariInterface
  ): Observable<any> {
    return this.http.post(`${this.baseURL}addPariFromMatch/${fichePariId}`, {
      pariFromMatch,
    });
  }

  public parierVainqueur(
    id_parieur: string,
    id_gagnant: string,
    id_tableau: string,
    creation_prono_vainqueur: boolean
  ): Observable<any> {
    return this.http.post(
      `${this.baseURL}vainqueur/${id_tableau}/${id_gagnant}`,
      {
        id_parieur,
        creation_prono_vainqueur,
      }
    );
  }

  public cancel(
    fichePariId: string,
    pariMatch: PariInterface
  ): Observable<any> {
    return this.http.put(`${this.baseURL}cancel/${fichePariId}`, { pariMatch });
  }

  public calculateScoreTableauPhase(
    rounds: RoundInterface[],
    paris: PariInterface[],
    pronos_vainqueurs: PronoVainqueur[]
  ): ResultatPariJoueur {
    let score = 0;
    const details: string[] = [];
    let pariVainqueurTableau: PariVainqueurTableauResult = null;

    if (paris.length === 0 && pronos_vainqueurs.length === 0) {
      return {
        score: 0,
        details: [],
        parisVainqueursTableauxResults: [],
      };
    }

    paris.sort((a, b) => {
      if (a.id_tableau._id === b.id_tableau._id) {
        return a.round > b.round ? -1 : a.round < b.round ? 1 : 0;
      } else {
        return a.id_tableau._id.concat(a.phase) <
          b.id_tableau._id.concat(a.phase)
          ? -1
          : 1;
      }
    });

    rounds.forEach((round: RoundInterface) => {
      const matches = round.matches.filter(
        (match: MatchInterface) =>
          match.joueurs.length === 2 &&
          match.joueurs.filter(
            (joueur: JoueurMatchInterface) => joueur.winner === true
          ).length === 1 &&
          match.isLockToBets
      );

      matches.forEach((match: MatchInterface) => {
        const indexPari = paris.findIndex(
          (pari: PariInterface) =>
            pari.id_tableau._id === round.tableau._id &&
            pari.phase === round.phase &&
            pari.id_match === match.id &&
            pari.round === match.round
        );

        if (indexPari !== -1) {
          let ptsGagnePerdu = 0;
          const isPariCorrect = match.joueurs.find(
            (joueur: JoueurMatchInterface) =>
              joueur._id._id === paris[indexPari].id_gagnant._id
          ).winner;
          // Le pari est correct
          if (isPariCorrect) {
            ptsGagnePerdu =
              paris[indexPari].phase === 'finale'
                ? round.tableau.ptsGagnesParisWB
                : round.tableau.ptsGagnesParisLB;
            score += ptsGagnePerdu;
          } // Le pari est incorrect
          else {
            ptsGagnePerdu =
              paris[indexPari].phase === 'finale'
                ? round.tableau.ptsPerdusParisWB
                : round.tableau.ptsPerdusParisLB;
            score += ptsGagnePerdu;
          }

          const joueurParié = match.joueurs.find(
            (joueur: JoueurMatchInterface) =>
              joueur._id._id === paris[indexPari].id_gagnant._id
          )._id.nom;
          const joueurNonParié = match.joueurs.find(
            (joueur: JoueurMatchInterface) =>
              joueur._id._id !== paris[indexPari].id_gagnant._id
          )._id.nom;

          details.push(
            (isPariCorrect
              ? "<span class='detailsGagne'>GAGNÉ</span>"
              : "<span class='detailsPerdu'>PERDU</span>") +
              ' : <b>' +
              round.tableau.nom
                .split(' ')
                .map((l: string) => l[0].toUpperCase() + l.substr(1))
                .join(' ') +
              ' - phase ' +
              round.phase +
              '</b>' +
              ' | ' +
              this.bracketService.getLibelleRound(match.round, match.id) +
              ' : pari sur ' +
              joueurParié +
              ' contre ' +
              joueurNonParié +
              ' : <b>' +
              (score - ptsGagnePerdu) +
              (ptsGagnePerdu >= 0 ? '+' : '') +
              ptsGagnePerdu +
              ' = ' +
              score +
              ' pt' +
              (score > 1 || score < 0 ? 's' : '') +
              '</b><br>'
          );
        }
      });

      // On donne les points du pari sur le vainqueur du tableau
      if (round.round === 1 && round.phase === 'finale') {
        const pronoVainqueurTableauSearch: PronoVainqueur =
          pronos_vainqueurs.find(
            (pronoVainqueurTableau: PronoVainqueur) =>
              pronoVainqueurTableau.id_tableau._id === round.tableau._id
          );

        const finale: MatchInterface = round.matches.find(
          (match: MatchInterface) =>
            match.joueurs.length === 2 &&
            match.joueurs.filter(
              (joueur: JoueurMatchInterface) => joueur.winner === true
            ).length === 1 &&
            match.id === 1
        );

        if (finale && pronoVainqueurTableauSearch) {
          const vainqueurTableau = finale.joueurs.find(
            (joueur: JoueurMatchInterface) => joueur.winner
          )._id;
          const pronoVainqueurCorrect =
            pronoVainqueurTableauSearch.id_gagnant._id === vainqueurTableau._id;

          const ptsGagnePerduVainqueur = pronoVainqueurCorrect
            ? round.tableau.ptsGagnesParisVainqueur
            : round.tableau.ptsPerdusParisVainqueur;

          score += ptsGagnePerduVainqueur;
          pariVainqueurTableau = {
            id_tableau: round.tableau._id,
            pariVainqueurOK:
              pronoVainqueurTableauSearch.id_gagnant._id ===
              vainqueurTableau._id,
          };

          details.push(
            (pronoVainqueurCorrect
              ? "<span class='detailsGagne'>GAGNÉ</span>"
              : "<span class='detailsPerdu'>PERDU</span>") +
              ' : <b>Vainqueur ' +
              round.tableau.nom
                .split(' ')
                .map((l: string) => l[0].toUpperCase() + l.substr(1))
                .join(' ') +
              '</b>' +
              ' : pari sur ' +
              pronoVainqueurTableauSearch.id_gagnant.nom +
              (pronoVainqueurTableauSearch.id_gagnant._id !==
              vainqueurTableau._id
                ? ' contre ' + vainqueurTableau.nom
                : '') +
              ' : <b>' +
              (score - ptsGagnePerduVainqueur) +
              (ptsGagnePerduVainqueur >= 0 ? '+' : '') +
              ptsGagnePerduVainqueur +
              ' = ' +
              score +
              ' pt' +
              (score > 1 || score < 0 ? 's' : '') +
              '</b><br>'
          );
        }
      }
    });
    return {
      score,
      details,
      parisVainqueursTableauxResults: [pariVainqueurTableau].filter(
        (pariVainqueurTableauFilter: PariVainqueurTableauResult) =>
          pariVainqueurTableauFilter !== null
      ),
    };
  }

  public initScoreParTableau(
    tableauxPariables: PariableTableauInterface[]
  ): void {
    tableauxPariables.forEach((tableauPariable: PariableTableauInterface) => {
      const findIndexTableauPhaseFinale = this.scoresParTableauPhase.findIndex(
        (scoreParTableauPhase: ScoreTableauPhaseInterface) =>
          scoreParTableauPhase.tableau._id === tableauPariable.tableau._id &&
          scoreParTableauPhase.phase === 'finale'
      );
      if (findIndexTableauPhaseFinale === -1) {
        this.scoresParTableauPhase.push({
          tableau: tableauPariable.tableau,
          phase: 'finale',
          rounds: [],
          paris: [],
          waiting: false,
          pronos_vainqueurs: [],
        });
      } else {
        this.scoresParTableauPhase[findIndexTableauPhaseFinale].tableau =
          tableauPariable.tableau;
      }

      if (
        tableauPariable.tableau.consolante &&
        tableauPariable.tableau.consolantePariable
      ) {
        const findIndexTableauPhaseConsolante =
          this.scoresParTableauPhase.findIndex(
            (scoreParTableauPhase: ScoreTableauPhaseInterface) =>
              scoreParTableauPhase.tableau._id ===
                tableauPariable.tableau._id &&
              scoreParTableauPhase.phase === 'consolante'
          );

        if (findIndexTableauPhaseConsolante === -1) {
          this.scoresParTableauPhase.push({
            tableau: tableauPariable.tableau,
            phase: 'consolante',
            rounds: [],
            paris: [],
            waiting: false,
          });
        } else {
          this.scoresParTableauPhase[findIndexTableauPhaseConsolante].tableau =
            tableauPariable.tableau;
        }
      }
    });

    // On clean scoresParTableauPhase si des tableaux ont été supprimés ou rendus non pariables
    this.scoresParTableauPhase.forEach(
      (scoreParTableauPhase: ScoreTableauPhaseInterface) => {
        const indexSearchFinale = tableauxPariables.findIndex(
          (tableauPariable: PariableTableauInterface) =>
            tableauPariable.tableau._id === scoreParTableauPhase.tableau._id
        );
        if (indexSearchFinale === -1) {
          delete this.scoresParTableauPhase[indexSearchFinale];
        }

        const indexSearchConsolante = tableauxPariables.findIndex(
          (tableauPariable: PariableTableauInterface) =>
            tableauPariable.tableau._id === scoreParTableauPhase.tableau._id &&
            scoreParTableauPhase.phase === 'consolante' &&
            !tableauPariable.tableau.consolantePariable
        );
        if (indexSearchConsolante === -1) {
          delete this.scoresParTableauPhase[indexSearchConsolante];
        }
      }
    );
  }

  updateScoreTableauPhaseWaiting(
    _idTableau: string,
    phase: string,
    waiting: boolean,
    pronosVainqueurs?: PronoVainqueur[],
    rounds?: RoundInterface[],
    paris?: PariInterface[]
  ): void {
    this.scoresParTableauPhase.find(
      (scoreTableauPhase: ScoreTableauPhaseInterface) =>
        scoreTableauPhase.phase === phase &&
        scoreTableauPhase.tableau._id === _idTableau
    ).waiting = waiting;

    if (
      rounds !== undefined &&
      paris !== undefined &&
      pronosVainqueurs !== undefined
    ) {
      this.scoresParTableauPhase.find(
        (scoreTableauPhase: ScoreTableauPhaseInterface) =>
          scoreTableauPhase.phase === phase &&
          scoreTableauPhase.tableau._id === _idTableau
      ).rounds = rounds;

      this.scoresParTableauPhase.find(
        (scoreTableauPhase: ScoreTableauPhaseInterface) =>
          scoreTableauPhase.phase === phase &&
          scoreTableauPhase.tableau._id === _idTableau
      ).paris = paris;

      this.scoresParTableauPhase.find(
        (scoreTableauPhase: ScoreTableauPhaseInterface) =>
          scoreTableauPhase.phase === phase &&
          scoreTableauPhase.tableau._id === _idTableau
      ).pronos_vainqueurs = pronosVainqueurs;
    }

    if (
      !waiting &&
      this.scoresParTableauPhase.filter(
        (scoreParTableauPhase: ScoreTableauPhaseInterface) =>
          scoreParTableauPhase.waiting
      ).length === 0
    ) {
      this.getScoreGeneral();
    }
  }

  getScoreGeneral(): void {
    const resultatJoueur: ResultatPariJoueur = {
      details: [],
      score: 0,
      parisVainqueursTableauxResults: [],
    };

    this.scoresParTableauPhase.forEach(
      (scoreParTableauPhase: ScoreTableauPhaseInterface) => {
        const resultatPariJoueur: ResultatPariJoueur =
          this.calculateScoreTableauPhase(
            scoreParTableauPhase.rounds,
            scoreParTableauPhase.paris,
            scoreParTableauPhase.pronos_vainqueurs
          );
        resultatJoueur.score += resultatPariJoueur.score;
        resultatJoueur.details.push(...resultatPariJoueur.details);

        if (
          resultatPariJoueur.parisVainqueursTableauxResults.filter(
            (pariVainqueurTableauResult: PariVainqueurTableauResult) =>
              pariVainqueurTableauResult !== null
          ).length > 0
        ) {
          resultatJoueur.parisVainqueursTableauxResults.push(
            ...resultatPariJoueur.parisVainqueursTableauxResults
          );
        }
      }
    );
    this.updateScorePariJoueur.next(resultatJoueur);
  }
}
