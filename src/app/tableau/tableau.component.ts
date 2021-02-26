import { Component, OnInit } from '@angular/core';
import { TableauService } from '../Service/tableau.service';
import { TableauInterface } from '../Interface/Tableau';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyService } from '../Service/notify.service';
import { PoulesService } from '../Service/poules.service';
import { PouleInterface } from '../Interface/Poule';
import { BinomeService } from '../Service/binome.service';
import { BinomeInterface } from '../Interface/Binome';
import { JoueurService } from '../Service/joueur.service';
import { JoueurInterface } from '../Interface/Joueur';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.scss']
})
export class TableauComponent implements OnInit {

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
              private joueurService: JoueurService, public dialog: MatDialog, private tableauService: TableauService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.getTableau(params.tableau);
    });
  }

  getTableau(idTableau: string): void {
    this.gestionService.getTableau(idTableau).subscribe(tableau => this.tableau = tableau, err => {
      this.notifyService.notifyUser(err.error, this.snackBar, 'error', 2000, 'OK');
      this.router.navigate(['/error-page']);
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

  delete(): void {
    const tableauToDelete: Dialog = {
      id: this.tableau._id,
      action: 'Supprimer le tableau ?',
      option: 'Les poules, binômes et brackets seront supprimés, et les joueurs désinscris.',
      action_button_text: 'Supprimer'
    };

    this.dialog.open(DialogComponent, {
      width: '55%',
      data: tableauToDelete
    }).afterClosed().subscribe(id_tableau => {
      if (id_tableau){ this.tableauService.delete(this.tableau).subscribe(() => {
        this.router.navigateByUrl('/gestion');
        this.notifyService.notifyUser('Tableau supprimé', this.snackBar, 'success', 2000, 'OK');
      }, err => {
        this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
      }); }
    }, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }
}
