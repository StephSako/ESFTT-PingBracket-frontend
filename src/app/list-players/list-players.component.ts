import { Component, OnInit } from '@angular/core';
import { JoueurService } from '../Service/joueur.service';
import { JoueurInterface } from '../Interface/Joueur';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { PoulesService } from '../Service/poules.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableauInterface} from '../Interface/Tableau';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../Service/notify.service';
import { TableauService} from '../Service/tableau.service';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.scss']
})
export class ListPlayersComponent implements OnInit {

  displayedColumns: string[];
  hostableTableau: TableauInterface;
  tableau: TableauInterface = {
    format: null,
    _id: null,
    nom: null,
    poules: null,
    consolante: null,
    age_minimum: null
  };
  listJoueurs: JoueurInterface[] = [];
  listTableauHostable: TableauInterface[] = [];
  otherPlayers: JoueurInterface[] = [];
  idTableau: string;
  joueur: JoueurInterface;

  constructor(private joueurService: JoueurService, public dialog: MatDialog, private poulesService: PoulesService, private router: Router,
              private route: ActivatedRoute, private snackBar: MatSnackBar, private notifyService: NotifyService,
              private tableauService: TableauService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.idTableau = this.router.url.split('/').pop();
      this.joueur = {
        nom: null,
        age : null,
        classement: null,
        _id: null,
        tableaux: null
      };
      this.getTableau();
      this.updateJoueurs();
      this.updateOtherPlayers();
      this.hostableTableau = null;
    });
  }

  updateJoueurs(): void {
    this.joueurService.getTableauPlayers(this.idTableau).subscribe(joueurs => this.listJoueurs = joueurs, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  getTableau(): void {
    this.tableauService.getTableau(this.idTableau).subscribe(tableau => {
      this.tableau = tableau;
      this.displayedColumns = (this.tableau.age_minimum !== null ?
        ['nom', 'classement', 'age', 'delete'] : ['nom', 'classement', 'delete']);
      if (this.tableau.age_minimum) { this.getTableauxHostable(); }
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  getTableauxHostable(): void {
    this.tableauService.tableauEnabledToHostPlayers(this.tableau).subscribe(
      listTableaux => this.listTableauHostable = listTableaux, err => {
      this.notifyService.notifyUser(err.error.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  updateOtherPlayers(): void {
    this.joueurService.getOtherPlayer(this.idTableau).subscribe(joueurs => { this.otherPlayers = joueurs; }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  subscribe(): void {
    this.joueurService.create([this.tableau], this.joueur).subscribe(() => {
      this.joueur = {
        classement : null,
        age : null,
        nom : null,
        _id : null,
        tableaux: null
      };
      if (this.tableau.poules) { this.generatePoules(); }
      this.updateJoueurs();
      this.updateOtherPlayers();
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  unsubscribePlayer(joueur_id: string): void {
    this.joueurService.unsubscribe(this.tableau, joueur_id).subscribe(() => {
      if (this.tableau.poules) { this.generatePoules(); }
      this.updateJoueurs();
      this.updateOtherPlayers();
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  unsubscribeAllPlayers(): void {
    this.tableauService.unsubscribeAllPlayers(this.tableau._id).subscribe(() => {
      if (this.tableau.poules) { this.generatePoules(); }
      this.updateJoueurs();
      this.updateOtherPlayers();
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  unsubscribe(joueur: JoueurInterface): void {
    const playerToDelete: Dialog = {
      id: joueur._id,
      action: 'Désinscrire le joueur du tableau et régénérer les poules du tableau ?',
      option: null,
      action_button_text: 'Désinscrire'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: playerToDelete
    }).afterClosed().subscribe(id_joueur => {
      if (id_joueur){ this.unsubscribePlayer(id_joueur); }
    });
  }

  isInvalidPlayer(): boolean {
    return (this.joueur.nom !== '' && this.joueur.nom !== null && this.joueur.nom.trim() !== ''
      && this.otherPlayers.filter(joueur => this.joueur.nom === joueur.nom).length !== 0);
  }

  unsubscribeAll(): void {
    const playersToDelete: Dialog = {
      id: 'true',
      action: 'Désinscrire tous les joueurs du tableau ?',
      option: null,
      action_button_text: 'Désinscrire'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: playersToDelete
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau){ this.unsubscribeAllPlayers(); }
    });
  }

  moveAllPlayers(): void {
    const playersToDelete: Dialog = {
      id: this.hostableTableau._id,
      action: 'Basculer tous les joueurs dans ce tableau et réinitialiser les poules ?',
      option: null,
      action_button_text: 'Basculer'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: playersToDelete
    }).afterClosed().subscribe(id_hostable_tableau => {
      if (id_hostable_tableau){
        this.joueurService.moveAllPlayers(this.tableau._id, this.hostableTableau._id).subscribe(() =>
        {
          this.updateJoueurs();
          this.generateHostablePoules();
          this.generatePoules();
          this.notifyService.notifyUser('Les joueurs ont été basculés', this.snackBar, 'success', 2000, 'OK');
        }, err => this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK'));
      }
    });
  }

  generateHostablePoules(): void {
    this.poulesService.generatePoules(this.hostableTableau).subscribe(() => {}, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  playersMovable(): boolean {
    return (this.tableau.age_minimum !== null && this.listTableauHostable.length && this.listJoueurs.length > 0);
  }

  generatePoules(): void {
    this.poulesService.generatePoules(this.tableau).subscribe(() => {}, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }
}
