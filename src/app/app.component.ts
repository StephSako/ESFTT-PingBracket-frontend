import { Component } from '@angular/core';
import {TableauInterface} from './Interface/Tableau';
import {GestionService} from './Service/gestion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  tableaux: TableauInterface[];

  constructor(private gestionService: GestionService) {
    this.getAllTableaux();
  }

  getAllTableaux(): void{
    this.gestionService.getAll().subscribe(tableaux => this.tableaux = tableaux);
  }
}
