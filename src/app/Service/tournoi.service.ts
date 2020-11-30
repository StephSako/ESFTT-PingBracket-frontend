import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {JoueurInterface} from '../Interface/Joueur';
import {PouleInterface} from '../Interface/Poule';

@Injectable({
  providedIn: 'root'
})
export class TournoiService {

  private baseURL = 'http://localhost:4000/api/match/';

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public edit(actualRound: number, actualIdMatch: number, winnerId: number, looserId: number): Observable<any> {
    return this.http.put(`${this.baseURL}edit/round/${actualRound}/match/${actualIdMatch}`, {winnerId, looserId});
  }

  public generateBracket(poules: PouleInterface[], type: string): Observable<any> {
    return this.http.put(`${this.baseURL}generate_bracket/${type}`, poules);
  }
}
