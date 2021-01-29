import { Component, OnInit } from '@angular/core';
import { AccountService } from '../Service/account.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../Service/notify.service';

@Component({
  selector: 'app-gestion-account',
  templateUrl: './gestion-account.component.html',
  styleUrls: ['./gestion-account.component.scss']
})
export class GestionAccountComponent implements OnInit {

  username: string = null;
  actualPasswordHidden: string = null;
  actualPassword: string = null;
  newPassword: string = null;
  newPasswordCheck: string = null;

  loginControl = new FormControl('', [Validators.required]);
  actualPasswordControl = new FormControl('', [Validators.required]);
  newPasswordControl = new FormControl('', [Validators.required]);
  newPasswordCheckControl = new FormControl('', [Validators.required]);

  constructor(private accountService: AccountService, private snackBar: MatSnackBar, private notifyService: NotifyService) { }

  ngOnInit(): void {
    this.getCredentials();
  }

  getCredentials(): void {
    this.username = this.accountService.getUserDetails().username;
    this.actualPasswordHidden = this.accountService.getUserDetails().password;
  }

  getErrorMessageLogin(): string {
    if (this.loginControl.hasError('required')) { return 'Identifiant obligatoire'; }
  }

  getErrorMessageActualPassword(): string {
    if (this.actualPasswordControl.hasError('required')) { return 'Ancien mot de passe obligatoire'; }
  }

  getErrorMessageNewPassword(): string {
    if (this.newPasswordControl.hasError('required')) { return 'Nouveau mot de passe obligatoire'; }
  }

  getErrorMessageNewPasswordCheck(): string {
    if (this.newPasswordCheckControl.hasError('required')) { return 'Retapez le nouveau mot de passe'; }
  }

  editUsername(): void {
    this.accountService.editUsername(this.username).subscribe(() => {
      this.notifyService.notifyUser('Identifiant modifié', this.snackBar, 'success', 2000, 'OK');
    }, err => this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'));
  }

  editPassword(): void {
    if (this.newPassword !== this.newPasswordCheck) {
      this.newPassword = '';
      this.newPasswordCheck = '';
      this.notifyService.notifyUser('Les mots de passe ne correspondent pas',
        this.snackBar, 'error', 2000, 'OK');
    } else {
      this.accountService.editPassword(this.actualPassword, this.newPassword).subscribe(() => {
        this.notifyService.notifyUser('Mot de passe modifié', this.snackBar, 'success', 2000, 'OK');
        this.newPasswordControl.reset();
        this.newPasswordCheckControl.reset();
        this.actualPasswordControl.reset();
      }, err => {
        this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
        this.actualPassword = '';
      });
    }
  }

  showButtonEditUsername(): boolean {
    return !(this.username.length > 0);
  }

  isFilled(): boolean {
    return (this.newPassword != null && this.newPasswordCheck != null && this.actualPassword != null &&
      this.newPassword.trim() !== '' && this.newPasswordCheck.trim() !== '' && this.actualPassword.trim() !== '');
  }
}
