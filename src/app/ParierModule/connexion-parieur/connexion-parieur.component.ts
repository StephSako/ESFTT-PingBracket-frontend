import { JoueurService } from './../../Service/joueur.service';
import { Component, OnInit } from '@angular/core';
import { JoueurInterface } from 'src/app/Interface/Joueur';
import { AccountService } from 'src/app/Service/account.service';

@Component({
  selector: 'app-connexion-parieur',
  templateUrl: './connexion-parieur.component.html',
  styleUrls: ['./connexion-parieur.component.scss'],
})
export class ConnexionParieurComponent implements OnInit {
  public idParieur = '';
  public spinnerShown = false;

  constructor(
    private readonly accountService: AccountService,
    private readonly joueurService: JoueurService
  ) {}

  ngOnInit(): void {}

  loginParieur(): void {
    this.spinnerShown = true;
    this.joueurService.checkIdParieur(this.idParieur).subscribe(
      (joueur: JoueurInterface) => {
        this.spinnerShown = false;
        this.accountService.saveIdParieur(joueur._id);
      },
      (error) => {
        this.spinnerShown = false;
      }
    );
  }
}
