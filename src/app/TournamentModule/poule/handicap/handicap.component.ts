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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<HandicapComponent>,
    private readonly handicapService: HandicapService
  ) {
    this.listeJoueurs = data.listeJoueurs;
  }

  ngOnInit(): void {}

  showHandicap(): string[] {
    let matchesPoules = [];
    this.listeJoueurs.forEach((joueur1) => {
      this.listeJoueurs.forEach((joueur2) => {
        if (
          joueur1._id !== joueur2._id &&
          matchesPoules.filter((match) => {
            let regex = new RegExp(
              '.*' + joueur2.nom + '.*' + joueur1.nom + '.*'
            );
            return match.match(regex);
          }).length === 0
        ) {
          matchesPoules.push(
            joueur1.nom +
              ' ' +
              joueur1.classement +
              ' pts <b>' +
              this.handicapService.calculHandicap(
                JSON.parse(JSON.stringify(joueur1.classement)),
                JSON.parse(JSON.stringify(joueur2.classement))
              )[0] +
              '</b> vs <b>' +
              this.handicapService.calculHandicap(
                JSON.parse(JSON.stringify(joueur1.classement)),
                JSON.parse(JSON.stringify(joueur2.classement))
              )[1] +
              '</b> ' +
              ' ' +
              joueur2.classement +
              ' pts ' +
              joueur2.nom +
              '<br>'
          );
        }
      });
    });
    return matchesPoules;
  }

  close(): void {
    this.dialogRef.close();
  }
}
