import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { PlayerCountPerTableau, TableauInterface } from '../../Interface/Tableau';
import { TableauService } from '../../Service/tableau.service';
import { NotifyService } from '../../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditTableauComponent } from '../edit-tableau/edit-tableau.component';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { PoulesService } from '../../Service/poules.service';
import { BinomeService } from '../../Service/binome.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gestion-tableaux',
  templateUrl: './gestion-tableaux.component.html',
  styleUrls: ['./gestion-tableaux.component.scss']
})
export class GestionTableauxComponent implements OnInit, OnDestroy {

  @Output() getAllJoueurs: EventEmitter<any> = new EventEmitter();
  displayedColumns: string[] = ['nom', 'age_minimum', 'format', 'poules', 'nbPoules', 'consolante', 'inscrits', 'statut', 'edit', 'unsubscribe_all', 'delete'];
  allTableaux: TableauInterface[] = [];
  playerCountPerTableau: PlayerCountPerTableau[] = null;
  nbInscritsEventEmitter: Subscription;

  public tableau: TableauInterface = {
    nom: null,
    format: null,
    poules: null,
    is_launched: null,
    _id: null,
    consolante: null,
    age_minimum: null,
    nbPoules: 2
  };

  constructor(private tableauService: TableauService, private notifyService: NotifyService, private snackBar: MatSnackBar,
              public dialog: MatDialog, private poulesService: PoulesService, private binomeService: BinomeService) {}

  ngOnInit(): void {
    this.getAllTableaux();
    this.nbInscritsEventEmitter = this.tableauService.nbInscritsChange.subscribe(() => this.getPlayerCountPerTableau());
  }

  ngOnDestroy(): void {
    this.nbInscritsEventEmitter.unsubscribe();
  }

  getAllTableaux(): void {
    this.tableauService.getAllTableaux().subscribe(allTableaux => {
      this.allTableaux = allTableaux;
      this.tableauService.tableauxSource.next(allTableaux);
      this.getPlayerCountPerTableau();
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  getPlayerCountPerTableau(): void {
    this.tableauService.getPlayerCountPerTableau().subscribe(
      playerCountPerTableau => this.playerCountPerTableau = playerCountPerTableau, err => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
      });
  }

  showPlayerCountPerTableau(tableau_id: string): number {
    return (tableau_id && this.playerCountPerTableau && this.playerCountPerTableau[tableau_id] ?
      this.playerCountPerTableau[tableau_id] : 0);
  }

  create(): void {
    if (!this.tableau.poules) this.tableau.nbPoules = null;
    this.tableauService.create(this.tableau).subscribe(() => {
          this.tableau = {
            format : null,
            nom : null,
            poules: null,
            is_launched: null,
            _id : null,
            consolante: null,
            age_minimum: null,
            nbPoules: 2
          };
          this.getAllTableaux();
          this.notifyService.notifyUser('Tableau créé', this.snackBar, 'success', 'OK');
        }, err => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
      });
  }

  openEditDialog(tableau: TableauInterface): void {
    this.dialog.open(EditTableauComponent, {
      width: '80%',
      data: {
        tableau
      }
    });
  }

  unsubscribeAll(tableau: TableauInterface): void {
    const playersToDelete: Dialog = {
      id: tableau._id,
      action: 'Désinscrire tous les joueurs du tableau ?',
      option: null,
      action_button_text: 'Désinscrire'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: playersToDelete
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau) this.unsubscribeAllPlayers(tableau);
    });
  }

  delete(tableau: TableauInterface): void {
    const tableauToDelete: Dialog = {
      id: tableau._id,
      action: 'Supprimer le tableau ?',
      option: 'Les poules, binômes et brackets seront supprimés, et les joueurs désinscris.',
      action_button_text: 'Supprimer'
    };

    this.dialog.open(DialogComponent, {
      width: '55%',
      data: tableauToDelete
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau){ this.tableauService.delete(tableau).subscribe(() => {
        this.getAllTableaux();
        this.getAllJoueurs.emit();
        this.notifyService.notifyUser('Tableau supprimé', this.snackBar, 'success','OK');
      }, err => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
      }); }
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  unsubscribeAllPlayers(tableau: TableauInterface): void {
    this.tableauService.unsubscribeAllPlayers(tableau._id).subscribe(() => {
      this.getAllTableaux();
      this.getAllJoueurs.emit();
      if (tableau.format === 'double') this.removeAllBinomes(tableau);
      else if (tableau.poules) this.generatePoules(tableau);
      this.notifyService.notifyUser('Tous les joueurs ont été désinscris', this.snackBar, 'success','OK');
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  generatePoules(tableau: TableauInterface): void {
    this.poulesService.generatePoules(tableau).subscribe(() => {}, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  removeAllBinomes(tableau: TableauInterface): void {
    this.binomeService.removeAll(tableau._id).subscribe(() => {
      if (tableau.poules) this.generatePoules(tableau);
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  isInvalidTableau(): boolean {
    return (this.tableau.nom !== null && this.tableau.format !== null && this.tableau.nom.trim() !== ''
      && ((this.tableau.poules && this.tableau.nbPoules !== null) || !this.tableau.poules));
  }

  showAgeMinimum(age_minimum: number): string {
    return (age_minimum ? age_minimum + ' ans' : '');
  }
}
