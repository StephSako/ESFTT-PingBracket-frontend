import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private authService: AccountService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.authService.getToken()) {
      return next.handle(request);
    }
    request = request.clone({
      setHeaders: {
        Authorization: (this.authService.getToken() ? this.authService.getToken() : 'ANONYMOUSLY_LOGGED')
      }
    });
    return next.handle(request);
  }
}
