import { Component, OnInit } from '@angular/core';
import { LogsService } from 'src/app/Service/logs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from 'src/app/Service/notify.service';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from 'src/app/Interface/Dialog';
import { DialogComponent } from 'src/app/SharedModule/dialog/dialog.component';

@Component({
  selector: 'app-logs-tableau',
  templateUrl: './logs-tableau.component.html',
  styleUrls: ['./logs-tableau.component.scss'],
})
export class LogsTableauComponent implements OnInit {
  public logs = [];

  constructor(
    private logsService: LogsService,
    private snackBar: MatSnackBar,
    private notifyService: NotifyService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getLogs();
  }

  public getLogs(): void {
    this.logsService.getAll().subscribe(
      (res) => {
        this.logs = res.map((log, i) => {
          return {
            position: i,
            logMessage: log,
          };
        });
      },
      (err) =>
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 'OK')
    );
  }

  public emptyLogs(): void {
    const logsToEmpty: Dialog = {
      id: 'true',
      action: 'Vider les logs ?',
      option: null,
      action_button_text: 'Supprimer',
    };

    this.dialog
      .open(DialogComponent, {
        width: '55%',
        data: logsToEmpty,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.logsService.emptyLogs().subscribe(
            (result) => {
              this.getLogs();
              this.notifyService.notifyUser(
                result.message,
                this.snackBar,
                'success',
                'OK'
              );
            },
            (err) =>
              this.notifyService.notifyUser(
                err.error,
                this.snackBar,
                'error',
                'OK'
              )
          );
        }
      });
  }
}
