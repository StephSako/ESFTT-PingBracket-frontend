import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoueurInterface } from '../Interface/Joueur';
import { BinomeInterface } from '../Interface/Binome';

@Injectable({
  providedIn: 'root'
})
export class BinomeService {

  private baseURL = 'http://localhost:4000/api/binome/';

  constructor(private http: HttpClient) { }

  public getAll(tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}${tableau}`);
  }

  public editBinome(oldIdBinome: string, newIdBinome: string, newPlayersList: [id: JoueurInterface], idJoueur: string): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${idJoueur}`, { oldIdBinome, newIdBinome, newPlayersList, idJoueur });
  }

  public setStatus(binome: BinomeInterface): Observable<any> {
    return this.http.put(`${this.baseURL}editStatus/${binome._id}`, { locked: !binome.locked });
  }

  public removePlayer(idBinome: string, idPlayer: string): Observable<any> {
    return this.http.delete(`${this.baseURL}remove_player/${idBinome}/${idPlayer}`);
  }
}
