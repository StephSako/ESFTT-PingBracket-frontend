import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LogsInterface } from '../Interface/LogsInterface';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  private baseURL = environment.endpointNodeApi + 'logs/';

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public addLogs(log: string): Observable<any> {
    return this.http.put(`${this.baseURL}add`, { log });
  }
}