import {
  InfosParisJoueurInterface,
  PariInterface,
  PariVainqueurTableauResult,
  PronoVainqueur,
  ResultatPariJoueur,
} from 'src/app/Interface/Pari';
import { Component, Input, OnInit } from '@angular/core';
import { ResponseGetAllParisBrackets } from 'src/app/Interface/ResponseGetBracket';
import { PariService } from 'src/app/Service/pari.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailsParisComponent } from './details-paris/details-paris.component';
import { IdNomInterface } from 'src/app/Interface/IdNomInterface';
import { DialogPrintListComponent } from 'src/app/SharedModule/dialog-print-list/dialog-print-list';
import { NotifyService } from 'src/app/Service/notify.service';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gestion-paris',
  templateUrl: './gestion-paris.component.html',
  styleUrls: ['./gestion-paris.component.scss'],
})
export class GestionParisComponent implements OnInit {
  public classementGeneral: ResultatPariJoueur[] = [];
  public joueursLesPlusPariesMatches: any[] = [];
  public joueursLesPlusPariesVainqueur: any[] = [];
  public noParis = false;
  @Input() allIdentifiantsJoueurs: IdNomInterface[] = [];

  constructor(
    private pariService: PariService,
    private notifyService: NotifyService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getClassementGeneral(false);
  }

  getClassementGeneral(refresh: boolean): void {
    this.pariService.getGeneralResult().subscribe(
      (generalResults: ResponseGetAllParisBrackets) => {
        this.classementGeneral = [];
        if (
          generalResults.parisJoueurs.filter(
            (listeParisJoueur: InfosParisJoueurInterface) =>
              listeParisJoueur.paris.length > 0 ||
              listeParisJoueur.pronos_vainqueurs.length > 0
          ).length === 0
        ) {
          this.noParis = true;
        } else {
          // On détermine les joueurs les plus pariés dans les matches ...
          this.joueursLesPlusPariesMatches = [];
          this.joueursLesPlusPariesVainqueur = [];

          const triJoueursLesPlusPariesMatches = _.countBy(
            _.flatten(
              generalResults.parisJoueurs
                .map(
                  (infosParis: InfosParisJoueurInterface) => infosParis.paris
                )
                .filter((paris: PariInterface[]) => paris.length > 0)
            )
              .filter(
                (pari: PariInterface) => pari.id_tableau.format === 'simple'
              )
              .map((pari: PariInterface) => pari.id_gagnant.nom)
          );

          Object.keys(triJoueursLesPlusPariesMatches).forEach((joueur) => {
            this.joueursLesPlusPariesMatches.push({
              nom: joueur,
              nbParis: triJoueursLesPlusPariesMatches[joueur],
            });
          });

          this.joueursLesPlusPariesMatches.sort((a, b) => {
            if (a.nbParis < b.nbParis) {
              return 1;
            } else if (a.nbParis > b.nbParis) {
              return -1;
            }
            return 0;
          });

          // ... et ceux en tant que vainqueur
          const triJoueursLesPlusPariesVainqueur = _.countBy(
            _.flatten(
              generalResults.parisJoueurs
                .map(
                  (infosParis: InfosParisJoueurInterface) =>
                    infosParis.pronos_vainqueurs
                )
                .filter(
                  (pronos_vainqueurs: PronoVainqueur[]) =>
                    pronos_vainqueurs.length > 0
                )
            )
              .filter(
                (prono_vainqueur: PronoVainqueur) =>
                  prono_vainqueur.id_tableau.format === 'simple'
              )
              .map(
                (prono_vainqueur: PronoVainqueur) =>
                  prono_vainqueur.id_gagnant.nom
              )
          );

          Object.keys(triJoueursLesPlusPariesVainqueur).forEach((joueur) => {
            this.joueursLesPlusPariesVainqueur.push({
              nom: joueur,
              nbParis: triJoueursLesPlusPariesVainqueur[joueur],
            });
          });

          this.joueursLesPlusPariesVainqueur.sort((a, b) => {
            if (a.nbParis < b.nbParis) {
              return 1;
            } else if (a.nbParis > b.nbParis) {
              return -1;
            }
            return 0;
          });

          generalResults.parisJoueurs.forEach(
            (infosParisJoueurs: InfosParisJoueurInterface) => {
              const resultat = this.pariService.calculateScoreTableauPhase(
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

        if (refresh) {
          this.notifyService.notifyUser(
            'Classement général des paris mis à jour',
            this.snackBar,
            'success',
            'OK'
          );
        }
      },
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
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
      width: '60%',
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

  openPrintIdentifiantsParis(): void {
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
    tableHTML += '</tbody></table>';

    this.dialog.open(DialogPrintListComponent, {
      width: '50%',
      data: {
        text: tableHTML,
        printTitle: true,
        action: 'Identifiants des joueurs pour parier',
      },
    });
  }
}
