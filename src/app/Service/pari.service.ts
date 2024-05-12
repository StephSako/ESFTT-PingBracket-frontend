import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PariInterface, ParisJoueurInterface } from '../Interface/Pari';

@Injectable({
  providedIn: 'root',
})
export class PariService {
  private baseURL = environment.endpointNodeApi + 'paris/';
  listeParisJoueurLoggedIn = new Subject();
  updatePariMatch = new BehaviorSubject({});

  constructor(private http: HttpClient) {}

  public getAll(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public getAllParisJoueur(idJoueur: string): Observable<any> {
    return this.http.get(`${this.baseURL}/${idJoueur}`);
  }

  public createPari(pari: ParisJoueurInterface): Observable<any> {
    return this.http.post(`${this.baseURL}createPari`, { pari });
  }

  public addPariFromMatch(pariFromMatch: PariInterface): Observable<any> {
    return this.http.post(`${this.baseURL}addPariFromMatch`, { pariFromMatch });
  }

  public updateVainqueur(
    idParieur: string,
    idVainqueur: string
  ): Observable<any> {
    return this.http.post(`${this.baseURL}updateVainqueur`, {
      idParieur,
      idVainqueur,
    });
  }

  public update(pari: PariInterface): Observable<any> {
    return this.http.put(`${this.baseURL}update`, { pari });
  }

  public cancel(id_pari: string): Observable<any> {
    return this.http.delete(`${this.baseURL}cancel/${id_pari}`);
  }

  public deleteAll(): Observable<any> {
    return this.http.delete(`${this.baseURL}deleteAll`);
  }
}
