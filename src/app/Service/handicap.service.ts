import { Injectable } from '@angular/core';
import { ordresRencontres } from '../const/options-poules';
import { JoueurInterface } from '../Interface/Joueur';

@Injectable({
  providedIn: 'root',
})
export class HandicapService {
  constructor() {}

  /**
   * Calculer les points d'handicap entre deux classements
   */
  calculHandicap(joueur1: number, joueur2: number): any[] {
    const isLoisir1 = joueur1 === 0 && joueur2 !== 0;
    const isLoisir2 = joueur2 === 0 && joueur1 !== 0;

    if (isLoisir1) {
      joueur1 = 500;
    } else if (isLoisir2) {
      joueur2 = 500;
    }

    let inverser = false;
    let handicap: any[number] = [0, 0];

    const ecart = Math.abs(joueur1 - joueur2);
    if (ecart >= 100) {
      if (joueur1 < joueur2) {
        inverser = true;
      }

      if (ecart >= 100 && ecart <= 199) {
        handicap = [-1, 0];
      } else if (ecart >= 200 && ecart <= 299) {
        handicap = [-1, 1];
      } else if (ecart >= 300 && ecart <= 399) {
        handicap = [-2, 1];
      } else if (ecart >= 400 && ecart <= 499) {
        handicap = [-2, 2];
      } else if (ecart >= 500 && ecart <= 599) {
        handicap = [-3, 2];
      } else if (ecart >= 600 && ecart <= 699) {
        handicap = [-3, 3];
      } else if (ecart >= 700 && ecart <= 799) {
        handicap = [-4, 3];
      } else if (ecart >= 800) {
        handicap = [-4, 4];
      }
    }

    /** Les loisirs ont un point bonus */
    if ((isLoisir1 && !inverser) || (isLoisir2 && inverser)) {
      handicap[0]++;
    } else if ((isLoisir2 && !inverser) || (isLoisir1 && inverser)) {
      handicap[1]++;
    }

    if (inverser) {
      handicap.reverse();
    }

    return handicap.map((handicapItem) => {
      handicapItem =
        handicapItem > 0 ? '+' + handicapItem : String(handicapItem);
      return handicapItem;
    });
  }

  getHandicapPoule(listeJoueurs: JoueurInterface[]): string {
    let matchesPoules = '<table><tbody>';
    const sortedJoueursList = [...listeJoueurs].sort((j1, j2) =>
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
      return `<tr><td><b>Les poules de ${sortedJoueursList.length} joueurs ne sont pas encore prises en compte</b></td></tr>`;
    }
    ordre.forEach((o) => {
      const j1 = sortedJoueursList[o[0] - 1];
      const j2 = sortedJoueursList[o[1] - 1];
      matchesPoules +=
        '<tr><td><b>[' +
        o[0] +
        ' vs ' +
        o[1] +
        ']</b>   ' +
        j1.nom +
        ' [' +
        (j1.classement === 0 ? 'LOISIR' : j1.classement + ' pts') +
        '] <b>' +
        this.calculHandicap(j1.classement, j2.classement)[0] +
        ' | ' +
        this.calculHandicap(j1.classement, j2.classement)[1] +
        '</b> ' +
        ' ' +
        j2.nom +
        ' [' +
        (j2.classement === 0 ? 'LOISIR' : j2.classement + ' pts') +
        ']</td></tr>';
    });

    matchesPoules += '</tbody></table>';
    return matchesPoules;
  }
}
