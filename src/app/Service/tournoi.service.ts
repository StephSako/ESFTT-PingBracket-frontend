import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatchUpdate } from '../Interface/MatchUpdate';

@Injectable({
  providedIn: 'root'
})
export class TournoiService {

  private baseURL = 'http://localhost:4000/api/match/';

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public edit(matchUpdate: MatchUpdate): Observable<any> {
    return this.http.put(`${this.baseURL}edit/nextRound/${matchUpdate.nextRound}/nextMatch/${matchUpdate.nexIdMatch}`,
      {
        actualRound: matchUpdate.actualRound,
        actualIdMatch: matchUpdate.actualIdMatch,
        winnerId: matchUpdate.winnerId
      });
  }
}
