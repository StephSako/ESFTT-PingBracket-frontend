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
          tableau.is_launched === 0
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
              this.generatePoules(tableau);
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
      this.joueur.tableaux.filter((tableau) => tableau.format === 'simple')
        .length > 0 &&
      this.reactiveForm.get('classement').value !== this.joueur.classement;
    const ageEdited =
      this.joueur.tableaux.filter(
        (tableau) =>
          tableau.age_minimum !== null &&
          (this.reactiveForm.get('age').value === null ||
            this.reactiveForm.get('age').value >= tableau.age_minimum)
      ).length > 0 && this.reactiveForm.get('age').value !== this.joueur.age;

    if (classementEdited) {
      const playerToEdit: Dialog = {
        id: this.joueur._id,
        action: 'Le classement a été modifié.',
        option:
          'Régénérer les poules des tableaux ' +
          this.joueur.tableaux
            .filter((tableau) => tableau.format === 'simple')
            .map(
              (tableau) => tableau.nom[0].toUpperCase() + tableau.nom.slice(1)
            )
            .join(', ') +
          ' ?',
        action_button_text: 'Modifier le joueur et régénérer les poules',
      };

      this.dialog
        .open(DialogComponent, {
          width: '85%',
          data: playerToEdit,
        })
        .afterClosed()
        .subscribe((id_action) => {
          if (id_action === this.joueur._id) {
            this.joueur.nom = this.reactiveForm.get('nom').value;
            this.joueur.classement = this.reactiveForm.get('classement').value;
            this.joueur.age = this.reactiveForm.get('age').value;
            this.joueur.buffet = this.reactiveForm.get('buffet').value;
            this.joueurService.edit(this.joueur).subscribe(
              () => {
                this.joueur.tableaux
                  .filter(
                    (tableau) =>
                      tableau.poules &&
                      tableau.format === 'simple' &&
                      tableau.is_launched === 0
                  )
                  .forEach((tableau) => this.generatePoules(tableau));
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
    if (ageEdited) {
      const tableauToDelete: Dialog = {
        id: this.joueur._id,
        action: "L'âge a été modifié.",
        option:
          'Désinscrire le joueur et régénérer les poules des tableaux ' +
          this.joueur.tableaux
            .filter((tableau) => tableau.age_minimum !== null)
            .map(
              (tableau) => tableau.nom[0].toUpperCase() + tableau.nom.slice(1)
            )
            .join(', ') +
          ' ?',
        action_button_text: 'Modifier le joueur et régénérer les poules',
      };

      this.dialog
        .open(DialogComponent, {
          width: '85%',
          data: tableauToDelete,
        })
        .afterClosed()
        .subscribe((id_action) => {
          if (id_action === this.joueur._id) {
            this.joueur.nom = this.reactiveForm.get('nom').value;
            this.joueur.classement = this.reactiveForm.get('classement').value;
            this.joueur.age = this.reactiveForm.get('age').value;
            this.joueur.buffet = this.reactiveForm.get('buffet').value;
            this.joueurService.edit(this.joueur).subscribe(
              () => {
                this.joueur.tableaux
                  .filter(
                    (tableau) =>
                      tableau.age_minimum !== null &&
                      (this.reactiveForm.get('age').value === null ||
                        this.reactiveForm.get('age').value >=
                          tableau.age_minimum)
                  )
                  .forEach((tableau) => {
                    this.joueurService
                      .unsubscribe(tableau, this.joueur._id)
                      .subscribe(
                        () => {
                          this.joueur.tableaux = this.joueur.tableaux.filter(
                            (value) =>
                              !this.joueur.tableaux
                                .filter(
                                  (tableauFiltered) =>
                                    tableauFiltered.age_minimum !== null &&
                                    (this.reactiveForm.get('age').value ===
                                      null ||
                                      this.reactiveForm.get('age').value >=
                                        tableauFiltered.age_minimum)
                                )
                                .includes(value)
                          );

                          if (
                            tableau.format === 'simple' &&
                            tableau.format === 'simple' &&
                            tableau.is_launched === 0
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
      this.joueur.nom = this.reactiveForm.get('nom').value;
      this.joueur.classement = this.reactiveForm.get('classement').value;
      this.joueur.age = this.reactiveForm.get('age').value;
      this.joueur.buffet = this.reactiveForm.get('buffet').value;
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
      this.reactiveForm.get('nom').value !== this.joueur.nom ||
      this.classementModifying() ||
      this.ageModifying() ||
      this.buffetModifying()
    );
  }

  classementModifying(): boolean {
    return this.reactiveForm.get('classement').value !== this.joueur.classement;
  }

  ageModifying(): boolean {
    return this.reactiveForm.get('age').value !== this.joueur.age;
  }

  buffetModifying(): boolean {
    return this.reactiveForm.get('buffet').value !== this.joueur.buffet;
  }

  enabled(tableau: TableauInterface): boolean {
    return (
      (tableau.age_minimum !== null &&
        this.joueur.age !== null &&
        this.joueur.age < tableau.age_minimum) ||
      tableau.age_minimum === null
    );
  }

  errorAgeJoueur(tableau: TableauInterface): string {
    return this.joueur.age === null
      ? 'Âge requis'
      : 'Âge supérieur à ' + tableau.age_minimum + ' ans';
  }
}
