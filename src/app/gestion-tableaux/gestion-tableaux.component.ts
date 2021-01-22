import { Component, OnInit } from '@angular/core';
import {PlayerCountPerTableau, TableauInterface} from '../Interface/Tableau';
import { TableauService } from '../Service/tableau.service';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditTableauComponent } from '../edit-tableau/edit-tableau.component';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import {PoulesService} from '../Service/poules.service';

@Component({
  selector: 'app-gestion-tableaux',
  templateUrl: './gestion-tableaux.component.html',
  styleUrls: ['./gestion-tableaux.component.scss']
})
export class GestionTableauxComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'age_minimum', 'format', 'poules', 'consolante', 'inscrits', 'edit', 'unsubscribe_all', 'delete'];
  allTableaux: TableauInterface[] = [];
  playerCountPerTableau: PlayerCountPerTableau[] = null;

  public tableau: TableauInterface = {
    nom: null,
    format: null,
    poules: null,
    _id: null,
    consolante: null,
    age_minimum: null
  };

  constructor(private tableauService: TableauService, private notifyService: NotifyService, private snackBar: MatSnackBar,
              public dialog: MatDialog, private poulesService: PoulesService) { }

  ngOnInit(): void {
    this.getAllTableaux();
  }

  getAllTableaux(): void {
    this.tableauService.getAll().subscribe(allTableaux => {
      this.allTableaux = allTableaux;
      this.getPlayerCountPerTableau();
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  getPlayerCountPerTableau(): void {
    this.tableauService.getPlayerCountPerTableau().subscribe(
      playerCountPerTableau => this.playerCountPerTableau = playerCountPerTableau, err => {
        this.notifyService.notifyUser(err.error.error, this.snackBar, 'error', 2000, 'OK');
      });
  }

  showPlayerCountPerTableau(tableau_id: string): number {
    return (this.tableau && this.playerCountPerTableau && this.playerCountPerTableau[tableau_id] ?
      this.playerCountPerTableau[tableau_id] : 0);
  }

  create(): void {
    this.tableauService.create(this.tableau).subscribe(() => {
          this.tableau = {
            format : null,
            nom : null,
            poules: null,
            _id : null,
            consolante: null,
            age_minimum: null
          };
          this.getAllTableaux();
          this.notifyService.notifyUser('Tableau créé', this.snackBar, 'success', 1500, 'OK');
        }, err => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
      });
  }

  edit(tableau: TableauInterface): void {
    this.dialog.open(EditTableauComponent, {
      width: '90%',
      data: tableau
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau){
        this.tableauService.edit(tableau).subscribe(() => {
          this.getAllTableaux();
        }, err => {
          this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
        });
      }
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  unsubscribeAllPlayers(tableau_id: string): void {
    this.tableauService.unsubscribeAllPlayers(tableau_id).subscribe(() => {
      this.getAllTableaux();
      if (this.tableau.poules) { this.generatePoules(); }
      this.notifyService.notifyUser('Joueurs désinscris', this.snackBar, 'success', 2000, 'OK');
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  generatePoules(): void {
    this.poulesService.generatePoules(this.tableau._id).subscribe(() => {}, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  unsubscribeAll(tableau_id: string): void {
    const playersToDelete: Dialog = {
      id: tableau_id,
      action: 'Désinscrire tous les joueurs du tableau ?',
      option: null,
      action_button_text: 'Désinscrire'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: playersToDelete
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau){ this.unsubscribeAllPlayers(id_tableau); }
    });
  }

  delete(tableau_id: string): void {
    const tableauToDelete: Dialog = {
      id: tableau_id,
      action: 'Supprimer le tableau ?',
      option: 'Les poules et brackets seront supprimés, et les joueurs désinscris.',
      action_button_text: 'Supprimer'
    };

    this.dialog.open(DialogComponent, {
      width: '55%',
      data: tableauToDelete
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau){ this.tableauService.delete(id_tableau).subscribe(() => {
        this.getAllTableaux();
        this.notifyService.notifyUser('Tableau supprimé', this.snackBar, 'success', 2000, 'OK');
      }, err => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
      }); }
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  isInvalidTableau(): boolean {
    return (this.tableau.nom !== '' && this.tableau.nom !== null && this.tableau.format !== null && this.tableau.nom.trim() !== '');
  }

  showAgeMinimum(age_minimum: number): string {
    return (age_minimum ? age_minimum + ' ans' : '');
  }
}
