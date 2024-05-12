import { Component, OnInit } from '@angular/core';
import { ParisJoueurInterface } from 'src/app/Interface/Pari';
import { TableauInterface } from 'src/app/Interface/Tableau';
import { AccountService } from 'src/app/Service/account.service';
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
    private readonly tableauService: TableauService,
    private readonly accountService: AccountService
  ) {}

  public pariJoueur: ParisJoueurInterface = null;

  ngOnInit(): void {
    if (this.isParieurLoggedIn()) this.getAllParisJoueur();

    this.tableauService
      .getPariables()
      .subscribe((tableauxPariables: TableauInterface[]) => {
        this.tableauxPariables = tableauxPariables;
      });

    this.pariService.listeParisJoueurLoggedIn.subscribe(() => {
      this.getAllParisJoueur();
    });
  }

  getAllParisJoueur(): void {
    this.pariService
      .getAllParisJoueur(this.accountService.getIdParieur())
      .subscribe((paris: ParisJoueurInterface) => {
        this.pariJoueur = paris;
        this.pariService.updatePariMatch.next(this.pariJoueur);
      });
  }

  isParieurLoggedIn(): boolean {
    return !!this.accountService.getIdParieur();
  }

  logout(): void {
    this.accountService.logoutParieur();
  }
}
