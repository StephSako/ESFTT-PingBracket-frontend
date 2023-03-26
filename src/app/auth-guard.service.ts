import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AccountService } from './Service/account.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.accountService.isLoggedIn()) {
      return true;
    } else {
      this.accountService.logout();
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
