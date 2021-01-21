import { Component } from '@angular/core';
import { TableauInterface } from './Interface/Tableau';
import { TableauService } from './Service/tableau.service';
import { Router } from '@angular/router';
import { AccountService } from './Service/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from './Service/notify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  tableaux: TableauInterface[];

  constructor(public accountService: AccountService, private gestionService: TableauService, private router: Router,
              private snackBar: MatSnackBar, private notifyService: NotifyService) {
    this.getAllTableaux();
  }

  getAllTableaux(): void{
    this.gestionService.getAll().subscribe(tableaux => this.tableaux = tableaux, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  isActive(route: string): string {
    return (route === this.router.url.split('/').pop() ? 'primary' : '');
  }
}
