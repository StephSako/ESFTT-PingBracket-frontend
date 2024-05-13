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
  public isLoggedIn = false;
  public tableauxGet = false;

  ngOnInit(): void {
    this.isLoggedIn = !!this.accountService.getIdParieur();
    if (this.isLoggedIn) {
      this.getAllParisJoueur();
    }

    this.tableauService.getPariables().subscribe(
      (tableauxPariables: TableauInterface[]) => {
        this.tableauxPariables = tableauxPariables;
        this.tableauxGet = true;
      },
      () => {
        this.tableauxGet = true;
      }
    );

    this.pariService.listeParisJoueurLoggedIn.subscribe(() => {
      this.getAllParisJoueur();
    });
  }

  getAllParisJoueur(): void {
    this.pariService
      .getAllParisJoueur(this.accountService.getIdParieur())
      .subscribe((paris: ParisJoueurInterface) => {
        this.isLoggedIn = true;
        this.pariJoueur = paris;
        this.pariService.updatePariMatch.next(this.pariJoueur);
      });
  }

  logout(): void {
    this.accountService.logoutParieur();
    this.isLoggedIn = false;
  }
}
