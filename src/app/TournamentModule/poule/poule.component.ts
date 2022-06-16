import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PoulesService } from '../../Service/poules.service';
import { JoueurInterface } from '../../Interface/Joueur';
import { PouleInterface } from '../../Interface/Poule';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { TableauInterface } from '../../Interface/Tableau';
import { TableauService } from '../../Service/tableau.service';
import { NotifyService } from '../../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { HandicapComponent } from './handicap/handicap.component';

@Component({
  selector: 'app-poule',
  templateUrl: './poule.component.html',
  styleUrls: ['./poule.component.scss']
})
export class PouleComponent implements OnInit {

  @Input() poules: PouleInterface[] = [];
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
    handicap: null
  };
  @Output() getAllPoules: EventEmitter<any> = new EventEmitter();
  private tableauxEditionSubscription: Subscription;

  constructor(private pouleService: PoulesService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar,
    private gestionService: TableauService, private notifyService: NotifyService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getTableau();

      this.tableauxEditionSubscription = this.gestionService.tableauxEditSource.subscribe((tableau: TableauInterface) => {
        this.tableau = tableau;

        // On change le visuel des toutes les poules si le tableau est terminé
        if (this.tableau.is_launched === 2) {
          this.poules = this.poules.map(poule => {
            poule.locked = true;
            return poule;
          })
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.tableauxEditionSubscription.unsubscribe();
  }

  getTableau(): void {
    this.gestionService.getTableau(this.router.url.split('/').pop()).subscribe(tableau => {
      this.tableau = tableau;
      this.getAllPoules.emit();
    });
  }

  editPoule(event: CdkDragDrop<[id: JoueurInterface], any>, id_poule: string): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.pouleService.editPoule(id_poule, event.container.data).subscribe(() => {}, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  setStatus(poule: PouleInterface): void {
    this.pouleService.setStatus(poule).subscribe(() => this.getAllPoules.emit(), err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error','OK');
    });
  }

  showParticipant(objectRef: string, participant_s): string {
    if (objectRef === 'Joueurs'){
      return participant_s.nom + ' - ' + participant_s.classement + ' points';
    } else if (objectRef === 'Binomes') {
      return participant_s.joueurs.map((participant, index) => {
        return (index > 0 ? '<br>' : '') + participant.nom;
      }).join('');
    }
  }

  openMatchesHandicap(listeJoueurs: JoueurInterface[]): void {
    this.dialog.open(HandicapComponent, {
      width: '50%',
      data: {
        listeJoueurs
      }
    });
  }
}
