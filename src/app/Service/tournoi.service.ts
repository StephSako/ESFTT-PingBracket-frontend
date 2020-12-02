import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PouleInterface } from '../Interface/Poule';

@Injectable({
  providedIn: 'root'
})
export class TournoiService {

  private baseURL = 'http://localhost:4000/api/tableau/';

  constructor(private http: HttpClient) { }

  public getBracket(tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}${tableau}`);
  }

  public edit(tableau: string, actualRound: number, actualIdMatch: number, winnerId: string, looserId: string): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${tableau}/round/${actualRound}/match/${actualIdMatch}`, {winnerId, looserId});
  }

  public generateBracket(tableau: string, poules: PouleInterface[]): Observable<any> {
    return this.http.put(`${this.baseURL}generate/${tableau}`, poules);
  }
}
