import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {TokenPayloadLogin, TokenResponse, UserInterface} from '../Interface/Account';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  private baseURL = 'http://localhost:4000/api/account/';
  private token: string;

  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token: string): void {
    localStorage.setItem('userToken', token);
    this.token = token;
  }

  public login(user: TokenPayloadLogin): Observable<any> {
    const URL = this.http.post(this.baseURL + 'login', user);

    return URL.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      }),
      catchError(err => {
        return throwError(err.error);
      })
    );
  }

  private getToken(): string {
    if (!this.token) { this.token = localStorage.getItem('userToken'); }
    return this.token;
  }

  public getUserDetails(): UserInterface {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) { return user.exp > Date.now() / 1000; }
    else { return false; }
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('userToken');
    this.router.navigateByUrl('/login').then(() => {});
  }
}