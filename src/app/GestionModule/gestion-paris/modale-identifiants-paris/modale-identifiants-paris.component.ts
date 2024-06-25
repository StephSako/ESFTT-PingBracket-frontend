import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from 'src/app/Interface/Dialog';

@Component({
  selector: 'app-modale-identifiants-paris',
  templateUrl: './modale-identifiants-paris.component.html',
  styleUrls: ['./modale-identifiants-paris.component.scss'],
})
export class ModaleIdentifiantsParisComponent {
  public submitBtnDisabled = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Dialog) {}

  printListeIdsParis(): void {
    let divToPrint = document.getElementById('tableIdsParis');
    let newWin = window.open('_');
    newWin.document.write(divToPrint.outerHTML);
  }
}
