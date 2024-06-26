import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AccountService } from './Service/account.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(): boolean {
    if (this.accountService.isLoggedIn()) {
      return true;
    } else {
      this.accountService.logout();
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
