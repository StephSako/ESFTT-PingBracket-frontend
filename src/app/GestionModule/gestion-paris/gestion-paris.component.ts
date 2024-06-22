import { InfosParisJoueurInterface } from 'src/app/Interface/Pari';
import { Component, OnInit } from '@angular/core';
import { ResponseGetAllParisBrackets } from 'src/app/Interface/ResponseGetBracket';
import { PariService } from 'src/app/Service/pari.service';

@Component({
  selector: 'app-gestion-paris',
  templateUrl: './gestion-paris.component.html',
  styleUrls: ['./gestion-paris.component.scss'],
})
export class GestionParisComponent implements OnInit {
  public classementGeneral = [];

  constructor(private pariService: PariService) {}

  ngOnInit(): void {
    this.pariService
      .getGeneralResult()
      .subscribe((generalResults: ResponseGetAllParisBrackets) => {
        generalResults.parisJoueurs.forEach(
          (infosParisJoueurs: InfosParisJoueurInterface) => {
            this.classementGeneral.push({
              nom: infosParisJoueurs.id_pronostiqueur.nom,
              score: this.pariService.calculateScoreTableauPhase(
                generalResults.brackets,
                infosParisJoueurs.paris
              ),
            });
          }
        );
      });
  }
}
