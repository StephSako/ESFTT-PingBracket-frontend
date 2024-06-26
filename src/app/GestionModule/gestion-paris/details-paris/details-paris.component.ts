import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResultatPariJoueur } from 'src/app/Interface/Pari';

@Component({
  selector: 'app-details-paris',
  templateUrl: './details-paris.component.html',
  styleUrls: ['./details-paris.component.scss'],
})
export class DetailsParisComponent implements OnInit {
  public resultatPariJoueur: ResultatPariJoueur = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<DetailsParisComponent>
  ) {
    this.resultatPariJoueur = data.resultatPariJoueur;
  }

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }
}
