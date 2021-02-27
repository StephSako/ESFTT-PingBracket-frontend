import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TableauInterface } from '../Interface/Tableau';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableauService } from '../Service/tableau.service';
import { BracketService } from '../Service/bracket.service';
import { PoulesService } from '../Service/poules.service';
import { categoriesAge, formats } from '../options-tableaux';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { BinomeService } from '../Service/binome.service';

@Component({
  selector: 'app-edit-tableau',
  templateUrl: './edit-tableau.component.html',
  styleUrls: ['./edit-tableau.component.scss']
})
export class EditTableauComponent implements OnInit {

  tableau: TableauInterface;
  reactiveForm: FormGroup;
  formats: string[] = [];
  categoriesAge: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data, private snackBar: MatSnackBar, private bracketService: BracketService,
              private notifyService: NotifyService, private tableauService: TableauService, public dialog: MatDialog,
              private poulesService: PoulesService, private binomeService: BinomeService) {
    this.tableau = data.tableau;
  }

  ngOnInit(): void {
    this.formats = formats;
    this.categoriesAge = categoriesAge;
    this.reactiveForm = new FormGroup({
      nom: new FormControl(this.tableau.nom),
      format: new FormControl(this.tableau.format),
      consolante: new FormControl(this.tableau.consolante),
      nbPoules: new FormControl(this.tableau.poules ? this.tableau.nbPoules : 2),
      age_minimum: new FormControl(this.tableau.age_minimum),
      poules: new FormControl(this.tableau.poules)
    });
  }

  editTableau(): void {
    const poulesEdited = this.reactiveForm.get('poules').value !== this.tableau.poules;
    const nbPoulesEdited = this.reactiveForm.get('nbPoules').value !== this.tableau.nbPoules && !poulesEdited &&
      this.reactiveForm.get('poules').value;
    const formatEdited = this.reactiveForm.get('format').value !== this.tableau.format;
    const consolanteEdited = this.reactiveForm.get('consolante').value !== this.tableau.consolante
      && !this.reactiveForm.get('consolante').value;
    const ageMinimumEdited = this.reactiveForm.get('age_minimum').value !== this.tableau.age_minimum
      && this.reactiveForm.get('age_minimum').value !== null;

    if (consolanteEdited || (poulesEdited && !this.reactiveForm.get('poules').value) || ageMinimumEdited
      || (formatEdited && this.reactiveForm.get('format').value === 'simple')) {

      let optionMessage = '';
      if (consolanteEdited || (poulesEdited && !this.reactiveForm.get('poules').value) ||
        (formatEdited && this.reactiveForm.get('format').value === 'simple')) { optionMessage += 'Suppression : '; }
      if (consolanteEdited) { optionMessage += '- la consolante '; }
      if (poulesEdited && !this.reactiveForm.get('poules').value) { optionMessage += '- les poules'; }
      if (formatEdited) {
        if (this.reactiveForm.get('format').value === 'simple') { optionMessage += '- les binômes'; }
      }
      if (consolanteEdited || (poulesEdited && !this.reactiveForm.get('poules').value) ||
        (formatEdited && this.reactiveForm.get('format').value === 'simple')) { optionMessage += '. '; }

      if (ageMinimumEdited) { optionMessage += 'Les joueurs de -' + this.reactiveForm.get('age_minimum').value +
        ' ans seront désinscrits.'; }

      const tableauToEdit: Dialog = {
        id: this.tableau._id,
        action: 'Des informations ont été modifées.',
        option: optionMessage,
        action_button_text: 'Confirmer'
      };

      this.dialog.open(DialogComponent, {
        width: '75%',
        data: tableauToEdit
      }).afterClosed().subscribe(id_action => {
        if (id_action === this.tableau._id) {
          this.tableau.nom = this.reactiveForm.get('nom').value;
          this.tableau.age_minimum = this.reactiveForm.get('age_minimum').value;
          this.tableau.poules = this.reactiveForm.get('poules').value;
          this.tableau.nbPoules = this.tableau.poules ? this.reactiveForm.get('nbPoules').value : null;
          this.tableau.consolante = this.reactiveForm.get('consolante').value;
          this.tableau.format = this.reactiveForm.get('format').value;

          this.tableauService.edit(this.tableau).subscribe(() => {
            if (consolanteEdited) {
              this.bracketService.deleteBracket(this.tableau._id).subscribe(() => {
                this.tableauService.tableauxChange.emit(); // TODO OPTIMIZE
              }, err => this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'));
            }

            if (poulesEdited && !this.reactiveForm.get('poules').value) {
              this.poulesService.deletePoules(this.tableau._id).subscribe(() => {
              }, err => this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'));
            }

            if (ageMinimumEdited) {
              this.tableauService.unsubscribeInvalidPlayers(this.tableau).subscribe(() => {
                this.generatePoules(this.tableau);
                this.tableauService.tableauxChange.emit(); // TODO OPTIMIZE
              }, err => this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'));
            }

            if (formatEdited) {
              this.tableauService.edit(this.tableau).subscribe(() => {
                if (this.tableau.poules) { this.generatePoules(this.tableau); }
                if (this.reactiveForm.get('format').value === 'simple') {
                  this.binomeService.removeAll(this.tableau._id).subscribe(() => {
                  }, err => this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'));
                }
                else if (this.reactiveForm.get('format').value === 'double') {
                  this.binomeService.generate(this.tableau._id).subscribe(() => {
                    this.tableauService.tableauxChange.emit();
                  }, err => this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'));
                }
              }, err => this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'));
            }
          }, err => this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'));
        }
      });
    } else if (nbPoulesEdited) {
      const tableauToEdit: Dialog = {
        id: this.tableau._id,
        action: 'Le nombre de poules a été modifié.',
        option: 'Regénérer les poules du tableau ?',
        action_button_text: 'Regénérer'
      };

      this.dialog.open(DialogComponent, {
        width: '75%',
        data: tableauToEdit
      }).afterClosed().subscribe(id_action => {
        if (id_action === this.tableau._id) {
          this.tableau.nom = this.reactiveForm.get('nom').value;
          this.tableau.age_minimum = this.reactiveForm.get('age_minimum').value;
          this.tableau.poules = this.reactiveForm.get('poules').value;
          this.tableau.nbPoules = this.tableau.poules ? this.reactiveForm.get('nbPoules').value : null;
          this.tableau.consolante = this.reactiveForm.get('consolante').value;
          this.tableau.format = this.reactiveForm.get('format').value;

          this.tableauService.edit(this.tableau).subscribe(() => {
            this.generatePoules(this.tableau);
            this.tableauService.tableauxChange.emit();
          }, err => {
            this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
          });
        }
      });
    } else {
      this.tableau.nom = this.reactiveForm.get('nom').value;
      this.tableau.age_minimum = this.reactiveForm.get('age_minimum').value;
      this.tableau.poules = this.reactiveForm.get('poules').value;
      this.tableau.nbPoules = this.tableau.poules ? this.reactiveForm.get('nbPoules').value : null;
      this.tableau.consolante = this.reactiveForm.get('consolante').value;
      this.tableau.format = this.reactiveForm.get('format').value;

      this.tableauService.edit(this.tableau).subscribe(() => {
        if (poulesEdited && this.reactiveForm.get('poules').value) { this.generatePoules(this.tableau); }
        this.tableauService.tableauxChange.emit();
      }, err => this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'));
    }
  }

  generatePoules(tableau: TableauInterface): void {
    this.poulesService.generatePoules(tableau).subscribe(() => {}, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  isInvalid(): boolean {
    return (this.reactiveForm.get('nom').value !== null && this.reactiveForm.get('format').value !== null &&
      this.reactiveForm.get('nom').value.trim() !== ''
      && ((this.reactiveForm.get('poules').value && this.reactiveForm.get('nbPoules').value !== null)
        || !this.reactiveForm.get('poules').value));
  }
}
