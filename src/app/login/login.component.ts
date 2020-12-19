import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TokenPayloadLogin } from '../Interface/Account';
import { AccountService } from '../Service/account.service';
import { NotifyService } from '../Service/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  spinnerShown: boolean;

  credentials: TokenPayloadLogin = {
    username: '',
    password: '',
  };

  loginControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);

  constructor(private authService: AccountService, private router: Router, private snackBar: MatSnackBar,
              private notifyService: NotifyService, private titleService: Title) {
    this.titleService.setTitle('Tournoi ESFTT');
  }

  ngOnInit(): void { this.spinnerShown = false; }

  getErrorMessageLogin(): string {
    if (this.loginControl.hasError('required')) {
      return 'Username obligatoire';
    }
  }

  getErrorMessagePassword(): string {
    if (this.passwordControl.hasError('required')) {
      return 'Mot de passe obligatoire';
    }
  }

  login(): void {
    if (this.credentials.username !== null && this.credentials.username !== '' && this.credentials.password !== null
      && this.credentials.password !== '') {
      this.spinnerShown = true;
      this.authService.login(this.credentials)
        .subscribe(
          () => {
            this.spinnerShown = false;
            this.router.navigateByUrl('/home');
          },
          err => {
            this.spinnerShown = false;
            this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
          }
        );
    }
  }

}
