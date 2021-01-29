import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockInterface } from '../Interface/Stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private baseURL = 'http://localhost:4000/api/stock/';

  constructor(private http: HttpClient) { }

  public getAllStock(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public create(stock: StockInterface): Observable<any> {
    return this.http.post(`${this.baseURL}create`, { stock });
  }

  public delete(stock_id: string): Observable<any> {
    return this.http.delete(`${this.baseURL}delete/${stock_id}`);
  }

  public edit(stock: StockInterface): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${stock._id}`, {stock});
  }
}
