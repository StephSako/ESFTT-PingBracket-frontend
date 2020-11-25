import { Component, OnInit } from '@angular/core';
import {JoueurService} from '../Service/joueur.service';
import {JoueurInterface} from '../Interface/Joueur';
import {MatDialog} from '@angular/material/dialog';
import {EditJoueurComponent} from '../edit-joueur/edit-joueur.component';
import {DialogInterface} from '../Interface/DialogInterface';
import {DialogComponent} from '../dialog/dialog.component';
import {NotifyService} from '../Service/notify.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.scss']
})
export class ListPlayersComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'type', 'classement', 'edit', 'delete'];

  public listJoueurs: JoueurInterface[];

  joueur: JoueurInterface = {
    nom: null,
    type: null,
    classement: null,
    _id: null
  };

  constructor(private joueurService: JoueurService, public dialog: MatDialog, private notifyService: NotifyService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.updateAllJoueurs();
  }

  updateAllJoueurs(): void {
    this.joueurService.getAll().subscribe(joueurs => this.listJoueurs = joueurs);
  }

  create(): void {
    this.joueurService.create(this.joueur)
      .subscribe(
        () => {
          this.updateAllJoueurs();
          this.notifyService.notifyUser('Joueur inscrit au tableau', this.snackBar, 'success', 1500, 'OK');
        },
        err => {
          console.error(err);
        }
      );
  }

  edit(joueur: JoueurInterface): void {
    this.dialog.open(EditJoueurComponent, {
      width: '60%',
      data: joueur
    }).afterClosed().subscribe(() => {
      this.joueurService.edit(joueur).subscribe(() => {
        this.updateAllJoueurs();
      }, err => { console.error(err); });
    });
  }

  delete(id_joueur: number): void {
    const accountToDelete: DialogInterface = {
      id: id_joueur,
      action: 'Désinscrire le joueur du tableau ?'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: accountToDelete
    }).afterClosed().subscribe(() => {
      this.joueurService.delete(id_joueur).subscribe(() => {
        this.updateAllJoueurs();
      }, err => { console.error(err); });
    });
  }

  isInvalid(): boolean {
    return (this.joueur.nom != null);
  }

}
