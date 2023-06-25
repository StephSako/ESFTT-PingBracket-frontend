import { Injectable } from '@angular/core';

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

    if (joueur1 !== joueur2 || Math.abs(joueur1 - joueur2) < 50) {
      if (joueur1 < joueur2) {
        inverser = true;
      }

      const ecart = Math.abs(joueur1 - joueur2);
      if (ecart >= 101 && ecart <= 200) {
        handicap = [-1, 0];
      } else if (ecart >= 201 && ecart <= 300) {
        handicap = [-1, 1];
      } else if (ecart >= 301 && ecart <= 400) {
        handicap = [-2, 1];
      } else if (ecart >= 401 && ecart <= 500) {
        handicap = [-2, 2];
      } else if (ecart >= 501 && ecart <= 600) {
        handicap = [-3, 2];
      } else if (ecart >= 601 && ecart <= 700) {
        handicap = [-3, 3];
      } else if (ecart >= 701 && ecart <= 800) {
        handicap = [-4, 3];
      } else if (ecart >= 801) {
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
}
