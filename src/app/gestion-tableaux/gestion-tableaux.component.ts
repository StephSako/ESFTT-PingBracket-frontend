import { Component, OnInit } from '@angular/core';
import { TableauInterface } from '../Interface/Tableau';
import { TableauService } from '../Service/tableau.service';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditTableauComponent } from '../edit-tableau/edit-tableau.component';

@Component({
  selector: 'app-gestion-tableaux',
  templateUrl: './gestion-tableaux.component.html',
  styleUrls: ['./gestion-tableaux.component.scss']
})
export class GestionTableauxComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'age_minimum', 'format', 'poules', 'consolante', 'edit', 'delete'];
  allTableaux: TableauInterface[] = [];

  public tableau: TableauInterface = {
    nom: null,
    format: null,
    poules: null,
    _id: null,
    consolante: null,
    age_minimum: null
  };

  constructor(private gestionService: TableauService, private notifyService: NotifyService, private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllTableaux();
  }

  getAllTableaux(): void {
    this.gestionService.getAll().subscribe(allTableaux => this.allTableaux = allTableaux, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  create(): void {
    this.gestionService.create(this.tableau).subscribe(() => {
          this.tableau = {
            format : null,
            nom : null,
            poules: null,
            _id : null,
            consolante: null,
            age_minimum: null
          };
          this.getAllTableaux();
          this.notifyService.notifyUser('Tableau créé', this.snackBar, 'success', 1500, 'OK');
        }, err => {
        this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
      });
  }

  edit(tableau: TableauInterface): void {
    this.dialog.open(EditTableauComponent, {
      width: '90%',
      data: tableau
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau){
        this.gestionService.edit(tableau).subscribe(() => {
          this.getAllTableaux();
        }, err => {
          this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
        });
      }
    }, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  isInvalidTableau(): boolean {
    return (this.tableau.nom !== '' && this.tableau.nom !== null && this.tableau.format !== null);
  }

  showAgeMinimum(age_minimum: number): string {
    return (age_minimum ? age_minimum + ' ans' : '');
  }
}
