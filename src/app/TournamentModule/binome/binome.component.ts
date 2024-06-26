import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { JoueurInterface } from '../../Interface/Joueur';
import { TableauInterface } from '../../Interface/Tableau';
import { ActivatedRoute, Router } from '@angular/router';
import { TableauService } from '../../Service/tableau.service';
import { NotifyService } from '../../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BinomeInterface } from '../../Interface/Binome';
import { BinomeService } from '../../Service/binome.service';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-binome',
  templateUrl: './binome.component.html',
  styleUrls: ['./binome.component.scss'],
})
export class BinomeComponent implements OnInit, OnDestroy {
  listJoueursTotal: JoueurInterface[] = [];
  @Input() binomes: BinomeInterface[] = [];
  @Input() subscribedUnassignedPlayers: JoueurInterface[] = [];
  tableau: TableauInterface = {
    format: null,
    _id: null,
    poules: null,
    nom: null,
    is_launched: null,
    consolante: null,
    maxNumberPlayers: null,
    age_minimum: null,
    nbPoules: null,
    handicap: null,
    palierQualifies: null,
    palierConsolantes: null,
    hasChapeau: null,
    type_licence: null,
    pariable: null,
    consolantePariable: null,
    ptsGagnesParisVainqueur: null,
    ptsPerdusParisVainqueur: null,
    ptsGagnesParisWB: null,
    ptsPerdusParisWB: null,
    ptsGagnesParisLB: null,
    ptsPerdusParisLB: null,
  };
  private tableauxEditionSubscription: Subscription;
  @Output() generatePoules: EventEmitter<any> = new EventEmitter();
  @Output() getAllBinomes: EventEmitter<any> = new EventEmitter();
  @Output() getSubscribedUnassignedPlayers: EventEmitter<any> =
    new EventEmitter();
  showChapeauColors = false;

  onScrollEvent(): void {
    const element = document.getElementById('listPlayers');
    if (element) {
      if (window.scrollY >= 173) {
        element.classList.remove('absolutePos');
        element.classList.add('stickyPos');
      } else {
        element.classList.add('absolutePos');
        element.classList.remove('stickyPos');
      }
    }
  }

  constructor(
    private binomeService: BinomeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private notifyService: NotifyService,
    private appService: AppService,
    private tableauService: TableauService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getTableau();

      this.tableauxEditionSubscription =
        this.tableauService.tableauxEditSource.subscribe(
          (tableau: TableauInterface) => {
            this.tableau = tableau;
            this.showChapeauColors = tableau.hasChapeau;
          }
        );

      this.tableauService.listeJoueurs.subscribe(
        (listJoueursTotal: JoueurInterface[]) => {
          this.listJoueursTotal = listJoueursTotal;
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.tableauxEditionSubscription.unsubscribe();
  }

  getTableau(): void {
    this.tableauService
      .getTableau(this.router.url.split('/').pop())
      .subscribe((tableau) => {
        this.tableau = tableau;
        this.showChapeauColors = tableau.hasChapeau;
        this.getAllBinomes.emit();
        if (this.tableau.format === 'double') {
          this.getSubscribedUnassignedPlayers.emit();
        }
      });
  }

  editBinome(
    event: CdkDragDrop<[id: JoueurInterface], any>,
    id_binome: string
  ): void {
    if (event.previousContainer === event.container) {
      // Le joueur n'a pas changé de binôme
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (
        event.container.data.length < this.tableau.maxNumberPlayers ||
        id_binome === null /* Si un joueur est sorti d'un binôme */
      ) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        this.binomeService
          .editBinome(
            event.item.data[1],
            id_binome,
            event.container.data,
            event.item.data[0]
          )
          .subscribe(
            () => {
              if (
                this.tableau.poules &&
                this.tableau.is_launched ===
                  this.appService.getTableauState().PointageState
              ) {
                this.generatePoules.emit();
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
      } else {
        this.notifyService.notifyUser(
          'Le binôme est complet',
          this.snackBar,
          'error',
          'OK'
        );
      }
    }
  }

  unsubscribeDblClick(idBinome, idPlayer): void {
    this.binomeService.removePlayer(idBinome, idPlayer).subscribe(
      () => {
        this.getAllBinomes.emit();
        if (
          this.tableau.poules &&
          this.tableau.is_launched ===
            this.appService.getTableauState().PointageState
        ) {
          this.generatePoules.emit();
        }
        this.getSubscribedUnassignedPlayers.emit();
      },
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  nbPlayers(): number {
    return this.binomes.length > 0
      ? this.binomes
          .map((binome) => binome.joueurs.length)
          .reduce((a, b) => a + b)
      : 0;
  }

  getChapeau(id: string): any[] {
    if (this.showChapeauColors && this.listJoueursTotal.length > 0) {
      const chapeaux = this.binomeService.getChapeaux(this.listJoueursTotal);

      const isChapeauHaut = chapeaux.chapeauHaut.map((j) => j._id).indexOf(id);
      return [
        isChapeauHaut < 0 ? 'chapeauBas' : 'chapeauHaut',
        isChapeauHaut < 0
          ? chapeaux.chapeauBas.map((j) => j._id).indexOf(id)
          : chapeaux.chapeauHaut.map((j) => j._id).indexOf(id),
      ];
    }
    return ['', ''];
  }
}
