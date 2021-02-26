import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BracketService {

  private baseURL = 'http://localhost:4000/api/bracket/';

  constructor(private http: HttpClient) { }

  public getBracket(tableau: string, phase: string): Observable<any> {
    return this.http.get(`${this.baseURL}${tableau}/${phase}`);
  }

  public edit(tableau: string, actualRound: number, actualIdMatch: number, winnerId: string, looserId: string, phase: string):
    Observable<any> {
    return this.http.put(`${this.baseURL}edit/${tableau}/${phase}/${actualRound}/${actualIdMatch}`, {winnerId, looserId});
  }

  public generateBracket(bracket: string, format: string, phase: string, poules: boolean): Observable<any> {
    return this.http.put(`${this.baseURL}generate/${bracket}/${phase}`, { format, poules });
  }

  public deleteBracket(idTableau: string): Observable<any> {
    return this.http.delete(`${this.baseURL}delete/${idTableau}`);
  }
}
