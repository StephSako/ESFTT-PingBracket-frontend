import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PariInterface, ParisJoueurInterface } from '../Interface/Pari';

@Injectable({
  providedIn: 'root',
})
export class PariService {
  private baseURL = environment.endpointNodeApi + 'paris/';

  constructor(private http: HttpClient) {}

  public getAll(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public bet(pari: ParisJoueurInterface): Observable<any> {
    return this.http.post(`${this.baseURL}create`, { pari });
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
