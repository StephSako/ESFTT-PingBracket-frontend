import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BracketService {
  private baseURL = environment.endpointNodeApi + 'bracket/';

  constructor(private http: HttpClient) {}

  public getBracket(tableau: string, phase: string): Observable<any> {
    return this.http.get(`${this.baseURL}${tableau}/${phase}`);
  }

  public edit(
    tableau: string,
    actualRound: number,
    actualIdMatch: number,
    winnerId: string,
    looserId: string,
    phase: string
  ): Observable<any> {
    return this.http.put(
      `${this.baseURL}edit/${tableau}/${phase}/${actualRound}/${actualIdMatch}`,
      { winnerId, looserId }
    );
  }

  public generateBracket(
    bracket: string,
    format: string,
    phase: string,
    poules: boolean,
    maxNumberPlayers: number
  ): Observable<any> {
    return this.http.put(`${this.baseURL}generate/${bracket}/${phase}`, {
      format,
      poules,
      maxNumberPlayers,
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
    winner_id: string
  ): Observable<any> {
    return this.http.put(
      `${this.baseURL}cancel/match/result/${tableau_id}/${phase}/${match_id}/${match_round}/${winner_id}`,
      {}
    );
  }
}
