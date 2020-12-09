import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableauInterface } from '../Interface/Tableau';

@Injectable({
  providedIn: 'root'
})
export class GestionService {

  private baseURL = 'http://localhost:4000/api/gestion/';

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public getTableau(id_tableau: string): Observable<any> {
    return this.http.get(`${this.baseURL}${id_tableau}`);
  }

  public create(tableau: TableauInterface): Observable<any> {
    return this.http.post(`${this.baseURL}create`, tableau);
  }

  public edit(tableau: TableauInterface): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${tableau._id}`, tableau);
  }

  public reset(): Observable<any> {
    return this.http.delete(`${this.baseURL}reset`);
  }
}
