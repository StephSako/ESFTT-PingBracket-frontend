import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TableauInterface } from '../../Interface/Tableau';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifyService } from '../../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableauService } from '../../Service/tableau.service';
import { BracketService } from '../../Service/bracket.service';
import { PoulesService } from '../../Service/poules.service';
import { Dialog } from '../../Interface/Dialog';
import { DialogComponent } from '../../SharedModule/dialog/dialog.component';
import { BinomeService } from '../../Service/binome.service';
import {
  categoriesAge,
  formats,
  statuts,
  typesLicenceTableau,
} from 'src/app/const/options-tableaux';
import { PariService } from 'src/app/Service/pari.service';

@Component({
  selector: 'app-edit-tableau',
  templateUrl: './edit-tableau.component.html',
  styleUrls: ['./edit-tableau.component.scss'],
})
export class EditTableauComponent implements OnInit {
  tableau: TableauInterface;
  reactiveForm: FormGroup;
  formats: string[] = formats;
  statuts: any[] = [];
  categoriesAge: any[] = categoriesAge;
  typesLicenceTableau: any[] = typesLicenceTableau;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private snackBar: MatSnackBar,
    private bracketService: BracketService,
    private notifyService: NotifyService,
    private tableauService: TableauService,
    public dialog: MatDialog,
    private pariService: PariService,
    private poulesService: PoulesService,
    private binomeService: BinomeService
  ) {
    this.tableau = data.tableau;
  }

  filterStatus(): void {
    this.statuts = statuts.filter(
      (statut) =>
        (this.value('poules') && statut.forNoPoule !== false) ||
        (!this.value('poules') && statut.forNoPoule === undefined)
    );
  }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      nom: new FormControl(this.tableau.nom),
      format: new FormControl(this.tableau.format),
      is_launched: new FormControl(this.tableau.is_launched),
      consolante: new FormControl(this.tableau.consolante),
      handicap: new FormControl(this.tableau.handicap),
      nbPoules: new FormControl(
        this.tableau.poules ? this.tableau.nbPoules : 2
      ),
      age_minimum: new FormControl(this.tableau.age_minimum),
      type_licence: new FormControl(this.tableau.type_licence),
      maxNumberPlayers: new FormControl(this.tableau.maxNumberPlayers),
      poules: new FormControl(this.tableau.poules),
      palierQualifies: new FormControl(this.tableau.palierQualifies),
      palierConsolantes: new FormControl(this.tableau.palierConsolantes),
      hasChapeau: new FormControl(this.tableau.hasChapeau),
      pariable: new FormControl(this.tableau.pariable),
      bracketPariable: new FormControl(this.tableau.bracketPariable),
      consolantePariable: new FormControl(this.tableau.consolantePariable),
      ptsGagnesParisVainqueur: new FormControl(
        this.tableau.ptsGagnesParisVainqueur
      ),
      ptsPerdusParisVainqueur: new FormControl(
        this.tableau.ptsPerdusParisVainqueur
      ),
      ptsGagnesParisWB: new FormControl(this.tableau.ptsGagnesParisWB),
      ptsPerdusParisWB: new FormControl(this.tableau.ptsPerdusParisWB),
      ptsGagnesParisLB: new FormControl(this.tableau.ptsGagnesParisLB),
      ptsPerdusParisLB: new FormControl(this.tableau.ptsPerdusParisLB),
    });
    this.filterStatus();
  }

  editTableau(): void {
    const poulesEdited = this.value('poules') !== this.tableau.poules;
    const pariableEdited = this.value('pariable') !== this.tableau.pariable;
    const consolantePariableEdited =
      this.value('consolantePariable') !== this.tableau.consolantePariable;
    const nbPoulesEdited =
      this.value('nbPoules') !== this.tableau.nbPoules &&
      !poulesEdited &&
      this.value('poules');
    const formatEdited = this.value('format') !== this.tableau.format;
    const consolanteEdited =
      this.value('consolante') !== this.tableau.consolante &&
      !this.value('consolante');
    const typeLicenceEdited =
      this.value('type_licence') !== this.tableau.type_licence &&
      this.value('type_licence') !== 1;
    const ageMinimumEdited =
      this.value('age_minimum') !== this.tableau.age_minimum &&
      this.value('age_minimum') !== null &&
      (this.value('age_minimum') < this.tableau.age_minimum ||
        this.tableau.age_minimum === null);

    if (
      consolanteEdited ||
      (poulesEdited && !this.value('poules')) ||
      ageMinimumEdited ||
      (formatEdited && this.value('format') === 'simple') ||
      nbPoulesEdited ||
      typeLicenceEdited ||
      pariableEdited ||
      consolantePariableEdited
    ) {
      let optionMessage = '';
      if (
        (pariableEdited && !this.value('pariable')) ||
        (consolantePariableEdited &&
          (!this.value('pariable') || !this.value('consolantePariable'))) ||
        consolanteEdited ||
        (poulesEdited && !this.value('poules')) ||
        (formatEdited && this.value('format') === 'simple')
      ) {
        optionMessage += 'Suppression : ';
      }
      if (consolanteEdited) {
        optionMessage += '- la consolante ';
      }
      if (poulesEdited && !this.value('poules')) {
        optionMessage += '- les poules';
      }

      // Gestion des paris
      if (
        pariableEdited &&
        !this.value('pariable') &&
        !this.value('consolantePariable') &&
        !consolantePariableEdited
      ) {
        optionMessage += '- les paris (phase finale)';
      }
      if (
        pariableEdited &&
        !this.value('pariable') &&
        ((!consolantePariableEdited && this.value('consolantePariable')) ||
          (consolantePariableEdited && !this.value('consolantePariable')))
      ) {
        optionMessage += '- les paris (phase finale et consolante)';
      }
      if (
        !pariableEdited &&
        consolantePariableEdited &&
        !this.value('consolantePariable')
      ) {
        optionMessage += '- les paris (phase consolante)';
      }

      if (formatEdited) {
        if (this.value('format') === 'simple') {
          optionMessage += '- les binômes';
        }
      }
      if (
        consolanteEdited ||
        (poulesEdited && !this.value('poules')) ||
        (formatEdited && this.value('format') === 'simple')
      ) {
        optionMessage += '. ';
      }

      if (ageMinimumEdited) {
        optionMessage +=
          'Les joueurs de -' +
          this.value('age_minimum') +
          ' ans seront désinscrits. ';
      }

      if (
        nbPoulesEdited ||
        ageMinimumEdited ||
        (formatEdited && this.value('poules'))
      ) {
        optionMessage += 'Les poules seront regénérées. ';
      }

      const typeLicenceToUnsubscribe = this.value('type_licence');
      if (typeLicenceEdited) {
        optionMessage +=
          'Les joueurs ' +
          (this.value('type_licence') === 2 ? 'compétiteurs' : 'loisirs') +
          ' seront désinscrits. ';
      }

      const tableauToEdit: Dialog = {
        id: this.tableau._id,
        action: 'Des informations ont été modifées.',
        option: optionMessage,
        action_button_text: 'Confirmer',
      };

      this.dialog
        .open(DialogComponent, {
          width: '75%',
          data: tableauToEdit,
        })
        .afterClosed()
        .subscribe((id_action) => {
          if (id_action === this.tableau._id) {
            this.setTableauFromForm();

            this.tableauService.edit(this.tableau).subscribe(
              () => {
                if (consolanteEdited) {
                  this.bracketService.deleteBracket(this.tableau._id).subscribe(
                    () => {},
                    (err) => this.emitErrorSnackbar(err)
                  );
                }

                if (poulesEdited && !this.tableau.poules) {
                  this.poulesService.deletePoules(this.tableau._id).subscribe(
                    () => {},
                    (err) => this.emitErrorSnackbar(err)
                  );
                }

                if (ageMinimumEdited || typeLicenceEdited) {
                  this.tableauService
                    .unsubscribeInvalidPlayers(this.tableau, {
                      age_flag: ageMinimumEdited,
                      type_licence_flag: typeLicenceEdited,
                      type_licence_to_unsubscribe: typeLicenceToUnsubscribe,
                    })
                    .subscribe(
                      () => {
                        this.tableauService.tableauxChange.emit();
                        this.tableauService.nbInscritsChange.emit();
                      },
                      (err) => this.emitErrorSnackbar(err)
                    );
                }

                if (formatEdited) {
                  if (this.tableau.format === 'simple') {
                    this.binomeService.removeAll(this.tableau._id).subscribe(
                      () => {},
                      (err) => this.emitErrorSnackbar(err)
                    );
                  } else if (this.tableau.format === 'double') {
                    this.binomeService
                      .generateBinomes(this.tableau._id)
                      .subscribe(
                        () => {},
                        (err) => this.emitErrorSnackbar(err)
                      );
                  }
                }

                // On supprime les paris si phase(s) non pariable(s)
                if (
                  pariableEdited &&
                  !this.value('pariable') &&
                  !this.value('consolantePariable') &&
                  !consolantePariableEdited
                ) {
                  this.pariService
                    .deleteParisTableauPhase('finale', this.tableau._id)
                    .subscribe(
                      () => {},
                      (err) => this.emitErrorSnackbar(err)
                    );
                }
                if (
                  pariableEdited &&
                  !this.value('pariable') &&
                  ((!consolantePariableEdited &&
                    this.value('consolantePariable')) ||
                    (consolantePariableEdited &&
                      !this.value('consolantePariable')))
                ) {
                  this.pariService
                    .deleteParisTableauPhase(null, this.tableau._id)
                    .subscribe(
                      () => {},
                      (err) => this.emitErrorSnackbar(err)
                    );
                }
                if (
                  !pariableEdited &&
                  consolantePariableEdited &&
                  !this.value('consolantePariable')
                ) {
                  this.pariService
                    .deleteParisTableauPhase('consolante', this.tableau._id)
                    .subscribe(
                      () => {},
                      (err) => this.emitErrorSnackbar(err)
                    );
                }

                if (nbPoulesEdited) {
                  this.tableauService.tableauxChange.emit();
                }

                // Regénération des poules
                if (
                  nbPoulesEdited ||
                  ageMinimumEdited ||
                  (formatEdited && this.tableau.poules)
                ) {
                  this.generatePoules(this.tableau);
                }
              },
              (err) => this.emitErrorSnackbar(err)
            );
          }
        });
    } else {
      this.setTableauFromForm();
      this.tableauService.edit(this.tableau).subscribe(
        () => {
          if (poulesEdited && this.tableau.poules) {
            this.generatePoules(this.tableau);
          }
          this.tableauService.tableauxChange.emit();
        },
        (err) => this.emitErrorSnackbar(err)
      );
    }
  }

  setTableauFromForm(): void {
    this.tableau.nom = this.value('nom');
    this.tableau.age_minimum = this.value('age_minimum');
    this.tableau.type_licence = this.value('type_licence');
    this.tableau.is_launched = this.value('is_launched');
    this.tableau.poules = this.value('poules');
    this.tableau.nbPoules = this.tableau.poules ? this.value('nbPoules') : null;
    this.tableau.maxNumberPlayers = this.value('maxNumberPlayers')
      ? this.value('maxNumberPlayers')
      : null;
    this.tableau.consolante = this.value('consolante');
    this.tableau.format = this.value('format');
    this.tableau.handicap = this.value('handicap');
    this.tableau.hasChapeau = this.value('hasChapeau');
    this.tableau.palierConsolantes = this.value('palierConsolantes');
    this.tableau.palierQualifies = this.value('palierQualifies');
    this.tableau.pariable = this.value('pariable');
    this.tableau.bracketPariable = this.value('bracketPariable');
    this.tableau.consolantePariable = this.value('pariable')
      ? this.value('consolantePariable')
      : false;
    this.tableau.ptsGagnesParisVainqueur = this.value('pariable')
      ? this.value('ptsGagnesParisVainqueur')
      : 0;
    this.tableau.ptsPerdusParisVainqueur = this.value('pariable')
      ? this.value('ptsPerdusParisVainqueur')
      : 0;
    this.tableau.ptsGagnesParisWB = this.value('pariable')
      ? this.value('ptsGagnesParisWB')
      : 0;
    this.tableau.ptsPerdusParisWB = this.value('pariable')
      ? this.value('ptsPerdusParisWB')
      : 0;
    this.tableau.ptsGagnesParisLB =
      this.value('pariable') && this.value('consolantePariable')
        ? this.value('ptsGagnesParisLB')
        : 0;
    this.tableau.ptsPerdusParisLB =
      this.value('pariable') && this.value('consolantePariable')
        ? this.value('ptsPerdusParisLB')
        : 0;
  }

  generatePoules(tableau: TableauInterface): void {
    this.poulesService.generatePoules(tableau).subscribe(
      () => {},
      (err) => this.emitErrorSnackbar(err)
    );
  }

  isValid(): boolean {
    return (
      this.value('type_licence') !== null &&
      this.value('nom') !== null &&
      this.value('nom').trim() !== '' &&
      ((this.value('poules') && this.value('nbPoules') !== null) ||
        !this.value('poules')) &&
      ((this.value('format') === 'double' &&
        this.value('maxNumberPlayers') !== null) ||
        this.value('format') === 'simple') &&
      (!this.value('pariable') ||
        (this.value('pariable') &&
          this.value('ptsGagnesParisVainqueur') !== null &&
          this.value('ptsPerdusParisVainqueur') !== null &&
          this.value('ptsGagnesParisWB') !== null &&
          this.value('ptsPerdusParisWB') !== null)) &&
      (!this.value('consolantePariable') ||
        (this.value('consolantePariable') &&
          this.value('ptsGagnesParisLB') !== null &&
          this.value('ptsPerdusParisLB') !== null))
    );
  }

  emitErrorSnackbar(err: string): void {
    this.notifyService.notifyUser(err, this.snackBar, 'error', 'OK');
  }

  simpleFormatPouleOnChange(): void {
    if (this.value('format') === 'simple') {
      this.reactiveForm.patchValue({
        poules: true,
      });
    }
    this.reactiveForm.get('hasChapeau').setValue(false);
  }

  value(field: string): any {
    return this.reactiveForm.get(field).value;
  }
}
