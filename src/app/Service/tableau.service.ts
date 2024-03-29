import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { TableauInterface } from '../Interface/Tableau';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TableauService {
  private baseURL = environment.endpointNodeApi + 'tableau/';
  listeJoueurs = new Subject();
  tableauxSource = new Subject();
  tableauxEditSource = new Subject();
  tableauxChange: EventEmitter<void> = new EventEmitter();
  nbInscritsChange: EventEmitter<void> = new EventEmitter();

  constructor(private http: HttpClient) {}

  public getAllTableaux(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public tableauEnabledToHostPlayers(
    tableau: TableauInterface
  ): Observable<any> {
    return this.http.get(
      `${this.baseURL}hostable/${tableau._id}/${tableau.age_minimum}/${tableau.format}/${tableau.poules}`
    );
  }

  public getTableau(id_tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}${id_tableau}`);
  }

  public getPlayerCountPerTableau(): Observable<any> {
    return this.http.get(`${this.baseURL}player_count`);
  }

  public create(tableau: TableauInterface): Observable<any> {
    return this.http.post(`${this.baseURL}create`, tableau);
  }

  public edit(tableau: TableauInterface): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${tableau._id}`, tableau);
  }

  public changeLaunchState(tableau: TableauInterface): Observable<any> {
    return this.http.put(`${this.baseURL}change_launch_state/${tableau._id}`, {
      is_launched: tableau.is_launched,
    });
  }

  public unsubscribeInvalidPlayers(tableau: TableauInterface): Observable<any> {
    return this.http.put(
      `${this.baseURL}unsubscribe/invalid/${tableau._id}`,
      tableau
    );
  }

  public reset(): Observable<any> {
    return this.http.delete(`${this.baseURL}reset`);
  }

  public delete(tableau: TableauInterface): Observable<any> {
    return this.http.delete(
      `${this.baseURL}delete/${tableau._id}/${tableau.format}/${tableau.poules}`
    );
  }

  public unsubscribeAllPlayers(tableau_id: string): Observable<any> {
    return this.http.put(`${this.baseURL}unsubscribe_all`, { tableau_id });
  }
}
