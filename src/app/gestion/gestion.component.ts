import { Component, OnInit } from '@angular/core';
import { GestionService } from '../Service/gestion.service';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {

  constructor(private gestionService: GestionService, private notifyService: NotifyService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {}

  remiseAZero(): void {
    this.gestionService.reset()
      .subscribe(message => {
          this.notifyService.notifyUser(message.message, this.snackBar, 'success', 2500, 'OK');
      }, err => {
        this.notifyService.notifyUser(err.message, this.snackBar, 'error', 2500, 'OK');
      });
  }

}
