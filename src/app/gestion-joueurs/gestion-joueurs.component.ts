import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { JoueurInterface } from '../Interface/Joueur';
import { JoueurService } from '../Service/joueur.service';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditJoueurComponent } from '../edit-joueur/edit-joueur.component';
import { MatDialog } from '@angular/material/dialog';
import { TableauInterface } from '../Interface/Tableau';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { PoulesService } from '../Service/poules.service';
import { Subscription } from 'rxjs';
import { TableauService } from '../Service/tableau.service';

@Component({
  selector: 'app-gestion-joueurs',
  templateUrl: './gestion-joueurs.component.html',
  styleUrls: ['./gestion-joueurs.component.scss']
})
export class GestionJoueursComponent implements OnInit, OnDestroy {

  @Output() getAllJoueurs: EventEmitter<any> = new EventEmitter();
  displayedColumns: string[] = ['nom', 'classement', 'age', 'tableaux', 'edit', 'delete'];
  @Input() allJoueurs: JoueurInterface[] = [];
  private tableauxEventEmitter: Subscription;

  public joueur: JoueurInterface = {
    nom: null,
    age: null,
    classement: null,
    _id: null,
    tableaux: []
  };

  constructor(private joueurService: JoueurService, private notifyService: NotifyService, private snackBar: MatSnackBar,
              public dialog: MatDialog, private poulesService: PoulesService, private tableauService: TableauService) { }

  ngOnInit(): void {
    this.getAllJoueurs.emit();
    this.tableauxEventEmitter = this.tableauService.tableauxChange.subscribe(() => this.getAllJoueurs.emit());
  }

  generatePoules(tableaux: TableauInterface[]): void {
    tableaux.forEach(tableau => {
      if (tableau.poules) {
        this.poulesService.generatePoules(tableau).subscribe(() => {}, err => {
          this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
        });
      }
    });
  }

  create(): void {
    this.joueurService.create(this.joueur.tableaux, this.joueur).subscribe(() => {
        this.getAllJoueurs.emit();
        this.generatePoules(this.joueur.tableaux);
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

  delete(joueur: JoueurInterface): void {
    const playerToDelete: Dialog = {
      id: joueur._id,
      action: 'Supprimer le joueur ?',
      option: 'Les poules seront régénérées dans les tableaux auxquels il est inscrit. Régénérer manuellement les tableaux finaux.',
      action_button_text: 'Supprimer'
    };

    this.dialog.open(DialogComponent, {
      width: '55%',
      data: playerToDelete
    }).afterClosed().subscribe(id_joueur => {
      if (id_joueur){ this.joueurService.delete(id_joueur).subscribe(() => {
        this.getAllJoueurs.emit();
        this.generatePoules(joueur.tableaux);
      }, err => {
        this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
      }); }
    }, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  isInvalidPlayer(): boolean {
    return (this.joueur.nom !== null && this.joueur.nom.trim() !== '');
  }

  showTableauxPlayer(tableaux: TableauInterface[]): string {
    return tableaux.map(tableau => tableau.nom + (tableau.age_minimum ? ' -' + tableau.age_minimum + ' ans' : '')).join(', ');
  }

  ngOnDestroy(): void {
    this.tableauxEventEmitter.unsubscribe();
  }
}
