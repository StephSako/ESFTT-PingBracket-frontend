import { Component, OnInit } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ParametresService } from '../Service/parametres.service';
import { ParametreInterface } from '../Interface/Parametre';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr_FR'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class ParametresComponent implements OnInit {

  parametres: ParametreInterface = {
    texte_debut: null,
    _id: null,
    date: null,
    titre: null,
    texte_fin: null,
    texte_buffet: null
  };

  constructor(private adapter: DateAdapter<any>, private parametreService: ParametresService, private notifyService: NotifyService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.adapter.setLocale('fr');
    this.getParametres();
  }

  getParametres(): void{
    this.parametreService.getParametres().subscribe(parametres => this.parametres = parametres);
  }

  edit(): void {
    this.parametreService.edit(this.parametres).subscribe(
      message => {
        this.notifyService.notifyUser(message.message, this.snackBar, 'success', 2000, 'OK');
      },
      err => {
        this.notifyService.notifyUser(err.message, this.snackBar, 'error', 2000, 'OK');
      }
    );
  }
}
