import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BracketService {
  private baseURL = environment.endpointNodeApi + 'bracket/';
  public updateBracket: EventEmitter<void> = new EventEmitter();

  constructor(private http: HttpClient) {}

  public getBracket(
    tableau: string,
    phase: string,
    isPari: boolean,
    parieurId: string
  ): Observable<any> {
    return this.http.get(
      `${this.baseURL}${tableau}/${phase}/${isPari}/${parieurId}`
    );
  }

  public edit(
    tableau: string,
    round: number,
    idMatch: number,
    winnerId: string,
    looserId: string,
    phase: string
  ): Observable<any> {
    return this.http.put(
      `${this.baseURL}edit/${tableau}/${phase}/${round}/${idMatch}`,
      { winnerId, looserId }
    );
  }

  public lockMatchToBets(
    tableau: string,
    round: number,
    idMatch: number,
    phase: string,
    isLocked: boolean
  ): Observable<any> {
    return this.http.put(
      `${this.baseURL}lock-paris/match/${tableau}/${phase}/${idMatch}/${round}`,
      { isLocked }
    );
  }

  public generateBracket(
    bracket: string,
    format: string,
    phase: string,
    poules: boolean,
    maxNumberPlayers: number,
    palierQualifies: number,
    palierConsolantes: number,
    pariable: boolean,
    consolantePariable: boolean
  ): Observable<any> {
    return this.http.put(`${this.baseURL}generate/${bracket}/${phase}`, {
      format,
      poules,
      maxNumberPlayers,
      palierQualifies,
      palierConsolantes,
      pariable,
      consolantePariable,
    });
  }

  public deleteBracket(idTableau: string): Observable<any> {
    return this.http.delete(`${this.baseURL}delete/${idTableau}`);
  }

  public cancelMatchResult(
    tableau_id: string,
    phase: string,
    match_id: number,
    match_round: number,
    winner_id: string,
    looser_id: string
  ): Observable<any> {
    return this.http.put(
      `${this.baseURL}cancel/match/result/${tableau_id}/${phase}/${match_id}/${match_round}/${winner_id}/${looser_id}`,
      {}
    );
  }

  getLibelleRound(round: number, idMatch: number): string {
    switch (round) {
      case 1:
        return idMatch === 1 ? 'Finale' : 'Petite finale';
      case 2:
        return 'Demi-finale';
      case 3:
        return 'Quart';
      case 4:
        return '8ème';
      case 5:
        return '16ème';
      case 6:
        return '32ème';
      case 7:
        return '64ème';
    }
  }
}
