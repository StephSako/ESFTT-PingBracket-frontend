import { Component, Input, OnInit } from '@angular/core';
import { TokenPayloadLogin } from '../Interface/Account';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-account',
  templateUrl: './form-account.component.html',
  styleUrls: ['./form-account.component.scss']
})
export class FormAccountComponent implements OnInit {

  @Input() credentials: TokenPayloadLogin = {
    username: '',
    password: '',
  };

  loginControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);

  constructor() { }

  ngOnInit(): void {
  }

  getErrorMessageLogin(): string {
    if (this.loginControl.hasError('required')) {
      return 'Identifiant obligatoire';
    }
  }

  getErrorMessagePassword(): string {
    if (this.passwordControl.hasError('required')) {
      return 'Mot de passe obligatoire';
    }
  }

}
