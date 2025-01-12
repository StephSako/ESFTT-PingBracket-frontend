import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ordresRencontres } from 'src/app/const/options-poules';
import { Dialog } from 'src/app/Interface/Dialog';
import { PouleInterface } from 'src/app/Interface/Poule';
import { HandicapService } from 'src/app/Service/handicap.service';

@Component({
  selector: 'app-dialog-print-poule',
  templateUrl: './dialog-print-poule.component.html',
  styleUrls: ['./dialog-print-poule.component.scss'],
})
export class DialogPrintPouleComponent {
  public poules: PouleInterface[] = [];
  public hasTableauHandicap = false;
  public isSimpleFormat = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Dialog,
    private readonly handicapService: HandicapService
  ) {
    this.poules = data.poules;
    this.hasTableauHandicap = data.hasTableauHandicap;
    this.isSimpleFormat = data.format === 'simple';
  }

  printDiv(): void {
    const divToPrint = document.getElementById('divToPrint');
    const newWin = window.open('_');
    newWin.document.write(divToPrint.outerHTML);
  }

  getOrdreMatches(nbJoueurs: number): any {
    return (
      ordresRencontres.find((ordre) => ordre.nbJoueurs === nbJoueurs) ?? {
        ordre: [],
      }
    );
  }

  griserCase(ordre: number[], indexJoueur: number): string {
    return ordre.includes(indexJoueur + 1) ? 'white' : '#6d6d6d';
  }

  getHandicap(clsmtJ1, clsmtJ2): any[] {
    return this.handicapService.calculHandicap(clsmtJ1, clsmtJ2);
  }

  getMaxJoueursPoules(): number {
    return Math.max(...this.poules.map((poule) => poule.participants.length));
  }

  getNomlibelleParticipant(participant: any): string {
    return this.isSimpleFormat
      ? participant.nom
      : participant.joueurs.map((joueur) => joueur.nom).join(' - ');
  }
}
