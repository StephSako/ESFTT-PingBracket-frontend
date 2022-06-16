import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoueurInterface } from 'src/app/Interface/Joueur';

@Component({
  selector: 'app-handicap',
  templateUrl: './handicap.component.html',
  styleUrls: ['./handicap.component.scss']
})
export class HandicapComponent implements OnInit {

  public listeJoueurs: JoueurInterface[] = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<HandicapComponent>,) {
    this.listeJoueurs = data.listeJoueurs;
  }

  ngOnInit(): void {
  }

  showHandicap(): string[] {
    let matchesPoules = [];
    this.listeJoueurs.forEach(joueur1 => {
      this.listeJoueurs.forEach(joueur2 => {

        if (joueur1._id !== joueur2._id && matchesPoules.filter(match => {
          let regex = new RegExp(".*" + joueur2.nom + ".*" + joueur1.nom + ".*");
          return match.match(regex);
        }).length === 0) {
          matchesPoules.push(joueur1.nom + ' ' + joueur1.classement + ' pts <b>' + this.calculHandicap(JSON.parse(JSON.stringify(joueur1.classement)), JSON.parse(JSON.stringify(joueur2.classement)))[0] +
          '</b> VS <b>' + this.calculHandicap(JSON.parse(JSON.stringify(joueur1.classement)), JSON.parse(JSON.stringify(joueur2.classement)))[1] + '</b> ' + ' ' + joueur2.classement + ' pts ' + joueur2.nom + '<br>');
        }

      });
    });
    return matchesPoules;
  }

  calculHandicap(joueur1: number, joueur2: number): any[] {
    let isLoisir1 = (joueur1 === 0 && joueur2 !== 0);
    let isLoisir2 = (joueur2 === 0 && joueur1 !== 0);

    if (isLoisir1) joueur1 = 500;
    else if (isLoisir2) joueur2 = 500;

    let inverser = false;
    let handicap: any[] = [0, 0];

    if (joueur1 !== joueur2 || Math.abs(joueur1 - joueur2) <50) {
      if (joueur1 < joueur2) inverser = true;

      let ecart = Math.abs(joueur1 - joueur2);
      if (ecart >=50 && ecart <= 99) handicap = [-1, 0];
      else if (ecart >= 100 && ecart <= 199) handicap = [-1, 1];
      else if (ecart >= 200 && ecart <= 299) handicap = [-2, 1];
      else if (ecart >= 300 && ecart <= 399) handicap = [-2, 2];
      else if (ecart >= 400 && ecart <= 499) handicap = [-3, 2];
      else if (ecart >= 500 && ecart <= 599) handicap = [-3, 3];
      else if (ecart >= 600 && ecart <= 699) handicap = [-4, 3];
      else if (ecart >= 700 && ecart <= 799) handicap = [-4, 4];
      else if (ecart >= 800) handicap = [-5, 4];
    }

    if (isLoisir1) handicap[0]++;
    else if (isLoisir2) handicap[1]++;

    if (inverser) handicap.reverse();
    return handicap.map(handicapItem => {
      handicapItem = (handicapItem > 0) ? '+' + handicapItem : String(handicapItem)
      return handicapItem;
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
