import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { JoueurInterface } from '../../Interface/Joueur';
import { JoueurService } from '../../Service/joueur.service';
import { NotifyService } from '../../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditJoueurComponent } from '../edit-joueur/edit-joueur.component';
import { MatDialog } from '@angular/material/dialog';
import { TableauInterface } from '../../Interface/Tableau';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { PoulesService } from '../../Service/poules.service';
import { Subscription } from 'rxjs';
import { TableauService } from '../../Service/tableau.service';
import { AppService } from 'src/app/app.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-gestion-joueurs',
  templateUrl: './gestion-joueurs.component.html',
  styleUrls: ['./gestion-joueurs.component.scss'],
})
export class GestionJoueursComponent implements OnInit, OnDestroy, OnChanges {
  @Output() getAllJoueurs: EventEmitter<any> = new EventEmitter();
  displayedColumns: string[] = [
    'pointage',
    'nom',
    'classement',
    'age',
    'tableaux',
    'buffet',
    'edit',
    'delete',
  ];
  @Input() allJoueurs: JoueurInterface[] = [];
  dataSource = new MatTableDataSource(this.allJoueurs);
  private tableauxEventEmitter: Subscription;
  public alreadySubscribed = false;
  @ViewChild(MatSort) sort = new MatSort();

  public joueur: JoueurInterface = {
    nom: null,
    age: null,
    classement: null,
    buffet: null,
    pointage: false,
    _id: null,
    tableaux: [],
  };

  constructor(
    private joueurService: JoueurService,
    private notifyService: NotifyService,
    private snackBar: MatSnackBar,
    private appService: AppService,
    public dialog: MatDialog,
    private poulesService: PoulesService,
    private tableauService: TableauService
  ) {}

  ngOnInit(): void {
    this.getAllJoueurs.emit();
    this.tableauxEventEmitter = this.tableauService.tableauxChange.subscribe(
      () => this.getAllJoueurs.emit()
    );
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.allJoueurs);
    this.dataSource.sort = this.sort;
  }

  setAlreadySubscribed(isAlreadySubscribed: boolean): void {
    this.alreadySubscribed = isAlreadySubscribed;
  }

  generatePoules(tableau: TableauInterface): void {
    this.poulesService.generatePoules(tableau).subscribe(
      () => {},
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  create(): void {
    this.joueurService.create(this.joueur.tableaux, this.joueur).subscribe(
      () => {
        this.getAllJoueurs.emit();
        this.tableauService.nbInscritsChange.emit();

        this.joueur.tableaux.forEach((tableau) => {
          if (
            tableau.poules &&
            tableau.format === 'simple' &&
            tableau.is_launched ===
              this.appService.getTableauState().PointageState
          ) {
            this.generatePoules(tableau);
          }
        });

        this.notifyService.notifyUser(
          'Joueur créé',
          this.snackBar,
          'success',
          'OK'
        );
        this.joueur = {
          classement: null,
          nom: null,
          age: null,
          _id: null,
          buffet: null,
          tableaux: [],
          pointage: false,
        };
      },
      (err) =>
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK')
    );
  }

  openEditDialog(joueur: JoueurInterface): void {
    this.dialog.open(EditJoueurComponent, {
      width: '90%',
      data: {
        joueur,
        createMode: false,
      },
    });
  }

  delete(joueur: JoueurInterface): void {
    const playerToDelete: Dialog = {
      id: joueur._id,
      action: 'Supprimer le joueur ?',
      option:
        'Les poules seront régénérées dans les tableaux auxquels il est inscrit. Régénérez manuellement les tableaux finaux.',
      action_button_text: 'Supprimer',
    };

    this.dialog
      .open(DialogComponent, {
        width: '55%',
        data: playerToDelete,
      })
      .afterClosed()
      .subscribe(
        (id_joueur) => {
          if (id_joueur) {
            this.joueurService.delete(id_joueur).subscribe(
              () => {
                this.getAllJoueurs.emit();
                joueur.tableaux.forEach((tableau) => {
                  if (
                    tableau.poules &&
                    tableau.is_launched ===
                      this.appService.getTableauState().PointageState
                  ) {
                    this.generatePoules(tableau);
                  }
                });

                this.tableauService.nbInscritsChange.emit();
              },
              (err) => {
                this.notifyService.notifyUser(
                  err.error,
                  this.snackBar,
                  'error',
                  'OK'
                );
              }
            );
          }
        },
        (err) => {
          this.notifyService.notifyUser(
            err.error,
            this.snackBar,
            'error',
            'OK'
          );
        }
      );
  }

  isInvalidPlayer(): boolean {
    return this.joueur.nom !== null && this.joueur.nom.trim() !== '';
  }

  showTypeLicence(idTypeLicence: number): string {
    return this.tableauService.showTypeLicence(idTypeLicence);
  }

  showTableauxPlayer(tableaux: TableauInterface[]): string {
    return tableaux
      .map(
        (tableau) =>
          tableau.nom +
          (tableau.age_minimum !== null || tableau.type_licence !== 1
            ? ' ('
            : '') +
          (tableau.age_minimum !== null ? tableau.age_minimum + ' ans' : '') +
          (tableau.type_licence !== 1
            ? (tableau.age_minimum !== null ? ' - ' : '') +
              this.showTypeLicence(tableau.type_licence)
            : '') +
          (tableau.age_minimum !== null || tableau.type_licence !== 1
            ? ')'
            : '')
      )
      .join(', ');
  }

  ngOnDestroy(): void {
    this.tableauxEventEmitter.unsubscribe();
  }

  pointerPlayer(joueur: JoueurInterface): void {
    this.joueurService.pointerPlayer(joueur).subscribe(
      (res) => {
        joueur.pointage = !joueur.pointage;
        this.notifyService.notifyUser(res, this.snackBar, 'success', 'OK');
      },
      (err) => this.notifyService.notifyUser(err, this.snackBar, 'error', 'OK')
    );
  }

  getNbLoisirs(): number {
    return this.allJoueurs.filter(
      (joueur: JoueurInterface) => !joueur.classement
    ).length;
  }

  getNbCompetiteurs(): number {
    return this.allJoueurs.filter(
      (joueur: JoueurInterface) => joueur.classement
    ).length;
  }

  hideDeleteJoueurButton(joueur: JoueurInterface): boolean {
    return (
      joueur.tableaux.filter(
        (tableau: TableauInterface) =>
          tableau.is_launched > this.appService.getTableauState().PointageState
      ).length !== 0
    );
  }
}
