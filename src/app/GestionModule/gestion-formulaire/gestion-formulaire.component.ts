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
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
  /* Paramètres de l'input avec les Chips */
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  reactiveFormFormulaire: FormGroup;
  reactiveFormBuffet: FormGroup;

  parametres: ParametreInterface = {
    texte_debut: null,
    _id: null,
    date: null,
    titre: null,
    texte_fin: null,
    consignes_tableaux: null,
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
    this.reactiveFormFormulaire = new FormGroup({
      titre: new FormControl(''),
      texte_debut: new FormControl(''),
      texte_buffet: new FormControl(''),
      texte_fin: new FormControl(''),
      consignes_tableaux: new FormControl(''),
      date: new FormControl('')
    });
    this.reactiveFormBuffet = new FormGroup({
      nb_moins_13_ans: new FormControl(0),
      nb_plus_13_ans: new FormControl(0),
    });
    this.adapter.setLocale('fr');
    this.getParametres();
    this.getBuffet();
  }

  getParametres(): void{
    this.parametreService.getParametres().subscribe((parametres: ParametreInterface) => {
      this.parametres = parametres;
      this.reactiveFormFormulaire.patchValue({
        titre: this.parametres.titre,
        texte_debut: this.parametres.texte_debut,
        texte_buffet: this.parametres.texte_buffet,
        texte_fin: this.parametres.texte_fin,
        consignes_tableaux: this.parametres.consignes_tableaux,
        date: this.parametres.date
      });
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  editFormulaire(): void {
    this.parametres = {
      _id: this.parametres._id,
      titre: this.reactiveFormFormulaire.get('titre').value,
      open: this.parametres.open,
      date: this.reactiveFormFormulaire.get('date').value,
      texte_debut: this.reactiveFormFormulaire.get('texte_debut').value,
      texte_buffet: this.reactiveFormFormulaire.get('texte_buffet').value,
      texte_fin: this.reactiveFormFormulaire.get('texte_fin').value,
      consignes_tableaux: this.reactiveFormFormulaire.get('consignes_tableaux').value
    };
    this.parametreService.edit(this.parametres).subscribe(
      message => {
        this.notifyService.notifyUser(message.message, this.snackBar, 'success', 2000, 'OK');
      }, err => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
      });
  }

  editBuffet(): void {
    this.buffet = {
      _id: this.parametres._id,
      nb_moins_13_ans: this.reactiveFormBuffet.get('nb_moins_13_ans').value,
      nb_plus_13_ans: this.reactiveFormBuffet.get('nb_plus_13_ans').value,
      plats:this.buffet.plats
    };
    this.buffetService.edit(this.buffet).subscribe(
      message => {
        this.notifyService.notifyUser(message.message, this.snackBar, 'success', 2000, 'OK');
      }, err => {
        this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
      });
  }

  getBuffet(): void {
    this.buffetService.getBuffet().subscribe((buffet: BuffetInterface) => {
      this.buffet = buffet;
      this.reactiveFormBuffet.patchValue({
        nb_moins_13_ans: this.buffet.nb_moins_13_ans,
        nb_plus_13_ans: this.buffet.nb_plus_13_ans,
      });
    }, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
    });
  }

  openCloseFormulaire(): void {
    this.parametreService.openCloseFormulaire(!this.parametres.open).subscribe(result => {
      this.notifyService.notifyUser(result.message, this.snackBar, 'success', 2000, 'OK');
      this.parametres.open = !this.parametres.open;
    }, err => this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK'));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) this.buffet.plats.push(value.trim());
    if (input) { input.value = ''; }
  }

  remove(plat: string): void {
    const index = this.buffet.plats.indexOf(plat);
    if (index >= 0) this.buffet.plats.splice(index, 1);
  }
}
