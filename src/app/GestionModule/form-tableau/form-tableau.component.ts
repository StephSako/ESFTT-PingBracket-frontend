import { Component, Input, OnInit } from '@angular/core';
import { TableauInterface } from '../../Interface/Tableau';
import {
  categoriesAge,
  formats,
  typesLicenceTableau,
} from 'src/app/const/options-tableaux';

@Component({
  selector: 'app-form-tableau',
  templateUrl: './form-tableau.component.html',
  styleUrls: ['./form-tableau.component.scss'],
})
export class FormTableauComponent implements OnInit {
  @Input() tableau: TableauInterface;
  formats: string[] = [];
  categoriesAge: any[] = categoriesAge;
  typesLicenceTableau: any[] = typesLicenceTableau;

  constructor() {}

  ngOnInit(): void {
    this.formats = formats;
  }

  simpleFormatPouleOnChange(): void {
    if (this.tableau.format === 'simple') {
      this.tableau.poules = true;
    }
    this.tableau.hasChapeau = false;
  }
}
