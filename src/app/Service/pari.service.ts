import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  InfosParisJoueurInterface,
  PariInterface,
  ReglePointsParis,
} from '../Interface/Pari';
import { RoundInterface } from '../Interface/Bracket';
import { JoueurMatchInterface, MatchInterface } from '../Interface/Match';
import { ScoreTableauPhaseInterface } from '../Interface/ScoreTableau';
import {
  PariableTableauInterface,
  TableauInterface,
} from '../Interface/Tableau';

@Injectable({
  providedIn: 'root',
})
export class PariService {
  private baseURL = environment.endpointNodeApi + 'paris/';
  updateParisLoggIn = new BehaviorSubject<boolean>(null);
  updateInfoParisJoueur = new BehaviorSubject<InfosParisJoueurInterface>(null);
  updateListeParisMatches = new BehaviorSubject<PariInterface[]>(null);
  addPariToListeParisMatches = new BehaviorSubject<PariInterface>(null);
  deletePariToListeParisMatches = new BehaviorSubject<PariInterface>(null);
  updateScorePariJoueur = new BehaviorSubject<number>(null);

  public scoresParTableauPhase: ScoreTableauPhaseInterface[] = [];

  constructor(private http: HttpClient) {}

  // public getAll(): Observable<any> {
  //   return this.http.get(this.baseURL);
  // }

  //TODO Calcul des paris de parieur
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
    id_vainqueur: string
  ): Observable<any> {
    return this.http.post(`${this.baseURL}vainqueur`, {
      id_parieur,
      id_vainqueur,
    });
  }

  public cancel(
    fichePariId: string,
    pariMatch: PariInterface
  ): Observable<any> {
    return this.http.put(`${this.baseURL}cancel/${fichePariId}`, { pariMatch });
  }

  //TODO Type de retour
  public calculateScoreTableauPhase(
    rounds: RoundInterface[],
    paris: PariInterface[],
    reglePointsParis: ReglePointsParis
  ): number {
    let score = 0;
    rounds.forEach((round: RoundInterface) => {
      round.matches.forEach((match: MatchInterface) => {
        let indexPari = paris.findIndex(
          (pari: PariInterface) =>
            pari.id_tableau === round.tableau._id &&
            pari.phase === round.phase &&
            pari.id_match === match.id &&
            pari.round === match.round &&
            match.joueurs.length === 2 &&
            match.joueurs.filter(
              (joueur: JoueurMatchInterface) => joueur.winner === true
            ).length === 1 &&
            match.isLockToBets
        );

        if (indexPari !== -1) {
          // Le pari est correct
          if (
            match.joueurs.find(
              (joueur: JoueurMatchInterface) =>
                joueur._id._id === paris[indexPari].id_gagnant
            ).winner
          ) {
            score +=
              paris[indexPari].phase === 'finale'
                ? reglePointsParis.ptsGagnesParisWB
                : reglePointsParis.ptsGagnesParisLB;
          } // Le pari est incorrect
          else {
            score +=
              paris[indexPari].phase === 'finale'
                ? reglePointsParis.ptsPerdusParisWB
                : reglePointsParis.ptsPerdusParisLB;
          }
        }
      });
    });
    return score;
  }

  public setScoreParTableau(
    tableauxPariables: PariableTableauInterface[]
  ): void {
    tableauxPariables.forEach((tableauPariable: PariableTableauInterface) => {
      this.scoresParTableauPhase.push({
        tableau: tableauPariable.tableau,
        phase: 'finale',
        rounds: [],
        paris: [],
        waiting: false,
      });

      if (
        tableauPariable.tableau.consolante &&
        tableauPariable.tableau.consolantePariable
      ) {
        this.scoresParTableauPhase.push({
          tableau: tableauPariable.tableau,
          phase: 'consolante',
          rounds: [],
          paris: [],
          waiting: false,
        });
      }
    });
  }

  updateScoreTableauPhaseWaiting(
    _idTableau: TableauInterface,
    phase: string,
    waiting: boolean,
    rounds?: RoundInterface[],
    paris?: PariInterface[]
  ): void {
    this.scoresParTableauPhase.find(
      (scoreTableauPhase: ScoreTableauPhaseInterface) =>
        scoreTableauPhase.phase === phase &&
        scoreTableauPhase.tableau === _idTableau
    ).waiting = waiting;

    if (rounds !== undefined && paris !== undefined) {
      this.scoresParTableauPhase.find(
        (scoreTableauPhase: ScoreTableauPhaseInterface) =>
          scoreTableauPhase.phase === phase &&
          scoreTableauPhase.tableau === _idTableau
      ).rounds = rounds;

      this.scoresParTableauPhase.find(
        (scoreTableauPhase: ScoreTableauPhaseInterface) =>
          scoreTableauPhase.phase === phase &&
          scoreTableauPhase.tableau === _idTableau
      ).paris = paris;
    }

    if (!waiting) {
      this.getScoreGeneral();
    }
  }

  getScoreGeneral(): void {
    if (
      this.scoresParTableauPhase.filter(
        (scoreParTableauPhase: ScoreTableauPhaseInterface) =>
          scoreParTableauPhase.waiting
      ).length === 0
    ) {
      let scoreGeneral = 0;
      this.scoresParTableauPhase.forEach(
        (scoreParTableauPhase: ScoreTableauPhaseInterface) => {
          scoreGeneral += this.calculateScoreTableauPhase(
            scoreParTableauPhase.rounds,
            scoreParTableauPhase.paris,
            {
              ptsGagnesParisWB: scoreParTableauPhase.tableau.ptsGagnesParisWB,
              ptsPerdusParisWB: scoreParTableauPhase.tableau.ptsPerdusParisWB,
              ptsGagnesParisLB: scoreParTableauPhase.tableau.ptsGagnesParisLB,
              ptsPerdusParisLB: scoreParTableauPhase.tableau.ptsPerdusParisLB,
            }
          );
        }
      );
      this.updateScorePariJoueur.next(scoreGeneral);
    }
  }
}
