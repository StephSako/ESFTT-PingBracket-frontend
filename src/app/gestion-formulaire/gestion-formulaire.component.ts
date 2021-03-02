import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ParametreInterface } from '../Interface/Parametre';
import { BuffetInterface } from '../Interface/Buffet';
import { ParametresService } from '../Service/parametres.service';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BuffetService } from '../Service/buffet.service';

@Component({
  selector: 'app-gestion-formulaire',
  templateUrl: './gestion-formulaire.component.html',
  styleUrls: ['./gestion-formulaire.component.scss'],
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
export class GestionFormulaireComponent implements OnInit {

  parametres: ParametreInterface = {
    texte_debut: null,
    _id: null,
    date: null,
    titre: null,
    texte_fin: null,
    texte_buffet: null,
    open: null
  };

  buffet: BuffetInterface = {
    _id: null,
    nb_moins_13_ans: null,
    nb_plus_13_ans: null,
    plats: null
  };

  constructor(private adapter: DateAdapter<any>, private parametreService: ParametresService, private notifyService: NotifyService,
              private snackBar: MatSnackBar, private buffetService: BuffetService) { }

  ngOnInit(): void {
    this.adapter.setLocale('fr');
    this.getParametres();
    this.getBuffet();
  }

  getParametres(): void{
    this.parametreService.getParametres().subscribe(parametres => this.parametres = parametres, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  edit(): void {
    this.parametreService.edit(this.parametres).subscribe(
      message => {
        this.notifyService.notifyUser(message.message, this.snackBar, 'success', 2000, 'OK');
      }, err => {
        this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
      });
  }

  getBuffet(): void {
    this.buffetService.getBuffet().subscribe(buffet => this.buffet = buffet, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  platsCookedEmpty(): boolean {
    return (this.buffet.plats ? this.buffet.plats.length === 0 : false);
  }

  openCloseFormulaire(): void {
    this.parametreService.openCloseFormulaire(this.parametres._id, !this.parametres.open).subscribe(result => {
      this.notifyService.notifyUser(result.message, this.snackBar, 'success', 2000, 'OK');
      this.parametres.open = !this.parametres.open;
    }, err => this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'));
  }

}
