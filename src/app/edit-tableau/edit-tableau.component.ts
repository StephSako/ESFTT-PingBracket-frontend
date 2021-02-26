import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TableauInterface } from '../Interface/Tableau';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableauService } from '../Service/tableau.service';
import { BracketService } from '../Service/bracket.service';
import { categoriesAge, formats } from '../options-tableaux';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-edit-tableau',
  templateUrl: './edit-tableau.component.html',
  styleUrls: ['./edit-tableau.component.scss']
})
export class EditTableauComponent implements OnInit {

  tableau: TableauInterface = {
    nom: null,
    format: null,
    _id: null,
    poules: null,
    consolante: null,
    age_minimum: null,
    nbPoules: null
  };
  reactiveForm: FormGroup;
  formats: string[] = [];
  categoriesAge: any[] = [];

  // @ts-ignore
  constructor(@Inject(MAT_DIALOG_DATA) public data, private snackBar: MatSnackBar, private bracketService: BracketService,
              private notifyService: NotifyService, private tableauService: TableauService, public dialog: MatDialog) {
    this.tableau = data.tableau;
  }

  ngOnInit(): void {
    this.formats = formats;
    this.categoriesAge = categoriesAge;
    this.reactiveForm = new FormGroup({
      nom: new FormControl(this.tableau.nom),
      format: new FormControl(this.tableau.format),
      consolante: new FormControl(this.tableau.consolante),
      nbPoules: new FormControl(this.tableau.nbPoules),
      age_minimum: new FormControl(this.tableau.age_minimum),
      poules: new FormControl(this.tableau.poules)
    });
  }

  editTableau(): void {
    const nbPoulesEdited = this.reactiveForm.get('nbPoules').value !== this.tableau.nbPoules;
    const poulesEdited = this.reactiveForm.get('poules').value !== this.tableau.poules;
    const formatEdited = this.reactiveForm.get('format').value !== this.tableau.format;
    const consolanteEdited = this.reactiveForm.get('consolante').value !== this.tableau.consolante;
    const ageMinimumEdited = this.reactiveForm.get('age_minimum').value !== this.tableau.age_minimum;

    if (consolanteEdited && !this.reactiveForm.get('consolante').value) {
      const tableauToEdit: Dialog = {
        id: this.tableau._id,
        action: 'Le tableau a été modifié.',
        option: 'Supprimer la consolante du tableau ?',
        action_button_text: 'Supprimer'
      };

      this.dialog.open(DialogComponent, {
        width: '75%',
        data: tableauToEdit
      }).afterClosed().subscribe(id_action => {
        if (id_action === this.tableau._id) {
          this.tableau.nom = this.reactiveForm.get('nom').value;
          this.tableau.age_minimum = this.reactiveForm.get('age_minimum').value;
          this.tableau.poules = this.reactiveForm.get('poules').value;
          this.tableau.nbPoules = this.reactiveForm.get('nbPoules').value;
          this.tableau.consolante = this.reactiveForm.get('consolante').value;
          this.tableau.format = this.reactiveForm.get('format').value;

          this.tableauService.edit(this.tableau).subscribe(() => {
            this.bracketService.deleteBracket(this.tableau._id).subscribe(() => {
              this.notifyService.notifyUser('Tableau modifié avec succès', this.snackBar, 'success', 1500, 'OK');
            }, (err) => {
              this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
            });
          }, err => {
            this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
          });
        }
      });
    } else {
      this.tableau.nom = this.reactiveForm.get('nom').value;
      this.tableau.age_minimum = this.reactiveForm.get('age_minimum').value;
      this.tableau.poules = this.reactiveForm.get('poules').value;
      this.tableau.nbPoules = this.reactiveForm.get('nbPoules').value;
      this.tableau.consolante = this.reactiveForm.get('consolante').value;
      this.tableau.format = this.reactiveForm.get('format').value;

      this.tableauService.edit(this.tableau).subscribe(() => {
          this.notifyService.notifyUser('Tableau modifié avec succès', this.snackBar, 'success', 1500, 'OK');
      }, err => {
        this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
      });
    }
  }
}
