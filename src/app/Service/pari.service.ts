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
  updateScorePariJoueur = new BehaviorSubject<number>(null);

  public scoresParTableauPhase: ScoreTableauPhaseInterface[] = [];

  constructor(private http: HttpClient) {}

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

  public calculateScoreTableauPhase(
    rounds: RoundInterface[],
    paris: PariInterface[]
  ): number {
    let score = 0;

    if (paris.length === 0) {
      return score;
    }

    rounds.forEach((round: RoundInterface) => {
      let matches = round.matches.filter(
        (match: MatchInterface) =>
          match.joueurs.length === 2 &&
          match.joueurs.filter(
            (joueur: JoueurMatchInterface) => joueur.winner === true
          ).length === 1 &&
          match.isLockToBets
      );

      matches.forEach((match: MatchInterface) => {
        let indexPari = paris.findIndex(
          (pari: PariInterface) =>
            pari.id_tableau === round.tableau._id &&
            pari.phase === round.phase &&
            pari.id_match === match.id &&
            pari.round === match.round
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
                ? round.tableau.ptsGagnesParisWB
                : round.tableau.ptsGagnesParisLB;
          } // Le pari est incorrect
          else {
            score +=
              paris[indexPari].phase === 'finale'
                ? round.tableau.ptsPerdusParisWB
                : round.tableau.ptsPerdusParisLB;
          }
        }
      });
    });
    return score;
  }

  public initScoreParTableau(
    tableauxPariables: PariableTableauInterface[]
  ): void {
    tableauxPariables.forEach((tableauPariable: PariableTableauInterface) => {
      let findIndexTableauPhaseFinale = this.scoresParTableauPhase.findIndex(
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
        });
      } else {
        this.scoresParTableauPhase[findIndexTableauPhaseFinale].tableau =
          tableauPariable.tableau;
      }

      if (
        tableauPariable.tableau.consolante &&
        tableauPariable.tableau.consolantePariable
      ) {
        let findIndexTableauPhaseConsolante =
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
        let indexSearchFinale = tableauxPariables.findIndex(
          (tableauPariable: PariableTableauInterface) =>
            tableauPariable.tableau._id === scoreParTableauPhase.tableau._id
        );
        if (indexSearchFinale === -1) {
          delete this.scoresParTableauPhase[indexSearchFinale];
        }

        let indexSearchConsolante = tableauxPariables.findIndex(
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
    rounds?: RoundInterface[],
    paris?: PariInterface[]
  ): void {
    this.scoresParTableauPhase.find(
      (scoreTableauPhase: ScoreTableauPhaseInterface) =>
        scoreTableauPhase.phase === phase &&
        scoreTableauPhase.tableau._id === _idTableau
    ).waiting = waiting;

    if (rounds !== undefined && paris !== undefined) {
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
    let scoreGeneral = 0;
    this.scoresParTableauPhase.forEach(
      (scoreParTableauPhase: ScoreTableauPhaseInterface) => {
        scoreGeneral += this.calculateScoreTableauPhase(
          scoreParTableauPhase.rounds,
          scoreParTableauPhase.paris
        );
      }
    );
    this.updateScorePariJoueur.next(scoreGeneral);
  }
}
