import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  public notifyUser(message: string, snackBar: MatSnackBar, style: string, duration: number, action?: string): void {
    snackBar.open(message, action, {
      duration,
      panelClass: ['style-' + style],
    });
  }
}
