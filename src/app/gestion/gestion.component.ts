import { Component, OnInit } from '@angular/core';
import { TableauService } from '../Service/tableau.service';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { JoueurService } from '../Service/joueur.service';
import { JoueurInterface } from '../Interface/Joueur';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {

  allJoueurs: JoueurInterface[] = [];

  constructor(private gestionService: TableauService, private notifyService: NotifyService, private snackBar: MatSnackBar,
              public dialog: MatDialog, private joueurService: JoueurService) { }

  ngOnInit(): void {}

  remiseAZero(): void {
    const accountToDelete: Dialog = {
      id: 'true',
      action: 'Remettre le tournoi à zéro pour une nouvelle année ?',
      option: `Les joueurs, poules, binômes de double, phases finales, plats et nombre de participants du buffets seront supprimés.\n\nLes paramètres du formulaire, le stock du matériel et les tableaux seront conservés.`,
      action_button_text: 'Remettre à zéro'
    };

    this.dialog.open(DialogComponent, {
      width: '55%',
      data: accountToDelete
    }).afterClosed().subscribe(id_joueur => {
      if (id_joueur){
        this.gestionService.reset()
          .subscribe(message => {
            this.notifyService.notifyUser(message.message, this.snackBar, 'success', 2500, 'OK');
          }, err => {
            this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
          });
      }
    });
  }

  getAllJoueurs(): void {
    this.joueurService.getAllPlayers().subscribe(joueurs => this.allJoueurs = joueurs, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

}
