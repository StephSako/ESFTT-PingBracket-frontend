import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { JoueurInterface } from '../../Interface/Joueur';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { TableauInterface } from '../../Interface/Tableau';
import { TableauService } from '../../Service/tableau.service';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { JoueurService } from '../../Service/joueur.service';
import { PoulesService } from '../../Service/poules.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../../Service/notify.service';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-edit-joueur',
  templateUrl: './edit-joueur.component.html',
  styleUrls: ['./edit-joueur.component.scss'],
})
export class EditJoueurComponent implements OnInit, OnDestroy {
  reactiveForm: FormGroup;
  tableaux: TableauInterface[];
  joueur: JoueurInterface = {
    nom: null,
    age: null,
    classement: null,
    buffet: null,
    _id: null,
    tableaux: null,
    pointage: null,
  };
  createModeInput = false;
  private tableauxSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private tableauService: TableauService,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private joueurService: JoueurService,
    public dialog: MatDialog,
    private pouleService: PoulesService,
    private notifyService: NotifyService
  ) {
    this.joueur = data.joueur;
    this.createModeInput = data.createMode;
  }

  ngOnInit(): void {
    this.getAllTableaux();
    this.tableauxSubscription = this.tableauService.tableauxSource.subscribe(
      (tableaux: TableauInterface[]) => (this.tableaux = tableaux)
    );
    this.reactiveForm = new FormGroup({
      nom: new FormControl(this.joueur.nom),
      classement: new FormControl(this.joueur.classement),
      age: new FormControl(this.joueur.age),
      buffet: new FormControl(this.joueur.buffet),
    });
  }

  ngOnDestroy(): void {
    this.tableauxSubscription.unsubscribe();
  }

  getAllTableaux(): void {
    this.tableauService.getAllTableaux().subscribe(
      (tableaux) => (this.tableaux = tableaux),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  generatePoules(tableau: TableauInterface): void {
    this.pouleService.generatePoules(tableau).subscribe(
      () => {},
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  subscribe(tableau: TableauInterface): void {
    this.joueurService.create([tableau], this.joueur).subscribe(
      () => {
        this.joueur.tableaux.push(tableau);
        this.joueur.tableaux.sort((tableau1, tableau2) => {
          if (tableau1.nom < tableau2.nom) {
            return -1;
          }
          if (tableau1.nom > tableau2.nom) {
            return 1;
          }
          return 0;
        });
        this.tableauService.nbInscritsChange.emit();
        if (
          tableau.poules &&
          tableau.format === 'simple' &&
          tableau.is_launched ===
            this.appService.getTableauState().PointageState
        ) {
          this.generatePoules(tableau);
        }
      },
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }

  unsubscribe(tableau: TableauInterface): void {
    const tableauToDelete: Dialog = {
      id: tableau._id,
      action: 'Désinscrire le joueur du tableau ?',
      option: null,
      action_button_text: 'Désinscrire',
    };

    this.dialog
      .open(DialogComponent, {
        width: '45%',
        data: tableauToDelete,
      })
      .afterClosed()
      .subscribe((id_tableau) => {
        if (id_tableau) {
          this.joueurService.unsubscribe(tableau, this.joueur._id).subscribe(
            () => {
              this.joueur.tableaux = this.joueur.tableaux.filter(
                (tableauFilter) => tableauFilter._id !== id_tableau
              );

              if (tableau.poules) {
                this.generatePoules(tableau);
              }

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
      });
  }

  editPlayer(): void {
    const classementEdited =
      this.joueur.tableaux.filter(
        (tableau) =>
          tableau.is_launched ===
            this.appService.getTableauState().PointageState &&
          ((tableau.poules && tableau.format === 'simple') ||
            (tableau.type_licence === 2 &&
              (this.value('classement') !== 0 ||
                this.value('classement') !== null)) ||
            (tableau.type_licence === 3 &&
              (this.value('classement') === 0 ||
                this.value('classement') === null)))
      ).length > 0 && this.value('classement') !== this.joueur.classement;

    const ageEdited =
      this.joueur.tableaux.filter(
        (tableau) =>
          tableau.is_launched ===
            this.appService.getTableauState().PointageState &&
          tableau.age_minimum !== null &&
          (this.value('age') === null ||
            this.value('age') >= tableau.age_minimum)
      ).length > 0 && this.value('age') !== this.joueur.age;

    if (classementEdited || ageEdited) {
      const playerToEdit: Dialog = {
        id: this.joueur._id,
        action: 'Modifier le joueur',
        action_button_text: 'Valider',
      };

      this.dialog
        .open(DialogComponent, {
          width: '85%',
          data: playerToEdit,
        })
        .afterClosed()
        .subscribe((id_action) => {
          if (id_action === this.joueur._id) {
            this.joueur.nom = this.value('nom');
            this.joueur.classement = this.value('classement');
            this.joueur.age = this.value('age');
            this.joueur.buffet = this.value('buffet');

            this.joueurService.edit(this.joueur).subscribe(
              () => {
                // On régénère les poules des tableaux concernés
                this.joueur.tableaux
                  .filter(
                    (tableau) =>
                      tableau.poules &&
                      tableau.is_launched ===
                        this.appService.getTableauState().PointageState
                  )
                  .forEach((tableau) => this.generatePoules(tableau));

                // On désinscrit le joueur des tableaux concernés
                this.joueur.tableaux
                  .filter(
                    (tableau: TableauInterface) =>
                      tableau.is_launched ===
                        this.appService.getTableauState().PointageState &&
                      ((tableau.age_minimum !== null &&
                        (this.value('age') === null ||
                          this.value('age') >= tableau.age_minimum)) ||
                        (tableau.type_licence === 2 &&
                          (this.value('classement') !== 0 ||
                            this.value('classement') !== null)) ||
                        (tableau.type_licence === 3 &&
                          (this.value('classement') === 0 ||
                            this.value('classement') === null)))
                  )
                  .forEach((tableau) => {
                    this.joueurService
                      .unsubscribe(tableau, this.joueur._id)
                      .subscribe(
                        () => {
                          this.joueur.tableaux = this.joueur.tableaux.filter(
                            (value: TableauInterface) =>
                              !this.joueur.tableaux
                                .filter(
                                  (tableauFiltered: TableauInterface) =>
                                    (tableauFiltered.age_minimum !== null &&
                                      (this.value('age') === null ||
                                        this.value('age') >=
                                          tableauFiltered.age_minimum)) ||
                                    (tableauFiltered.type_licence === 2 &&
                                      (this.value('classement') !== 0 ||
                                        this.value('classement') !== null)) ||
                                    (tableauFiltered.type_licence === 3 &&
                                      (this.value('classement') === 0 ||
                                        this.value('classement') === null))
                                )
                                .includes(value)
                          );

                          if (
                            tableau.poules &&
                            tableau.is_launched ===
                              this.appService.getTableauState().PointageState
                          ) {
                            this.generatePoules(tableau);
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
                  });
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
        });
    } else if (!ageEdited && !classementEdited) {
      this.joueur.nom = this.value('nom');
      this.joueur.classement = this.value('classement');
      this.joueur.age = this.value('age');
      this.joueur.buffet = this.value('buffet');
      this.joueurService.edit(this.joueur).subscribe(
        () => {},
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
  }

  isInscrit(tableaux: TableauInterface[], tableau_id: string): boolean {
    return tableaux.some((tableau) => tableau._id === tableau_id);
  }

  isModified(): boolean {
    return (
      this.value('nom') !== this.joueur.nom ||
      this.classementModifying() ||
      this.ageModifying() ||
      this.buffetModifying()
    );
  }

  classementModifying(): boolean {
    return this.value('classement') !== this.joueur.classement;
  }

  ageModifying(): boolean {
    return this.value('age') !== this.joueur.age;
  }

  buffetModifying(): boolean {
    return this.value('buffet') !== this.joueur.buffet;
  }

  enabled(tableau: TableauInterface): boolean {
    const enabledAge: boolean =
      (tableau.age_minimum !== null &&
        this.joueur.age !== null &&
        this.joueur.age < tableau.age_minimum) ||
      tableau.age_minimum === null;

    const enabledClassement: boolean =
      tableau.type_licence === 1 ||
      (!this.joueur.classement && tableau.type_licence === 2) ||
      (this.joueur.classement && tableau.type_licence === 3);

    return enabledAge && enabledClassement;
  }

  errorAgeJoueur(tableau: TableauInterface): string {
    return tableau.age_minimum !== null
      ? this.joueur.age === null
        ? 'Âge requis'
        : this.joueur.age >= tableau.age_minimum
        ? 'Âge supérieur à ' + tableau.age_minimum + ' ans'
        : ''
      : null;
  }

  errorClassementJoueur(tableau: TableauInterface): string {
    return !this.joueur.classement && tableau.type_licence === 3
      ? "Requis d'être compétiteur"
      : this.joueur.classement && tableau.type_licence === 2
      ? "Requis d'être loisir"
      : null;
  }

  checkAge(): void {
    if (this.value('age')) {
      if (this.value('age') < 5) {
        this.reactiveForm.get('age').setValue(5);
      } else if (this.value('age') > 17) {
        this.reactiveForm.get('age').setValue(17);
      }
    }
  }

  value(field: string): any {
    return this.reactiveForm.get(field).value;
  }

  showTypeLicence(idTypeLicence: number): string {
    return this.tableauService.showTypeLicence(idTypeLicence);
  }
}
