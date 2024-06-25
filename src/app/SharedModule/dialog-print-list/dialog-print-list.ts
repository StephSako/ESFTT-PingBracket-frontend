import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from 'src/app/Interface/Dialog';

@Component({
  selector: 'app-dialog-print-list',
  templateUrl: './dialog-print-list.html',
  styleUrls: ['./dialog-print-list.scss'],
})
export class DialogPrintListComponent {
  public submitBtnDisabled = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Dialog) {}

  printDiv(): void {
    let divToPrint = document.getElementById('divToPrint');
    let newWin = window.open('_');
    newWin.document.write(divToPrint.outerHTML);
  }
}
