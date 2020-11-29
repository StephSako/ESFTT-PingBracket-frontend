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

  public create(joueur: JoueurInterface): Observable<any> { // TODO UPDATE LES POULES
    return this.http.post(this.baseURL + 'create', joueur);
  }

  public edit(joueur: JoueurInterface): Observable<any> { // TODO UPDATE LES POULES
    return this.http.put(`${this.baseURL}edit/${joueur._id}`, joueur);
  }

  public delete(id_joueur: number): Observable<any> { // TODO UPDATE LES POULES
    return this.http.delete(`${this.baseURL}delete/${id_joueur}`);
  }
}
