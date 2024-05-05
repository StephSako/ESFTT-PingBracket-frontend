import { Component, OnInit } from '@angular/core';
import { ParisJoueurInterface } from 'src/app/Interface/Pari';
import { TableauInterface } from 'src/app/Interface/Tableau';
import { PariService } from 'src/app/Service/pari.service';
import { TableauService } from 'src/app/Service/tableau.service';

@Component({
  selector: 'app-parier',
  templateUrl: './parier.component.html',
  styleUrls: ['./parier.component.scss'],
})
export class ParierComponent implements OnInit {
  public tableauxPariables: TableauInterface[] = [];

  constructor(
    private readonly pariService: PariService,
    private readonly tableauService: TableauService
  ) {}

  //TODO DELETE EN BRACKET
  public pari: ParisJoueurInterface = {
    _id: null,
    id_prono_vainqueur: '6636a1eaf02e5c065941dd47',
    id_pronostiqueur: '6636899be6e3a6029a168158',
    paris: [
      {
        id_bracket: '6636b5e4366a5809b915d534',
        id_gagnant: '6636899be6e3a6029a168158',
        id_match: 2,
        round: 2,
      },
    ],
  };

  ngOnInit(): void {
    this.pariService.getAll().subscribe((paris: ParisJoueurInterface) => {
      console.error(paris);
    });
    this.tableauService
      .getPariables()
      .subscribe((tableauxPariables: TableauInterface[]) => {
        this.tableauxPariables = tableauxPariables;
      });
  }

  parier(): void {
    this.pariService.bet(this.pari).subscribe((pari: ParisJoueurInterface) => {
      this.pari._id = pari._id; //TODO DELETE EN BRACKET
      //TODO AFFICHER LES MESSAGES
    });
  }

  annulerPari(): void {
    this.pariService.cancel(this.pari._id).subscribe(); //TODO AFFICHER LES MESSAGES
  }

  toutSupprimer(): void {
    this.pariService.deleteAll().subscribe(); //TODO AFFICHER LES MESSAGES
  }
}
