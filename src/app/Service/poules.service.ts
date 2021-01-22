import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoueurInterface } from '../Interface/Joueur';
import { PouleInterface } from '../Interface/Poule';

@Injectable({
  providedIn: 'root'
})
export class PoulesService {

  private baseURL = 'http://localhost:4000/api/poule/';

  constructor(private http: HttpClient) { }

  public getAll(tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}${tableau}`);
  }

  public editPoule(id_poule: string, newPlayersList: [id: JoueurInterface]): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${id_poule}`, newPlayersList);
  }

  public setStatus(poule: PouleInterface): Observable<any> {
    return this.http.put(`${this.baseURL}editStatus/${poule._id}`, { locked: !poule.locked });
  }

  public generatePoules(tableau: string): Observable<any> {
    return this.http.put(`${this.baseURL}generate/${tableau}`, null);
  }
}
