import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuffetInterface } from '../Interface/Buffet';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuffetService {

  private baseURL = environment.endpointNodeApi + 'buffet/';

  constructor(private http: HttpClient) { }

  public getBuffet(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public platsAlreadyCooked(): Observable<any> {
    return this.http.get(`${this.baseURL}platsAlreadyCooked`);
  }

  public register(buffet: BuffetInterface): Observable<any> {
    return this.http.post(`${this.baseURL}register`, buffet);
  }

  public edit(buffet: BuffetInterface): Observable<any> {
    return this.http.post(`${this.baseURL}edit`, buffet);
  }
}
