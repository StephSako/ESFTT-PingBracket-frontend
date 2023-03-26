import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  constructor() {}

  public notifyUser(
    message: string,
    snackBar: MatSnackBar,
    style: string,
    action?: string
  ): void {
    snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['style-' + style],
    });
  }
}
