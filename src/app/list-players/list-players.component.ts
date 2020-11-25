import { Component, OnInit } from '@angular/core';
import {JoueurService} from '../Service/joueur.service';
import {JoueurInterface} from '../Interface/Joueur';
import {MatDialog} from '@angular/material/dialog';
import {EditJoueurComponent} from '../edit-joueur/edit-joueur.component';
import {DialogInterface} from '../Interface/DialogInterface';
import {DialogComponent} from '../dialog/dialog.component';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.scss']
})
export class ListPlayersComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'type', 'classement', 'edit', 'delete'];

  public listJoueurs: JoueurInterface[];

  constructor(private joueurService: JoueurService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.updateAllJoueurs();
  }

  updateAllJoueurs(): void {
    this.joueurService.getAll().subscribe(joueurs => this.listJoueurs = joueurs);
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
      action: 'Désinscrire le joueur du tableau ?',
      subtitle: ''
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: accountToDelete
    }).afterClosed().subscribe(result => {
      this.joueurService.delete(result).subscribe(() => {
        this.updateAllJoueurs();
      }, err => { console.error(err); });
    });
  }

}
