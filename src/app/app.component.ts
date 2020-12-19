import { Component } from '@angular/core';
import {TableauInterface} from './Interface/Tableau';
import {TableauService} from './Service/tableau.service';
import {Router} from '@angular/router';
import {AccountService} from './Service/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  tableaux: TableauInterface[];

  constructor(public accountService: AccountService, private gestionService: TableauService, private router: Router) {
    this.getAllTableaux();
  }

  getAllTableaux(): void{
    this.gestionService.getAll().subscribe(tableaux => this.tableaux = tableaux);
  }

  isActive(route: string): string {
    return (route === this.router.url.split('/').pop() ? 'primary' : '');
  }
}
