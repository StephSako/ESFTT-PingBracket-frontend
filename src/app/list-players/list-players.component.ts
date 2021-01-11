import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JoueurService } from '../Service/joueur.service';
import { JoueurInterface } from '../Interface/Joueur';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { PoulesService } from '../Service/poules.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableauInterface } from '../Interface/Tableau';

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
    consolante: null
  };
  @Output() updatePoules: EventEmitter<any> = new EventEmitter();
  @Output() getBinomes: EventEmitter<any> = new EventEmitter();
  @Output() updateUnassignedPlayers: EventEmitter<any> = new EventEmitter();
  listJoueurs: JoueurInterface[] = [];
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
              private route: ActivatedRoute) { }

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
      this.updateJoueurs();
      this.updateOtherPlayers();
    });
  }

  updateJoueurs(): void {
    this.joueurService.getTableauPlayers(this.idTableau).subscribe(joueurs => this.listJoueurs = joueurs);
  }

  updateOtherPlayers(): void {
    this.joueurService.getOtherPlayer(this.idTableau).subscribe(joueurs => {
      this.otherPlayers = joueurs;
    });
  }

  subscribe(): void {
    this.joueurService.create([this.tableau], this.joueur)
      .subscribe(() => {
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
        }, err =>  console.error(err));
  }

  unsubscribe(joueur: JoueurInterface): void {
    const playerToDelete: Dialog = {
      id: joueur._id,
      action: 'Désinscrire le joueur du tableau ?',
      option: null,
      third_button: false,
      action_button_text: 'Désinscrire',
      third_button_text: null
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: playerToDelete
    }).afterClosed().subscribe(id_joueur => {
      if (id_joueur){
        this.joueurService.unsubscribe(this.tableau, id_joueur).subscribe(() => {
          if (this.tableau.format === 'simple') { this.updatePoules.emit(); }
          else if (this.tableau.format === 'double') {
            this.updateUnassignedPlayers.emit(); // Regénérer la liste des joueurs inscrits non assignés
            this.getBinomes.emit();
          }
          this.updateJoueurs();
          this.updateOtherPlayers();
        }, err => console.error(err));
      }
    });
  }

  isInvalidPlayer(): boolean {
    return (this.joueur.nom !== '' && this.joueur.nom !== null);
  }
}
