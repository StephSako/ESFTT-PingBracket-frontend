import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  TokenPayloadLogin,
  TokenResponse,
  UserInterface,
} from '../Interface/Account';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseURL = environment.endpointNodeApi + 'account/';
  private token: string;
  private idParieur: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('userToken', token);
    this.launchAutoLogout();
  }

  public login(user: TokenPayloadLogin): Observable<any> {
    return this.http.post(this.baseURL + 'login', user).pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      }),
      catchError((err) => throwError(err))
    );
  }

  public editUsername(username: string): Observable<any> {
    const _id = this.getUserDetails()._id;
    const URL = this.http.put(`${this.baseURL}edit/username`, {
      username,
      _id,
    });

    return URL.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      }),
      catchError((err) => throwError(err))
    );
  }

  public editPassword(
    actualPassword: string,
    newPassword: string
  ): Observable<any> {
    const _id = this.getUserDetails()._id;
    const URL = this.http.put(`${this.baseURL}edit/password`, {
      actualPassword,
      newPassword,
      _id,
    });

    return URL.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      }),
      catchError((err) => throwError(err))
    );
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('userToken');
    }
    return this.token;
  }

  public getUserDetails(): UserInterface {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    return user ? user.exp * 1000 > Date.now() : false;
  }

  public logout(): void {
    this.token = '';
    localStorage.removeItem('userToken');
    this.router.navigateByUrl('/login');
  }

  public launchAutoLogout(): void {
    setTimeout(() => {
      this.logout();
    }, this.getUserDetails().exp * 1000 - Date.now());
  }

  public getIdParieur(): string {
    if (!this.idParieur) {
      this.idParieur = localStorage.getItem('parieurId');
    }
    return this.idParieur;
  }

  public saveIdParieur(idParieur: string): void {
    this.idParieur = idParieur;
    localStorage.setItem('parieurId', idParieur);
    this.launchAutoLogout();
  }

  public logoutParieur(): void {
    this.idParieur = '';
    localStorage.removeItem('parieurId');
    // this.router.navigateByUrl('/formulaire'); // TODO REDIRIGER VERS LA PAGE DE CONNEXION DES PARIS
  }
}
