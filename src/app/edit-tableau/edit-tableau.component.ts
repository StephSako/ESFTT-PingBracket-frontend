import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TableauInterface } from '../Interface/Tableau';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableauService } from '../Service/tableau.service';
import { categoriesAge, formats } from '../options-tableaux';

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

  constructor(@Inject(MAT_DIALOG_DATA) public data, private snackBar: MatSnackBar,
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
    this.dialog.open(EditTableauComponent, {
      width: '90%',
      data: this.tableau
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau){
        this.tableauService.edit(this.tableau).subscribe(() => {
        }, err => {
          this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
        });
      }
    });
  }
}
