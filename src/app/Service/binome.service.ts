import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoueurInterface } from '../Interface/Joueur';
import { environment } from '../../environments/environment';
import { ChapeauxInterface } from '../Interface/Binome';

@Injectable({
  providedIn: 'root',
})
export class BinomeService {
  private baseURL = environment.endpointNodeApi + 'binome/';

  constructor(private http: HttpClient) {}

  public getAll(tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}${tableau}`);
  }

  public editBinome(
    oldIdBinome: string,
    newIdBinome: string,
    newPlayersList: [id: JoueurInterface],
    idJoueur: string
  ): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${idJoueur}`, {
      oldIdBinome,
      newIdBinome,
      newPlayersList,
      idJoueur,
    });
  }

  public removePlayer(idBinome: string, idPlayer: string): Observable<any> {
    return this.http.delete(
      `${this.baseURL}remove_player/${idBinome}/${idPlayer}`
    );
  }

  public removeAll(tableau: string): Observable<any> {
    return this.http.delete(`${this.baseURL}reset/${tableau}`);
  }

  // Si un tableau devient un format 'double', on créé ses binômes
  public generateBinomes(tableau: string): Observable<any> {
    return this.http.put(`${this.baseURL}generate/${tableau}`, null);
  }

  getChapeaux(listJoueurs: JoueurInterface[]): ChapeauxInterface {
    const listJoueursLength =
      listJoueurs.length % 2 === 0
        ? listJoueurs.length / 2
        : listJoueurs.length / 2 - 0.5;

    const chapeauHaut = this.sortPlayerslist(listJoueurs, 0, listJoueursLength);
    const chapeauBas = this.sortPlayerslist(
      listJoueurs,
      listJoueursLength,
      listJoueurs.length
    );

    return {
      chapeauHaut,
      chapeauBas,
    };
  }

  sortPlayerslist(
    listJoueurs: JoueurInterface[],
    min: number,
    max: number
  ): JoueurInterface[] {
    return listJoueurs
      .sort((j1, j2) =>
        j1.classement < j2.classement
          ? 1
          : j1.classement > j2.classement
          ? -1
          : j1.nom.localeCompare(j2.nom)
      )
      .slice(min, max);
  }
}
