import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  InfosParisJoueurInterface,
  PariInterface,
  ReglePointsParis,
} from '../Interface/Pari';
import { RoundInterface } from '../Interface/Bracket';
import { JoueurMatchInterface, MatchInterface } from '../Interface/Match';

@Injectable({
  providedIn: 'root',
})
export class PariService {
  private baseURL = environment.endpointNodeApi + 'paris/';
  updateParisLoggIn = new Subject();
  updateInfoParisJoueur = new BehaviorSubject<InfosParisJoueurInterface>(null);
  updateListeParisMatches = new BehaviorSubject<PariInterface[]>(null);
  addPariToListeParisMatches = new BehaviorSubject<PariInterface>(null);
  deletePariToListeParisMatches = new BehaviorSubject<PariInterface>(null);
  getScorePariJoueur = new BehaviorSubject<number>(null);

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
  public calculateScore(
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
    // console.log(score);
    return score;
  }
}
