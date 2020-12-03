import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {JoueurInterface} from '../Interface/Joueur';

@Injectable({
  providedIn: 'root'
})
export class JoueurService {

  private baseURL = 'http://localhost:4000/api/joueur/';

  constructor(private http: HttpClient) { }

  public getAllPlayers(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public getTableauPlayers(tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}subscribed/${tableau}`);
  }

  public getOtherPlayer(tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}unsubscribed/${tableau}`);
  }

  public create(tableau: string, joueur: JoueurInterface): Observable<any> { // CREATE OR SUBSCRIBE PLAYER TO A SPECIFIC TABLEAU
    return this.http.post(`${this.baseURL}create/tableau/${tableau}`, joueur);
  }

  public edit(joueur: JoueurInterface): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${joueur._id}`, joueur);
  }

  public unsubscribe(tableau: string, id_joueur: number): Observable<any> {
    return this.http.delete(`${this.baseURL}unsubscribe/${id_joueur}/tableau/${tableau}`);
  }
}
