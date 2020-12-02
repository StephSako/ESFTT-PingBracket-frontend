import { Component, OnInit } from '@angular/core';
import { JoueurService } from '../Service/joueur.service';
import { JoueurInterface } from '../Interface/Joueur';
import { MatDialog } from '@angular/material/dialog';
import { EditJoueurComponent } from '../edit-joueur/edit-joueur.component';
import { DialogInterface } from '../Interface/DialogInterface';
import { DialogComponent } from '../dialog/dialog.component';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PoulesService } from '../Service/poules.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.scss']
})
export class ListPlayersComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'classement', 'edit', 'delete'];

  listJoueurs: JoueurInterface[];
  otherPlayers: JoueurInterface[];
  nomTableau: string;

  public joueur: JoueurInterface = {
    nom: null,
    classement: null,
    _id: null
  };

  constructor(private joueurService: JoueurService, public dialog: MatDialog, private notifyService: NotifyService,
              private snackBar: MatSnackBar, private poulesService: PoulesService, private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.nomTableau = this.router.url.split('/').pop();
      this.updateJoueurs();
    });
  }

  updateJoueurs(): void {
    this.joueurService.getTableauPlayers(this.nomTableau).subscribe(joueurs => {
      this.listJoueurs = joueurs;
      this.updateOtherPlayers();
    });
  }

  updateOtherPlayers(): void {
    this.joueurService.getOtherPlayer(this.nomTableau).subscribe(joueurs => this.otherPlayers = joueurs);
  }

  create(): void {
    this.joueurService.create(this.nomTableau, this.joueur)
      .subscribe(() => {
          this.updateJoueurs();
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
      this.joueurService.edit(this.nomTableau, joueur).subscribe(() => {
        this.updateJoueurs();
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
      this.joueurService.delete(this.nomTableau, id_joueur).subscribe(() => {
        this.updateJoueurs();
      }, err => { console.error(err); });
    });
  }

  isInvalidPlayer(): boolean {
    return (this.joueur.nom !== '' && this.joueur.nom !== null);
  }
}
