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

  public getTableauPlayers(tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}${tableau}`);
  }

  public getAll(): Observable<any> { // TODO ALL PLAYS EXCEPT IN CURRENT TABLEAU
    return this.http.get(this.baseURL);
  }

  public create(tableau: string, joueur: JoueurInterface): Observable<any> {
    return this.http.post(`${this.baseURL}create/tableau/${tableau}`, joueur);
  }

  public edit(tableau: string, joueur: JoueurInterface): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${joueur._id}/tableau/${tableau}`, joueur);
  }

  public delete(tableau: string, id_joueur: number): Observable<any> {
    return this.http.delete(`${this.baseURL}delete/${id_joueur}/tableau/${tableau}`);
  }
}
