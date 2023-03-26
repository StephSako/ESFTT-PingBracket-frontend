import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuardService } from './auth-guard.service';
import { AuthInterceptorInterceptor } from './Service/auth-interceptor.interceptor';
import { UnauthGuardService } from './unauth-guard.service';

@NgModule({
  providers: [
    AuthGuardService,
    UnauthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModules {}
