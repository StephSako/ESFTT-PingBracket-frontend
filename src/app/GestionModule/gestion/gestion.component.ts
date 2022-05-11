import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { JoueurService } from '../../Service/joueur.service';
import { JoueurInterface } from '../../Interface/Joueur';
import { Router } from '@angular/router';
import { TableauService } from 'src/app/Service/tableau.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {

  allJoueurs: JoueurInterface[] = [];

  constructor(private router: Router, private notifyService: NotifyService, private snackBar: MatSnackBar,
              public dialog: MatDialog, private joueurService: JoueurService, private tableauService: TableauService) { }

  ngOnInit(): void {}

  remiseAZero(): void {
    const accountToDelete: Dialog = {
      id: 'true',
      action: 'Remettre le tournoi à zéro pour une nouvelle année ?',
      option: `Les joueurs, poules, binômes de double, phases finales, plats et nombre de convives du buffets seront supprimés, et les tableaux relancés.\n\nLes paramètres du formulaire, les stocks et les tableaux seront conservés.`,
      action_button_text: 'Remettre à zéro'
    };

    this.dialog.open(DialogComponent, {
      width: '55%',
      data: accountToDelete
    }).afterClosed().subscribe(id_joueur => {
      if (id_joueur){
        this.tableauService.reset()
          .subscribe(message => {
            this.reloadComponent(message.message);
          }, err => {
            this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
          });
      }
    });
  }

  reloadComponent(message: string): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/']).then(() => {
      this.notifyService.notifyUser(message, this.snackBar, 'success','OK');
    });
  }

  getAllJoueurs(): void {
    this.joueurService.getAllPlayers().subscribe(joueurs => this.allJoueurs = joueurs, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

}
