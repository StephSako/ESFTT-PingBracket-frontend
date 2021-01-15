import {Component, OnInit, ViewChild} from '@angular/core';
import { TableauService } from '../Service/tableau.service';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GestionJoueursComponent } from '../gestion-joueurs/gestion-joueurs.component';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {

  @ViewChild('gestion_joueur') gestion_joueur: GestionJoueursComponent;

  constructor(private gestionService: TableauService, private notifyService: NotifyService, private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {}

  remiseAZero(): void {
    const accountToDelete: Dialog = {
      id: 'true',
      action: 'Remettre le tournoi à zéro pour une nouvelle année ?',
      option: `Les joueurs, poules, binômes de double, phases finales, plats et nombre de participants du buffets seront supprimés.\n\nLes paramètres du formulaire et les tableaux seront conservés.`,
      action_button_text: 'Remettre à zéro'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: accountToDelete
    }).afterClosed().subscribe(id_joueur => {
      if (id_joueur){
        this.gestionService.reset()
          .subscribe(message => {
            this.gestion_joueur.getAllJoueurs();
            this.notifyService.notifyUser(message.message, this.snackBar, 'success', 2500, 'OK');
          }, err => {
            this.notifyService.notifyUser(err.message, this.snackBar, 'error', 2500, 'OK');
          });
      }
    });
  }

}
