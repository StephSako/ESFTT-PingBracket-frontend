import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoueurInterface } from '../Interface/Joueur';

@Injectable({
  providedIn: 'root'
})
export class PoulesService {

  private baseURL = 'http://localhost:4000/api/poule/';

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public edit(id_poule: string, newPlayersList: [id: JoueurInterface, points: number]): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${id_poule}`, newPlayersList);
  }
}
