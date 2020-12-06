import { Component, OnInit } from '@angular/core';
import { TableauInterface } from '../Interface/Tableau';
import { GestionService } from '../Service/gestion.service';
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

  displayedColumns: string[] = ['nom', 'format', 'consolante', 'edit', 'delete'];
  allTableaux: TableauInterface[];

  public tableau: TableauInterface = {
    nom: null,
    format: null,
    _id: null,
    consolante: null
  };

  constructor(private gestionService: GestionService, private notifyService: NotifyService, private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllTableaux();
  }

  getAllTableaux(): void {
    this.gestionService.getAll().subscribe(allTableaux => this.allTableaux = allTableaux);
  }

  create(): void {
    this.gestionService.create(this.tableau)
      .subscribe(() => {
          this.tableau = {
            format : null,
            nom : null,
            _id : null,
            consolante: null
          };
          this.getAllTableaux();
          this.notifyService.notifyUser('Tableau créé', this.snackBar, 'success', 1500, 'OK');
        },
        err => {
          console.error(err);
        }
      );
  }

  edit(tableau: TableauInterface): void {
    this.dialog.open(EditTableauComponent, {
      width: '60%',
      data: tableau
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau){
        this.gestionService.edit(tableau).subscribe(() => {
          this.getAllTableaux();
        }, err => { console.error(err); });
      }
    });
  }

  isInvalidTableau(): boolean {
    return (this.tableau.nom !== '' && this.tableau.nom !== null && this.tableau.format !== null);
  }

}
