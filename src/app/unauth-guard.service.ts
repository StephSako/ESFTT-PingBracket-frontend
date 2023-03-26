import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AccountService } from './Service/account.service';

@Injectable()
export class UnauthGuardService implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (state.url === '/login' && !this.accountService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigateByUrl('/gestion');
      return false;
    }
  }
}
