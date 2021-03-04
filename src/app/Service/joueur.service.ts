import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoueurInterface } from '../Interface/Joueur';
import {TableauInterface} from '../Interface/Tableau';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JoueurService {

  private baseURL = environment.endpointNodeApi + 'joueur/';

  constructor(private http: HttpClient) { }

  public getPlayer(id_joueur: string): Observable<any> {
    return this.http.get(`${this.baseURL}${id_joueur}`);
  }

  public getAllPlayers(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public getTableauPlayers(tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}subscribed/${tableau}`);
  }

  public getUnsubscribedPlayer(tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}unsubscribed/${tableau}`);
  }

  public create(tableaux: TableauInterface[], joueur: JoueurInterface): Observable<any> {
    return this.http.post(`${this.baseURL}create`, { joueur, tableaux });
  }

  public edit(joueur: JoueurInterface): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${joueur._id}`, joueur);
  }

  public unsubscribe(tableau: TableauInterface, id_joueur: string): Observable<any> {
    return this.http.put(`${this.baseURL}unsubscribe/${id_joueur}/${tableau._id}`, { format: tableau.format });
  }

  public delete(id_joueur: string): Observable<any> {
    return this.http.delete(`${this.baseURL}delete/${id_joueur}`);
  }

  public getSubscribedUnassignedDouble(tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}unassigned/${tableau}`);
  }

  public moveAllPlayers(previousTableauId: string, newTableauId: string): Observable<any> {
    return this.http.put(this.baseURL + 'move', {previousTableauId, newTableauId});
  }
}
