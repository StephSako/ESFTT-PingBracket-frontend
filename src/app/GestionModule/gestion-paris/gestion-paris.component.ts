import {
  InfosParisJoueurInterface,
  PariVainqueurTableauResult,
  ResultatPariJoueur,
} from 'src/app/Interface/Pari';
import { Component, Input, OnInit } from '@angular/core';
import { ResponseGetAllParisBrackets } from 'src/app/Interface/ResponseGetBracket';
import { PariService } from 'src/app/Service/pari.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailsParisComponent } from './details-paris/details-paris.component';
import { IdNomInterface } from 'src/app/Interface/IdNomInterface';
import { ModaleIdentifiantsParisComponent } from './modale-identifiants-paris/modale-identifiants-paris.component';

@Component({
  selector: 'app-gestion-paris',
  templateUrl: './gestion-paris.component.html',
  styleUrls: ['./gestion-paris.component.scss'],
})
export class GestionParisComponent implements OnInit {
  public classementGeneral: ResultatPariJoueur[] = [];
  public noParis = false;
  @Input() allIdentifiantsJoueurs: IdNomInterface[] = [];

  constructor(private pariService: PariService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.pariService
      .getGeneralResult()
      .subscribe((generalResults: ResponseGetAllParisBrackets) => {
        if (
          generalResults.parisJoueurs.filter(
            (listeParisJoueur: InfosParisJoueurInterface) =>
              listeParisJoueur.paris.length > 0 ||
              listeParisJoueur.pronos_vainqueurs.length > 0
          ).length === 0
        ) {
          this.noParis = true;
        } else {
          generalResults.parisJoueurs.forEach(
            (infosParisJoueurs: InfosParisJoueurInterface) => {
              let resultat = this.pariService.calculateScoreTableauPhase(
                generalResults.brackets,
                infosParisJoueurs.paris,
                infosParisJoueurs.pronos_vainqueurs
              );
              this.classementGeneral.push({
                nom: infosParisJoueurs.id_pronostiqueur.nom,
                score: resultat.score,
                details: resultat.details,
                parisVainqueursTableauxResults:
                  resultat.parisVainqueursTableauxResults,
              });
            }
          );

          this.classementGeneral.sort((a, b) => {
            if (a.score < b.score) {
              return 1;
            } else if (a.score > b.score) {
              return -1;
            }
            return 0;
          });
        }
      });
  }

  displayParis(): boolean {
    return (
      !this.noParis &&
      this.classementGeneral.filter(
        (classementJoueur: ResultatPariJoueur) =>
          classementJoueur.details.length > 0
      ).length > 0
    );
  }

  openDetails(resultatPariJoueur: ResultatPariJoueur): void {
    this.dialog.open(DetailsParisComponent, {
      width: '100%',
      data: {
        resultatPariJoueur,
      },
    });
  }

  getNbParisVainqueursTotalTableaux(
    parisVainqueursTableauxResults: PariVainqueurTableauResult[]
  ): string {
    return (
      parisVainqueursTableauxResults.filter(
        (pariVainqueurTableauResult: PariVainqueurTableauResult) =>
          pariVainqueurTableauResult.pariVainqueurOK === true
      ).length +
      '/' +
      parisVainqueursTableauxResults.length
    );
  }

  openTousLesIdentifiants(): void {
    let tableHTML = '<table><tbody>';
    tableHTML += this.allIdentifiantsJoueurs
      .map(
        (idNomJoueur: IdNomInterface) =>
          '<tr><td>' +
          idNomJoueur.nom +
          '</td><td><span class="id_parieur">' +
          idNomJoueur._id +
          '</span></td></tr>'
      )
      .join('');
    tableHTML.concat('</tbody></table>');

    this.dialog.open(ModaleIdentifiantsParisComponent, {
      width: '50%',
      data: {
        text: tableHTML,
      },
    });
  }
}
