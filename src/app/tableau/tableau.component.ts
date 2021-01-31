import { Component, OnInit } from '@angular/core';
import { TableauService } from '../Service/tableau.service';
import { TableauInterface } from '../Interface/Tableau';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../Service/notify.service';
import { PoulesService } from '../Service/poules.service';
import { PouleInterface } from '../Interface/Poule';
import { BinomeService } from '../Service/binome.service';
import { BinomeInterface } from '../Interface/Binome';
import {JoueurService} from '../Service/joueur.service';
import {JoueurInterface} from '../Interface/Joueur';

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
    poules: null,
    consolante: null,
    age_minimum: null,
    nbPoules: null
  };
  // Input variables
  poules: PouleInterface[] = [];
  binomes: BinomeInterface[] = [];
  subscribedUnassignedPlayers: JoueurInterface[] = [];

  constructor(private gestionService: TableauService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar,
              private notifyService: NotifyService, private pouleService: PoulesService, private binomeService: BinomeService,
              private joueurService: JoueurService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.idTableau = this.router.url.split('/').pop();
      this.getTableau();
    });
  }

  getTableau(): void {
    this.gestionService.getTableau(this.idTableau).subscribe(tableau => this.tableau = tableau, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  // Output functions
  getAllPoules(): void {
    this.pouleService.getAll(this.tableau._id, this.tableau.format).subscribe(poules => this.poules = poules, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  generatePoules(): void {
    this.pouleService.generatePoules(this.tableau).subscribe(() => { this.getAllPoules(); }, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  getAllBinomes(): void {
    this.binomeService.getAll(this.tableau._id).subscribe(binomes => this.binomes = binomes, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }

  getSubscribedUnassignedPlayers(): void {
    this.joueurService.getSubscribedUnassignedDouble(this.tableau._id).subscribe(joueurs => this.subscribedUnassignedPlayers = joueurs,
      err => { this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK'); });
  }
}
