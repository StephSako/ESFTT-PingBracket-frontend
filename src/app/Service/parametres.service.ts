import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParametreInterface } from '../Interface/Parametre';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ParametresService {

  private baseURL = environment.endpointNodeApi + 'parametre/';

  constructor(private http: HttpClient) { }

  public getParametres(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public edit(parametres: ParametreInterface): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${parametres._id}`, {parametres});
  }

  public reset(): Observable<any> {
    return this.http.delete(this.baseURL);
  }

  public openCloseFormulaire(parametres_id: string, open: boolean): Observable<any> {
    return this.http.put(`${this.baseURL}change_form_state/${parametres_id}`, {open});
  }
}
