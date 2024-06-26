import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoueurInterface } from 'src/app/Interface/Joueur';
import { HandicapService } from 'src/app/Service/handicap.service';

@Component({
  selector: 'app-handicap',
  templateUrl: './handicap.component.html',
  styleUrls: ['./handicap.component.scss'],
})
export class HandicapComponent implements OnInit {
  public listeJoueurs: JoueurInterface[] = null;
  public numPoule: number = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<HandicapComponent>,
    private readonly handicapService: HandicapService
  ) {
    this.listeJoueurs = data.listeJoueurs;
    this.numPoule = data.numPoule;
  }

  ngOnInit(): void {}

  getHandicapPoule(): string {
    return this.handicapService.getHandicapPoule(this.listeJoueurs);
  }

  close(): void {
    this.dialogRef.close();
  }
}
