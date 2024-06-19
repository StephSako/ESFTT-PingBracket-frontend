import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InfosParisJoueurInterface, PariInterface } from '../Interface/Pari';

@Injectable({
  providedIn: 'root',
})
export class PariService {
  private baseURL = environment.endpointNodeApi + 'paris/';
  updateParisLoggIn = new Subject();
  updateInfoParisJoueur = new BehaviorSubject<InfosParisJoueurInterface>(null);
  updateListeParisMatches = new BehaviorSubject<PariInterface[]>(null);
  addPariToListeParisMatches = new BehaviorSubject<PariInterface>(null);
  deletePariToListeParisMatches = new BehaviorSubject<PariInterface>(null);

  constructor(private http: HttpClient) {}

  // public getAll(): Observable<any> {
  //   return this.http.get(this.baseURL);
  // }

  //TODO Calcul des paris de parieur
  public getAllParisJoueur(idJoueur: string): Observable<any> {
    return this.http.get(`${this.baseURL}${idJoueur.toLowerCase()}`);
  }

  public addPariFromMatch(
    fichePariId: string,
    pariFromMatch: PariInterface
  ): Observable<any> {
    return this.http.post(`${this.baseURL}addPariFromMatch/${fichePariId}`, {
      pariFromMatch,
    });
  }

  public parierVainqueur(
    id_parieur: string,
    id_vainqueur: string
  ): Observable<any> {
    return this.http.post(`${this.baseURL}vainqueur`, {
      id_parieur,
      id_vainqueur,
    });
  }

  public cancel(
    fichePariId: string,
    pariMatch: PariInterface
  ): Observable<any> {
    return this.http.put(`${this.baseURL}cancel/${fichePariId}`, { pariMatch });
  }
}
