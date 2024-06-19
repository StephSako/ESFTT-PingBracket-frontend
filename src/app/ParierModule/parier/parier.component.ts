import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  PariInterface,
  InfosParisJoueurInterface,
} from 'src/app/Interface/Pari';
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
    private titleService: Title,
    private readonly accountService: AccountService
  ) {}

  public infosParisJoueur: InfosParisJoueurInterface = null;
  public tableauxGet = false;

  ngOnInit(): void {
    this.titleService.setTitle('Tournoi ESFTT - Parier');

    if (this.isParieurLoggedIn()) {
      this.getParisAndBracket();
    }

    this.pariService.updateParisLoggIn.subscribe(() => {
      this.getParisAndBracket();
    });

    this.tableauService.getPariables().subscribe(
      (tableauxPariables: TableauInterface[]) => {
        this.tableauxPariables = tableauxPariables;
        this.tableauxGet = true;
      },
      () => {
        this.tableauxGet = true;
      }
    );

    this.pariService.updateInfoParisJoueur.subscribe(
      (infosParisJoueur: InfosParisJoueurInterface) => {
        if (infosParisJoueur !== null) {
          this.infosParisJoueur = infosParisJoueur;
        }
      }
    );

    this.pariService.addPariToListeParisMatches.subscribe(
      (pariToAdd: PariInterface) => {
        if (pariToAdd !== null) {
          this.infosParisJoueur.paris.push(pariToAdd);
          this.pariService.updateListeParisMatches.next(
            this.infosParisJoueur.paris
          );
        }
      }
    );

    this.pariService.deletePariToListeParisMatches.subscribe(
      (pariToDelete: PariInterface) => {
        if (pariToDelete !== null) {
          this.infosParisJoueur.paris = this.infosParisJoueur.paris.filter(
            (pari: PariInterface) =>
              JSON.stringify(pari) !== JSON.stringify(pariToDelete)
          );
          this.pariService.updateListeParisMatches.next(
            this.infosParisJoueur.paris
          );
        }
      }
    );
  }

  getParisAndBracket(): void {
    this.pariService
      .getAllParisJoueur(this.accountService.getParieur()._id)
      .subscribe((infosParisJoueur: InfosParisJoueurInterface) => {
        this.infosParisJoueur = infosParisJoueur;
      });
  }

  getNomParieur(): string {
    return this.accountService.getParieur().nom;
  }

  logout(): void {
    this.accountService.logoutParieur();
  }

  getPoints(): number {
    return 30;
  }

  isParieurLoggedIn(): boolean {
    return !!this.accountService.getParieur();
  }
}
