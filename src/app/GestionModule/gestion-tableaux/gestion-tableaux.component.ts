import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  PlayerCountPerTableau,
  TableauInterface,
} from '../../Interface/Tableau';
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
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-gestion-tableaux',
  templateUrl: './gestion-tableaux.component.html',
  styleUrls: ['./gestion-tableaux.component.scss'],
})
export class GestionTableauxComponent implements OnInit, OnDestroy {
  @Output() getAllJoueurs: EventEmitter<any> = new EventEmitter();
  displayedColumns: string[] = [
    'nom',
    'age_minimum',
    'format',
    'pariable',
    'type_licence',
    'maxNumberPlayers',
    'handicap',
    'poules',
    'hasChapeau',
    'nbPoules',
    'paliersWB_LB',
    'consolante',
    'inscrits',
    'statut',
    'edit',
    'unsubscribe_all',
    'delete',
  ];
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
    maxNumberPlayers: 2,
    age_minimum: null,
    nbPoules: 2,
    handicap: null,
    palierQualifies: 2,
    palierConsolantes: 4,
    hasChapeau: false,
    type_licence: null,
    pariable: false,
    bracketPariable: false,
    consolantePariable: false,
    ptsGagnesParisVainqueur: 0,
    ptsPerdusParisVainqueur: 0,
    ptsGagnesParisWB: 0,
    ptsPerdusParisWB: 0,
    ptsGagnesParisLB: 0,
    ptsPerdusParisLB: 0,
  };

  constructor(
    public appService: AppService,
    private tableauService: TableauService,
    private notifyService: NotifyService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private poulesService: PoulesService,
    private binomeService: BinomeService
  ) {}

  ngOnInit(): void {
    this.getAllTableaux();
    this.nbInscritsEventEmitter =
      this.tableauService.nbInscritsChange.subscribe(() =>
        this.getPlayerCountPerTableau()
      );
  }

  ngOnDestroy(): void {
    this.nbInscritsEventEmitter.unsubscribe();
  }

  getAllTableaux(): void {
    this.tableauService.getAllTableaux().subscribe(
      (allTableaux: TableauInterface[]) => {
        this.allTableaux = allTableaux;
        this.tableauService.tableauxSource.next(allTableaux);
        this.getPlayerCountPerTableau();
      },
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  getPlayerCountPerTableau(): void {
    this.tableauService.getPlayerCountPerTableau().subscribe(
      (playerCountPerTableau) =>
        (this.playerCountPerTableau = playerCountPerTableau),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  showPlayerCountPerTableau(tableau_id: string): number {
    return tableau_id &&
      this.playerCountPerTableau &&
      this.playerCountPerTableau[tableau_id]
      ? this.playerCountPerTableau[tableau_id]
      : 0;
  }

  setTableauFromForm(): void {
    this.tableau.nbPoules = this.tableau.poules ? this.tableau.nbPoules : null;
    this.tableau.maxNumberPlayers = this.tableau.maxNumberPlayers
      ? this.tableau.maxNumberPlayers
      : null;
    this.tableau.palierConsolantes = this.tableau.consolante
      ? this.tableau.palierConsolantes
      : null;
    this.tableau.bracketPariable = this.tableau.pariable
      ? this.tableau.bracketPariable
      : false;
    this.tableau.consolantePariable =
      this.tableau.pariable &&
      this.tableau.bracketPariable &&
      this.tableau.consolante
        ? this.tableau.consolantePariable
        : false;
    this.tableau.ptsGagnesParisVainqueur = this.tableau.pariable
      ? this.tableau.ptsGagnesParisVainqueur
      : 0;
    this.tableau.ptsPerdusParisVainqueur = this.tableau.pariable
      ? this.tableau.ptsPerdusParisVainqueur
      : 0;
    this.tableau.ptsGagnesParisWB =
      this.tableau.pariable && this.tableau.bracketPariable
        ? this.tableau.ptsGagnesParisWB
        : 0;
    this.tableau.ptsPerdusParisWB =
      this.tableau.pariable && this.tableau.bracketPariable
        ? this.tableau.ptsPerdusParisWB
        : 0;
    this.tableau.ptsGagnesParisLB =
      this.tableau.pariable &&
      this.tableau.consolantePariable &&
      this.tableau.bracketPariable &&
      this.tableau.consolante
        ? this.tableau.ptsGagnesParisLB
        : 0;
    this.tableau.ptsPerdusParisLB =
      this.tableau.pariable &&
      this.tableau.consolantePariable &&
      this.tableau.bracketPariable &&
      this.tableau.consolante
        ? this.tableau.ptsPerdusParisLB
        : 0;
  }

  create(): void {
    this.setTableauFromForm();
    this.tableauService.create(this.tableau).subscribe(
      () => {
        this.tableau = {
          format: null,
          nom: null,
          poules: false,
          is_launched: null,
          _id: null,
          consolante: null,
          maxNumberPlayers: 2,
          age_minimum: null,
          nbPoules: 2,
          handicap: null,
          palierQualifies: 2,
          palierConsolantes: 4,
          hasChapeau: false,
          type_licence: 1,
          pariable: false,
          bracketPariable: false,
          consolantePariable: false,
          ptsGagnesParisVainqueur: null,
          ptsPerdusParisVainqueur: null,
          ptsGagnesParisWB: null,
          ptsPerdusParisWB: null,
          ptsGagnesParisLB: null,
          ptsPerdusParisLB: null,
        };
        this.getAllTableaux();
        this.notifyService.notifyUser(
          'Tableau créé',
          this.snackBar,
          'success',
          'OK'
        );
      },
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  openEditDialog(tableau: TableauInterface): void {
    this.dialog.open(EditTableauComponent, {
      width: '80%',
      data: {
        tableau,
      },
    });
  }

  unsubscribeAll(tableau: TableauInterface): void {
    const playersToDelete: Dialog = {
      id: tableau._id,
      action: 'Désinscrire tous les joueurs du tableau ?',
      option: null,
      action_button_text: 'Désinscrire',
    };

    this.dialog
      .open(DialogComponent, {
        width: '45%',
        data: playersToDelete,
      })
      .afterClosed()
      .subscribe((id_tableau) => {
        if (id_tableau) {
          this.unsubscribeAllPlayers(tableau);
        }
      });
  }

  delete(tableau: TableauInterface): void {
    const tableauToDelete: Dialog = {
      id: tableau._id,
      action: 'Supprimer le tableau ?',
      option:
        'Les poules, binômes et brackets seront supprimés, et les joueurs désinscris.',
      action_button_text: 'Supprimer',
    };

    this.dialog
      .open(DialogComponent, {
        width: '55%',
        data: tableauToDelete,
      })
      .afterClosed()
      .subscribe(
        (id_tableau) => {
          if (id_tableau) {
            this.tableauService.delete(tableau).subscribe(
              () => {
                this.getAllTableaux();
                this.getAllJoueurs.emit();
                this.notifyService.notifyUser(
                  'Tableau supprimé',
                  this.snackBar,
                  'success',
                  'OK'
                );
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

  unsubscribeAllPlayers(tableau: TableauInterface): void {
    this.tableauService.unsubscribeAllPlayers(tableau._id).subscribe(
      () => {
        this.getAllTableaux();
        this.getAllJoueurs.emit();
        if (tableau.format === 'double') {
          this.removeAllBinomes(tableau);
        } else if (tableau.poules) {
          this.generatePoules(tableau);
        }
        this.notifyService.notifyUser(
          'Tous les joueurs ont été désinscris',
          this.snackBar,
          'success',
          'OK'
        );
      },
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  generatePoules(tableau: TableauInterface): void {
    this.poulesService.generatePoules(tableau).subscribe(
      () => {},
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  removeAllBinomes(tableau: TableauInterface): void {
    this.binomeService.removeAll(tableau._id).subscribe(
      () => {
        if (tableau.poules) {
          this.generatePoules(tableau);
        }
      },
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  isInvalidTableau(): boolean {
    return (
      this.tableau.type_licence !== null &&
      this.tableau.nom !== null &&
      this.tableau.nom.trim() !== '' &&
      ((this.tableau.poules && this.tableau.nbPoules !== null) ||
        !this.tableau.poules) &&
      ((this.tableau.format === 'double' &&
        this.tableau.maxNumberPlayers !== null) ||
        this.tableau.format === 'simple') &&
      (!this.tableau.pariable ||
        (this.tableau.pariable &&
          this.tableau.ptsGagnesParisVainqueur !== null &&
          this.tableau.ptsPerdusParisVainqueur !== null &&
          this.tableau.ptsGagnesParisWB !== null &&
          this.tableau.ptsPerdusParisWB !== null)) &&
      (!this.tableau.consolantePariable ||
        (this.tableau.consolantePariable &&
          this.tableau.ptsGagnesParisLB !== null &&
          this.tableau.ptsPerdusParisLB !== null))
    );
  }

  showAgeMinimum(age_minimum: number): string {
    return age_minimum ? '-' + age_minimum + ' ans' : '';
  }

  showTypeLicence(idTypeLicence: number): string {
    return idTypeLicence !== 1
      ? this.tableauService.showTypeLicence(idTypeLicence)
      : '';
  }
}
