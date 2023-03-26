import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableauInterface } from './Interface/Tableau';
import { TableauService } from './Service/tableau.service';
import { AccountService } from './Service/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from './Service/notify.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  tableaux: TableauInterface[];
  private tableauxSubscription: Subscription;
  private tableauxEditionSubscription: Subscription;

  constructor(
    public accountService: AccountService,
    private tableauService: TableauService,
    private snackBar: MatSnackBar,
    private notifyService: NotifyService
  ) {}

  ngOnInit(): void {
    if (this.accountService.isLoggedIn()) {
      this.getAllTableaux();
    }
    this.tableauxSubscription = this.tableauService.tableauxSource.subscribe(
      (tableaux: TableauInterface[]) => (this.tableaux = tableaux)
    );
    this.tableauxEditionSubscription =
      this.tableauService.tableauxEditSource.subscribe(
        (tableau: TableauInterface) => {
          this.tableaux.map((tab) => {
            if (tab._id === tableau._id) tab.is_launched = tableau.is_launched;
            return tableau;
          });
        }
      );
  }

  ngOnDestroy(): void {
    this.tableauxSubscription.unsubscribe();
    this.tableauxEditionSubscription.unsubscribe();
  }

  getAllTableaux(): void {
    this.tableauService.getAllTableaux().subscribe(
      (tableaux) => (this.tableaux = tableaux),
      (err) => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK');
      }
    );
  }
}
