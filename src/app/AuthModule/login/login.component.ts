import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { TokenPayloadLogin } from '../../Interface/Account';
import { AccountService } from '../../Service/account.service';
import { NotifyService } from '../../Service/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  spinnerShown: boolean;

  public credentials: TokenPayloadLogin = {
    username: '',
    password: '',
  };

  constructor(private authService: AccountService, private router: Router, private snackBar: MatSnackBar,
              private notifyService: NotifyService, private titleService: Title) {
    this.titleService.setTitle('Tournoi ESFTT');
  }

  ngOnInit(): void { this.spinnerShown = false; }

  login(): void {
    if (this.credentials.username !== null && this.credentials.username !== '' && this.credentials.password !== null
      && this.credentials.password !== '') {
      this.spinnerShown = true;
      this.authService.login(this.credentials)
        .subscribe(
          () => {
            this.spinnerShown = false;
            this.router.navigateByUrl('/gestion');
          },
          err => {
            this.spinnerShown = false;
            this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
          }
        );
    }
  }

}
