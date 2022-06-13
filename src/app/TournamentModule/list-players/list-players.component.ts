import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JoueurService } from '../../Service/joueur.service';
import { JoueurInterface } from '../../Interface/Joueur';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { PoulesService } from '../../Service/poules.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableauInterface} from '../../Interface/Tableau';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import { TableauService} from '../../Service/tableau.service';
import { BinomeService } from '../../Service/binome.service';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

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
    is_launched: null,
    nom: null,
    poules: null,
    consolante: null,
    maxNumberPlayers: null,
    age_minimum: null,
    nbPoules: null
  };
  listJoueurs: JoueurInterface[] = [];
  listTableauHostable: TableauInterface[] = [];
  otherPlayers: JoueurInterface[] = [];
  joueur: JoueurInterface;
  joueurControl = new FormControl('');
  optionsListJoueurs: Observable<JoueurInterface[]>;
  showAutocomplete = false;
  private tableauxEditionSubscription: Subscription;
  @Output() generatePoules: EventEmitter<any> = new EventEmitter();
  @Output() getAllBinomes: EventEmitter<any> = new EventEmitter();
  @Output() getSubscribedUnassignedPlayers: EventEmitter<any> = new EventEmitter();

  constructor(private joueurService: JoueurService, public dialog: MatDialog, private poulesService: PoulesService, private router: Router,
              private route: ActivatedRoute, private snackBar: MatSnackBar, private notifyService: NotifyService,
              private tableauService: TableauService, private binomeService: BinomeService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.joueur = {
        nom: null,
        age : null,
        buffet: null,
        classement: null,
        _id: null,
        tableaux: null
      };

      this.getTableau(this.router.url.split('/').pop());
      this.hostableTableau = null;

      if (this.otherPlayers) {
        this.optionsListJoueurs = this.joueurControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }

      this.tableauxEditionSubscription = this.tableauService.tableauxEditSource.subscribe((tableau: TableauInterface) => {
        this.tableau = tableau;
      });
    });
  }

  ngOnDestroy(): void {
    this.tableauxEditionSubscription.unsubscribe();
  }

  _filter(value: string): JoueurInterface[] {
    if (value && this.otherPlayers != null){
      const filterValue = value.toLowerCase();
      return this.otherPlayers.filter(joueur => joueur.nom.toLowerCase().includes(filterValue)
        && (this.tableau.age_minimum !== null ? (joueur.age !== null && joueur.age < this.tableau.age_minimum) : true));
    } else { return []; }
  }

  typingAutocomplete(event): void{
    this.showAutocomplete = event && event.length > 0;
  }

  getAllPlayers(): void {
    this.joueurService.getTableauPlayers(this.tableau._id).subscribe(joueurs => this.listJoueurs = joueurs, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  getTableau(tableau_id: string): void {
    this.tableauService.getTableau(tableau_id).subscribe(tableau => {
      this.tableau = tableau;
      this.getAllPlayers();
      this.getUnsubscribedPlayers();
      this.displayedColumns = (this.tableau.age_minimum !== null ?
        ['nom', 'classement', 'age', 'delete'] : ['nom', 'classement', 'delete']);
      if (this.tableau.age_minimum) this.getTableauxHostable();
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  getTableauxHostable(): void {
    this.tableauService.tableauEnabledToHostPlayers(this.tableau).subscribe(
      listTableaux => this.listTableauHostable = listTableaux, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  getUnsubscribedPlayers(): void {
    this.joueurService.getUnsubscribedPlayer(this.tableau._id).subscribe(joueurs => this.otherPlayers = joueurs, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  subscribe(): void {
    this.joueurService.create([this.tableau], this.joueur).subscribe(() => {
      this.joueur = {
        classement : null,
        age : null,
        nom : null,
        _id : null,
        buffet: null,
        tableaux: null
      };
      if (this.tableau.poules && this.tableau.format === 'simple') this.generatePoules.emit();
      if (this.tableau.format === 'double') {
        this.getAllBinomes.emit();
        this.getSubscribedUnassignedPlayers.emit();
      }
      this.getAllPlayers();
      this.getUnsubscribedPlayers();
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  unsubscribePlayer(joueur_id: string): void {
    this.joueurService.unsubscribe(this.tableau, joueur_id).subscribe(() => {
      if (this.tableau.poules) this.generatePoules.emit();
      if (this.tableau.format === 'double') {
        this.getAllBinomes.emit();
        this.getSubscribedUnassignedPlayers.emit();
      }
      this.getAllPlayers();
      this.getUnsubscribedPlayers();
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  unsubscribeAllPlayers(): void {
    this.tableauService.unsubscribeAllPlayers(this.tableau._id).subscribe(() => {
      if (this.tableau.format === 'double') {
        this.removeAllBinomes();
      }
      else if (this.tableau.poules) this.generatePoules.emit();
      this.getAllPlayers();
      this.getUnsubscribedPlayers();
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
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
      if (id_joueur){
        this.unsubscribePlayer(id_joueur);
      }
    });
  }

  isInvalidPlayer(): boolean {
    return (this.joueur.nom !== null && this.joueur.nom.trim() !== ''
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
      if (id_tableau){
        this.unsubscribeAllPlayers();

        if (this.tableau.format === 'double') {
          this.getAllBinomes.emit();
          this.getSubscribedUnassignedPlayers.emit();
        }
      }
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
          this.getAllPlayers();
          this.generateHostablePoules();
          if (this.tableau.poules) this.generatePoules.emit();
          if (this.tableau.format === 'double') {
            this.getAllBinomes.emit();
            this.getSubscribedUnassignedPlayers.emit();
          }
          this.notifyService.notifyUser('Les joueurs ont été basculés', this.snackBar, 'success','OK');
        }, err => this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK'));
      }
    });
  }

  generateHostablePoules(): void {
    this.poulesService.generatePoules(this.hostableTableau).subscribe(() => {}, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  playersMovable(): boolean {
    return (this.tableau.age_minimum !== null && this.listTableauHostable.length && this.listJoueurs.length > 0);
  }

  removeAllBinomes(): void {
    this.binomeService.removeAll(this.tableau._id).subscribe(() => {
      if (this.tableau.poules) this.generatePoules.emit();
      if (this.tableau.format === 'double') {
        this.getAllBinomes.emit();
        this.getSubscribedUnassignedPlayers.emit();
      }
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }
}
