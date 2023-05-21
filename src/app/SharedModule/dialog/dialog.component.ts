import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from '../../Interface/Dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  public submitBtnDisabled = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Dialog) {}

  submitBtnDisable(): void {
    this.submitBtnDisabled = true;
  }
}
