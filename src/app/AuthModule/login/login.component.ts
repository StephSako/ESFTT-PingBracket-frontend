import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { AccountService } from '../../Service/account.service';
import { NotifyService } from '../../Service/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(private authService: AccountService, private router: Router, private snackBar: MatSnackBar,
              private notifyService: NotifyService, private titleService: Title) {
    this.titleService.setTitle('Tournoi ESFTT');
  }

  ngOnInit(): void {}
}
