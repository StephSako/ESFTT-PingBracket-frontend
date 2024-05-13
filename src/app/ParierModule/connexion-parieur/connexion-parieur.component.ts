import { MatSnackBar } from '@angular/material/snack-bar';
import { JoueurService } from './../../Service/joueur.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JoueurInterface } from 'src/app/Interface/Joueur';
import { AccountService } from 'src/app/Service/account.service';
import { NotifyService } from 'src/app/Service/notify.service';

@Component({
  selector: 'app-connexion-parieur',
  templateUrl: './connexion-parieur.component.html',
  styleUrls: ['./connexion-parieur.component.scss'],
})
export class ConnexionParieurComponent implements OnInit {
  @Output() setParieurLoggedIn: EventEmitter<any> = new EventEmitter();
  public idParieur = '';
  public spinnerShown = false;

  constructor(
    private readonly accountService: AccountService,
    private readonly joueurService: JoueurService,
    private snackBar: MatSnackBar,
    private notifyService: NotifyService
  ) {}

  ngOnInit(): void {}

  loginParieur(): void {
    this.spinnerShown = true;
    this.joueurService.checkIdParieur(this.idParieur).subscribe(
      (joueur: JoueurInterface) => {
        this.spinnerShown = false;
        this.accountService.saveParieur(joueur);
        this.setParieurLoggedIn.emit();
      },
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
        this.spinnerShown = false;
      }
    );
  }
}
