import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HandicapService {

  constructor() { }

  /**
   * Calculer les points d'handicap entre deux classements
   * @param joueur1
   * @param joueur2
   */
  calculHandicap(joueur1: number, joueur2: number): any[] {
    let isLoisir1 = (joueur1 === 0 && joueur2 !== 0);
    let isLoisir2 = (joueur2 === 0 && joueur1 !== 0);

    if (isLoisir1) joueur1 = 500;
    else if (isLoisir2) joueur2 = 500;

    let inverser = false;
    let handicap: any[] = [0, 0];

    if (joueur1 !== joueur2 || Math.abs(joueur1 - joueur2) < 50) {
      if (joueur1 < joueur2) inverser = true;

      let ecart = Math.abs(joueur1 - joueur2);
      if (ecart >= 50 && ecart <= 99) handicap = [-1, 0];
      else if (ecart >= 100 && ecart <= 199) handicap = [-1, 1];
      else if (ecart >= 200 && ecart <= 299) handicap = [-2, 1];
      else if (ecart >= 300 && ecart <= 399) handicap = [-2, 2];
      else if (ecart >= 400 && ecart <= 499) handicap = [-3, 2];
      else if (ecart >= 500 && ecart <= 599) handicap = [-3, 3];
      else if (ecart >= 600 && ecart <= 699) handicap = [-4, 3];
      else if (ecart >= 700 && ecart <= 799) handicap = [-4, 4];
      else if (ecart >= 800) handicap = [-5, 4];
    }

    if ((isLoisir1 && !inverser) || (isLoisir2 && inverser)) handicap[0]++;
    else if ((isLoisir2 && !inverser) || (isLoisir1 && inverser))  handicap[1]++;

    if (inverser) handicap.reverse();
    return handicap.map(handicapItem => {
      handicapItem = (handicapItem > 0) ? '+' + handicapItem : String(handicapItem)
      return handicapItem;
    });
  }
}
