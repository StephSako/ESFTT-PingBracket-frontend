import { Component, OnInit } from '@angular/core';
import {TableauService} from '../Service/tableau.service';
import {TableauInterface} from '../Interface/Tableau';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.scss']
})
export class TableauComponent implements OnInit {

  idTableau: string;
  tableau: TableauInterface = {
    _id: null,
    format: null,
    nom: null,
    consolante: null
  };

  constructor(private gestionService: TableauService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.idTableau = this.router.url.split('/').pop();
      this.getTableau();
    });
  }

  getTableau(): void {
    this.gestionService.getTableau(this.idTableau).subscribe(tableau => this.tableau = tableau);
  }
}
