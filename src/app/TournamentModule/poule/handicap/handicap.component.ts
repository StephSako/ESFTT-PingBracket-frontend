import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoueurInterface } from 'src/app/Interface/Joueur';
import { HandicapService } from 'src/app/Service/handicap.service';
import { ordresRencontres } from 'src/app/const/options-poules';

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

  showHandicap(): string[] {
    const matchesPoules = [];
    const sortedJoueursList = [...this.listeJoueurs].sort((j1, j2) =>
      j1.classement < j2.classement
        ? 1
        : j1.classement > j2.classement
        ? -1
        : j1.nom.localeCompare(j2.nom)
    );
    const ordre = ordresRencontres.find(
      (o) => o.nbJoueurs === sortedJoueursList.length
    )?.ordre;
    if (!ordre) {
      return [
        `<b>Les poules de ${sortedJoueursList.length} joueurs ne sont pas encore prises en compte</b>`,
      ];
    }
    ordre.forEach((o) => {
      const j1 = sortedJoueursList[o[0] - 1];
      const j2 = sortedJoueursList[o[1] - 1];
      matchesPoules.push(
        '<b>[' +
          o[0] +
          '-' +
          o[1] +
          ']</b>   ' +
          j1.nom +
          ' [' +
          (j1.classement === 0 ? 'LOISIR' : j1.classement + ' pts') +
          '] <b>' +
          this.handicapService.calculHandicap(j1.classement, j2.classement)[0] +
          ' | ' +
          this.handicapService.calculHandicap(j1.classement, j2.classement)[1] +
          '</b> ' +
          ' ' +
          j2.nom +
          ' [' +
          (j2.classement === 0 ? 'LOISIR' : j2.classement + ' pts') +
          ']<br>'
      );
    });
    return matchesPoules;
  }

  close(): void {
    this.dialogRef.close();
  }
}
