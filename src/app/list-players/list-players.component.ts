import {Component, Input, OnInit} from '@angular/core';
import { JoueurService } from '../Service/joueur.service';
import { JoueurInterface } from '../Interface/Joueur';
import { MatDialog } from '@angular/material/dialog';
import { EditJoueurComponent } from '../edit-joueur/edit-joueur.component';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PoulesService } from '../Service/poules.service';
import { ActivatedRoute, Router } from '@angular/router';
import {TableauInterface} from '../Interface/Tableau';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.scss']
})
export class ListPlayersComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'classement', 'edit', 'delete'];

  listJoueurs: JoueurInterface[];
  otherPlayers: JoueurInterface[];
  @Input() tableau: TableauInterface = {
    format: null,
    _id: null,
    nom: null,
    consolante: null
  };

  public joueur: JoueurInterface = {
    nom: null,
    classement: null,
    _id: null,
    tableaux: null
  };

  constructor(private joueurService: JoueurService, public dialog: MatDialog, private notifyService: NotifyService,
              private snackBar: MatSnackBar, private poulesService: PoulesService, private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.joueur = {
        nom: null,
        classement: null,
        _id: null,
        tableaux: null
      };
      this.updateJoueurs();
      this.updateOtherPlayers();
    });
  }

  updateJoueurs(): void {
    this.joueurService.getTableauPlayers(this.tableau._id).subscribe(joueurs => this.listJoueurs = joueurs);
  }

  updateOtherPlayers(): void {
    this.joueurService.getOtherPlayer(this.tableau._id).subscribe(joueurs => {
      this.otherPlayers = joueurs;
    });
  }

  create(): void {
    this.joueurService.create([this.tableau._id], this.joueur)
      .subscribe(() => {
          this.joueur = {
            classement : null,
            nom : null,
            _id : null,
            tableaux: null
          };
          this.updateJoueurs();
          this.updateOtherPlayers();
          this.notifyService.notifyUser('Joueur inscrit au tableau', this.snackBar, 'success', 1500, 'OK');
        },
        err => {
          console.error(err);
        }
      );
  }

  edit(joueur: JoueurInterface): void {
    this.dialog.open(EditJoueurComponent, {
      width: '80%',
      data: joueur
    }).afterClosed().subscribe(id_joueur => {
      if (id_joueur) {
        this.joueurService.edit(joueur).subscribe(() => {
          this.updateJoueurs();
        }, err => { console.error(err); });
      }
    });
  }

  unsubscribe(joueur: JoueurInterface): void {
    const accountToDelete: Dialog = {
      id: joueur._id,
      action: 'Désinscrire le joueur du tableau ?'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: accountToDelete
    }).afterClosed().subscribe(id_joueur => {
      if (id_joueur){
        this.joueurService.unsubscribe(this.tableau._id, id_joueur).subscribe(() => {
          this.updateJoueurs();
          this.updateOtherPlayers();
        }, err => { console.error(err); });
      }
    });
  }

  isInvalidPlayer(): boolean {
    return (this.joueur.nom !== '' && this.joueur.nom !== null);
  }
}
