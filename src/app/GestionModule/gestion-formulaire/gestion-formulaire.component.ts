import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ParametreInterface } from '../../Interface/Parametre';
import { BuffetInterface } from '../../Interface/Buffet';
import { ParametresService } from '../../Service/parametres.service';
import { NotifyService } from '../../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BuffetService } from '../../Service/buffet.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormControl, FormGroup } from '@angular/forms';

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

  reactiveForm: FormGroup;

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

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'}
    ],
    customClasses: [],
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['customClasses', 'undo', 'redo', 'heading', 'link', 'unlink', 'removeFormat', 'insertVideo']
    ]
  };

  constructor(private adapter: DateAdapter<any>, private parametreService: ParametresService, private notifyService: NotifyService,
              private snackBar: MatSnackBar, private buffetService: BuffetService) { }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      titre: new FormControl(''),
      texte_debut: new FormControl(''),
      texte_buffet: new FormControl(''),
      texte_fin: new FormControl(''),
      date: new FormControl('')
    });
    this.adapter.setLocale('fr');
    this.getParametres();
    this.getBuffet();
  }

  getParametres(): void{
    this.parametreService.getParametres().subscribe(parametres => {
      this.parametres = parametres;
      this.reactiveForm.patchValue({
        titre: this.parametres.titre,
        texte_debut: this.parametres.texte_debut,
        texte_buffet: this.parametres.texte_buffet,
        texte_fin: this.parametres.texte_fin,
        date: this.parametres.date
      });
    }, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  edit(): void {
    this.parametres = {
      _id: this.parametres._id,
      titre: this.reactiveForm.get('titre').value,
      open: this.parametres.open,
      date: this.reactiveForm.get('date').value,
      texte_debut: this.reactiveForm.get('texte_debut').value,
      texte_buffet: this.reactiveForm.get('texte_buffet').value,
      texte_fin: this.reactiveForm.get('texte_fin').value
    };
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
