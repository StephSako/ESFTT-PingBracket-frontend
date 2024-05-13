import { Component, OnInit } from '@angular/core';
import { TokenPayloadLogin } from '../../Interface/Account';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../Service/account.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';

@Component({
  selector: 'app-form-account',
  templateUrl: './form-account.component.html',
  styleUrls: ['./form-account.component.scss'],
})
export class FormAccountComponent implements OnInit {
  public credentials: TokenPayloadLogin = {
    username: '',
    password: '',
  };
  spinnerShown = false;
  passwordVisibility = false;
  inputPasswordType = 'password';
  reactiveForm: FormGroup;

  constructor(
    private authService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar,
    private notifyService: NotifyService
  ) {}

  ngOnInit(): void {
    this.spinnerShown = false;
    this.reactiveForm = new FormGroup({
      username: new FormControl(this.credentials.username, [
        Validators.required,
      ]),
      password: new FormControl(this.credentials.password, [
        Validators.required,
      ]),
    });
  }

  login(): void {
    if (this.invalidForm()) {
      this.notifyService.notifyUser(
        'Renseignez le pseudo et le mot de passe',
        this.snackBar,
        'error',
        'OK'
      );
    } else {
      this.spinnerShown = true;
      this.credentials = {
        username: this.reactiveForm.get('username').value,
        password: this.reactiveForm.get('password').value,
      };
      this.authService.login(this.credentials).subscribe(
        () => {
          this.spinnerShown = false;
          this.router.navigateByUrl('/gestion');
        },
        (err) => {
          this.spinnerShown = false;
          this.notifyService.notifyUser(
            err.error,
            this.snackBar,
            'error',
            'OK'
          );
        }
      );
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisibility = !this.passwordVisibility;
    this.inputPasswordType = this.passwordVisibility ? 'text' : 'password';
  }

  public invalidForm(): boolean {
    return (
      !this.reactiveForm.get('username').value ||
      !this.reactiveForm.get('password').value
    );
  }
}
