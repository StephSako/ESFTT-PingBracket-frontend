import { Component, OnInit } from '@angular/core';
import {JoueurInterface} from '../Interface/Joueur';
import {JoueurService} from '../Service/joueur.service';
import {NotifyService} from '../Service/notify.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditJoueurComponent} from '../edit-joueur/edit-joueur.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-gestion-joueurs',
  templateUrl: './gestion-joueurs.component.html',
  styleUrls: ['./gestion-joueurs.component.scss']
})
export class GestionJoueursComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'classement', 'tableaux', 'edit', 'delete'];
  allJoueurs: JoueurInterface[];

  public joueur: JoueurInterface = {
    nom: null,
    classement: null,
    _id: null,
    tableaux: null
  };

  constructor(private joueurService: JoueurService, private notifyService: NotifyService, private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllJoueurs();
  }

  getAllJoueurs(): void {
    this.joueurService.getAllPlayers().subscribe(joueurs => this.allJoueurs = joueurs);
  }

  create(): void {
    this.joueurService.create(null, this.joueur)
      .subscribe(() => {
          this.joueur = {
            classement : null,
            nom : null,
            _id : null,
            tableaux: null
          };
          this.getAllJoueurs();
          this.notifyService.notifyUser('Joueur créé', this.snackBar, 'success', 1500, 'OK');
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
        this.getAllJoueurs();
      }, err => { console.error(err); });
    });
  }

  isInvalidPlayer(): boolean {
    return (this.joueur.nom !== '' && this.joueur.nom !== null);
  }

}
