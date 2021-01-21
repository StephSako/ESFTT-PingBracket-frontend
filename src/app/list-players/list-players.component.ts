import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JoueurService } from '../Service/joueur.service';
import { JoueurInterface } from '../Interface/Joueur';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { PoulesService } from '../Service/poules.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableauInterface } from '../Interface/Tableau';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../Service/notify.service';
import {TableauService} from '../Service/tableau.service';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.scss']
})
export class ListPlayersComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'classement', 'delete'];
  @Input() tableau: TableauInterface = {
    format: null,
    _id: null,
    nom: null,
    poules: null,
    consolante: null,
    age_minimum: null
  };
  @Output() updatePoules: EventEmitter<any> = new EventEmitter();
  @Output() getBinomes: EventEmitter<any> = new EventEmitter();
  @Output() updateUnassignedPlayers: EventEmitter<any> = new EventEmitter();
  listJoueurs: JoueurInterface[] = [];
  listTableauHostable: TableauInterface[] = [];
  otherPlayers: JoueurInterface[] = [];
  idTableau: string;

  public joueur: JoueurInterface = {
    nom: null,
    age : null,
    classement: null,
    _id: null,
    tableaux: null
  };

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
      console.log(this.tableau.age_minimum);
      this.updateJoueurs();
      this.updateOtherPlayers();
      if (this.tableau && this.tableau.age_minimum !== null) { this.getTableauxHostable(); }
    });
  }

  updateJoueurs(): void {
    this.joueurService.getTableauPlayers(this.idTableau).subscribe(joueurs => this.listJoueurs = joueurs, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  getTableauxHostable(): void {
    this.tableauService.tableauEnabledToHostPlayers(this.tableau.age_minimum).subscribe(listTableaux =>
    {
      this.listTableauHostable = listTableaux;
      console.log(this.listTableauHostable);
    }, err => {
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
          if (this.tableau.format === 'simple') { this.updatePoules.emit(); }
          else if (this.tableau.format === 'double') {
            this.getBinomes.emit();
            this.updateUnassignedPlayers.emit();
          }
          this.updateJoueurs();
          this.updateOtherPlayers();
        }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  unsubscribePlayer(joueur_id: string): void {
    this.joueurService.unsubscribe(this.tableau, joueur_id).subscribe(() => {
      if (this.tableau.format === 'simple') { this.updatePoules.emit(); }
      else if (this.tableau.format === 'double') {
        this.updateUnassignedPlayers.emit(); // Regénérer la liste des joueurs inscrits non assignés
        this.getBinomes.emit();
      }
      this.updateJoueurs();
      this.updateOtherPlayers();
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  unsubscribe(joueur: JoueurInterface): void {
    const playerToDelete: Dialog = {
      id: joueur._id,
      action: 'Désinscrire le joueur du tableau ?',
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
    }).afterClosed().subscribe(id_joueur => {
      if (id_joueur){
        this.listJoueurs.forEach(joueur => { this.unsubscribePlayer(joueur._id); });
      }
    });
  }

  moveAllPlayers(): void {
    console.log();
  }
}
