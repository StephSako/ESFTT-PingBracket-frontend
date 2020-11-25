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

  public getAll(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public edit(joueur: JoueurInterface): Observable<any> {
    return this.http.put(this.baseURL, joueur);
  }

  public delete(id_joueur: number): Observable<any> {
    return this.http.delete(`${this.baseURL}delete/${id_joueur}`);
  }
}
