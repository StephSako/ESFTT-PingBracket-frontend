import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { JoueurInterface } from '../../Interface/Joueur';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TableauInterface } from '../../Interface/Tableau';
import { TableauService } from '../../Service/tableau.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-form-joueur',
  templateUrl: './form-joueur.component.html',
  styleUrls: ['./form-joueur.component.scss'],
})
export class FormJoueurComponent implements OnInit, OnDestroy {
  @Input() joueur: JoueurInterface = {
    nom: null,
    classement: null,
    buffet: null,
    age: null,
    _id: null,
    tableaux: null,
    pointage: null,
  };
  @Input() joueursInscrits: JoueurInterface[];
  @Output() alreadySubscribedOutput = new EventEmitter<boolean>();
  tableaux: TableauInterface[];
  private tableauxSubscription: Subscription;
  private tableauxEventEmitter: Subscription;

  constructor(
    private route: ActivatedRoute,
    private tableauService: TableauService,
    private notifyService: NotifyService,
    public dialog: MatDialog,
    private appService: AppService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getAllTableaux();
      this.tableauxSubscription = this.tableauService.tableauxSource.subscribe(
        (tableaux: TableauInterface[]) => (this.tableaux = tableaux)
      );
      this.tableauxEventEmitter = this.tableauService.tableauxChange.subscribe(
        () => this.getAllTableaux()
      );
    });
  }

  alertAlreadySubscribed() {
    this.alreadySubscribedOutput.emit(this.isAlreadySubscribed());
  }

  ngOnDestroy(): void {
    this.tableauxSubscription.unsubscribe();
    this.tableauxEventEmitter.unsubscribe();
  }

  getAllTableaux(): void {
    this.tableauService.getAllTableaux().subscribe(
      (tableaux) =>
        (this.tableaux = tableaux.filter(
          (t) =>
            t.is_launched === this.appService.getTableauState().PointageState
        )),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  setAuthorizedTableaux(): void {
    this.joueur.tableaux = this.joueur.tableaux.filter(
      (tableau) =>
        !(
          tableau.age_minimum !== null && this.joueur.age >= tableau.age_minimum
        )
    );
  }

  checkAge(): void {
    if (this.joueur.age) {
      if (this.joueur.age < 5) {
        this.joueur.age = 5;
      } else if (this.joueur.age > 17) {
        this.joueur.age = 17;
      }
    }
  }

  compareTableauWithOther(
    tableau1: TableauInterface,
    tableau2: TableauInterface
  ): boolean {
    return tableau1 && tableau2
      ? tableau1.nom === tableau2.nom
      : tableau1 === tableau2;
  }

  clickable(tableau: TableauInterface): boolean {
    return (
      tableau.age_minimum !== null &&
      (this.joueur.age === null || this.joueur.age >= tableau.age_minimum)
    );
  }

  isAlreadySubscribed(): boolean {
    return (
      this.joueur.nom &&
      this.joueursInscrits.length > 0 &&
      this.joueursInscrits.filter(
        (j_nom) => this.formatNom(j_nom.nom) === this.formatNom(this.joueur.nom)
      ).length > 0
    );
  }

  formatNom(nom: string): string {
    return nom
      .toUpperCase()
      .trim()
      .replace(/\s{2,}/g, ' ');
  }
}
