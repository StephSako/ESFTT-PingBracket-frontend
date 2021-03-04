import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoueurInterface } from '../Interface/Joueur';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BinomeService {

  private baseURL = environment.endpointNodeApi + 'binome/';

  constructor(private http: HttpClient) { }

  public getAll(tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}${tableau}`);
  }

  public editBinome(oldIdBinome: string, newIdBinome: string, newPlayersList: [id: JoueurInterface], idJoueur: string): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${idJoueur}`, { oldIdBinome, newIdBinome, newPlayersList, idJoueur });
  }

  public removePlayer(idBinome: string, idPlayer: string): Observable<any> {
    return this.http.delete(`${this.baseURL}remove_player/${idBinome}/${idPlayer}`);
  }

  public removeAll(tableau: string): Observable<any> {
    return this.http.delete(`${this.baseURL}reset/${tableau}`);
  }

  public generate(tableau: string): Observable<any> {
    return this.http.put(`${this.baseURL}generate/${tableau}`, null);
  }
}
