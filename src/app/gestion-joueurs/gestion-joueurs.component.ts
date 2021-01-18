import { Component, OnInit } from '@angular/core';
import { JoueurInterface } from '../Interface/Joueur';
import { JoueurService } from '../Service/joueur.service';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditJoueurComponent } from '../edit-joueur/edit-joueur.component';
import { MatDialog } from '@angular/material/dialog';
import { TableauInterface } from '../Interface/Tableau';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import {PoulesService} from '../Service/poules.service';

@Component({
  selector: 'app-gestion-joueurs',
  templateUrl: './gestion-joueurs.component.html',
  styleUrls: ['./gestion-joueurs.component.scss']
})
export class GestionJoueursComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'classement', 'age', 'tableaux', 'edit', 'delete'];
  allJoueurs: JoueurInterface[] = [];

  public joueur: JoueurInterface = {
    nom: null,
    age: null,
    classement: null,
    _id: null,
    tableaux: []
  };

  constructor(private joueurService: JoueurService, private notifyService: NotifyService, private snackBar: MatSnackBar,
              public dialog: MatDialog, private poulesService: PoulesService) { }

  ngOnInit(): void {
    this.getAllJoueurs();
  }

  getAllJoueurs(): void {
    this.joueurService.getAllPlayers().subscribe(joueurs => this.allJoueurs = joueurs, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  generatePoules(): void {
    this.joueur.tableaux.forEach(tableau => {
      if (tableau.poules) {
        console.log(tableau.nom);
        this.poulesService.generatePoules(tableau._id).subscribe(() => {}, err => {
          this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
        });
      }
    });
  }

  create(): void {
    this.joueurService.create(
      this.joueur.tableaux, this.joueur).subscribe(() => {
        this.getAllJoueurs();
        this.generatePoules();
        this.notifyService.notifyUser('Joueur créé', this.snackBar, 'success', 1500, 'OK');
        this.joueur = {
          classement : null,
          nom : null,
          age: null,
          _id : null,
          tableaux: []
        }; }, err => this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'));
  }

  openEditDialog(joueur: JoueurInterface): void {
    this.dialog.open(EditJoueurComponent, {
      width: '80%',
      data: {
        joueur,
        createMode: false
      }
    });
  }

  delete(joueur_id: string): void {
    const playerToDelete: Dialog = {
      id: joueur_id,
      action: 'Supprimer le joueur des participants ?',
      option: 'S\'il est enregistré dans des poules, binômes de double ou tableaux, ils pourraient devenir incohérents et incorrectes. Vous devrez alors les regénérer.',
      action_button_text: 'Supprimer'
    };

    this.dialog.open(DialogComponent, {
      width: '55%',
      data: playerToDelete
    }).afterClosed().subscribe(id_joueur => {
      if (id_joueur){
        this.joueurService.delete(id_joueur).subscribe(() => this.getAllJoueurs(), err => console.error(err));
      }
    }, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  isInvalidPlayer(): boolean {
    return (this.joueur.nom !== '' && this.joueur.nom !== null && this.joueur.nom.trim() !== '');
  }

  showTableauxPlayer(tableaux: TableauInterface[]): string {
    return tableaux.map(tableau => tableau.nom).join(', ');
  }

}
