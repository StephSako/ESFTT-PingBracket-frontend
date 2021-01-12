import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuffetInterface } from '../Interface/Buffet';

@Injectable({
  providedIn: 'root'
})
export class BuffetService {

  private baseURL = 'http://localhost:4000/api/buffet/';

  constructor(private http: HttpClient) { }

  public getBuffet(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public edit(buffet: BuffetInterface): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${buffet._id}`, {buffet});
  }

  public platsAlreadyCooked(): Observable<any> {
    return this.http.get(`${this.baseURL}platsAlreadyCooked`);
  }

  public register(buffet: BuffetInterface): Observable<any> {
    return this.http.post(`${this.baseURL}register`, buffet);
  }
}
