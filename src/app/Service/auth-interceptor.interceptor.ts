import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private authService: AccountService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: (this.authService.getToken() ? this.authService.getToken() : environment.anonymousHeader)
      }
    });
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status && err.status === 401) this.authService.logout();
        err.error = "Votre session est terminée";
        throw err;
      }),
      map((res: any) => res));
  }
}
