import { Component, OnInit } from '@angular/core';
import { JoueurInterface } from '../Interface/Joueur';
import { TableauInterface } from '../Interface/Tableau';
import { ActivatedRoute, Router } from '@angular/router';
import { JoueurService } from '../Service/joueur.service';
import { TableauService } from '../Service/tableau.service';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BinomeInterface } from '../Interface/Binome';
import { BinomeService } from '../Service/binome.service';
import {PoulesService} from '../Service/poules.service';

@Component({
  selector: 'app-binome',
  templateUrl: './binome.component.html',
  styleUrls: ['./binome.component.scss']
})
export class BinomeComponent implements OnInit {

  public binomes: BinomeInterface[] = [];
  public subscribedUnassignedPlayers: JoueurInterface[] = [];
  tableau: TableauInterface = {
    format: null,
    _id: null,
    poules: null,
    nom: null,
    consolante: null,
    age_minimum: null
  };

  constructor(private binomeService: BinomeService, private router: Router, private route: ActivatedRoute,
              private poulesService: PoulesService, private joueurService: JoueurService, private gestionService: TableauService,
              private notifyService: NotifyService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getTableau();
    });
  }

  getTableau(): void {
    this.gestionService.getTableau(this.router.url.split('/').pop()).subscribe(tableau => {
      this.tableau = tableau;
      this.getAllBinomes();
      if (this.tableau.format === 'double') { this.getSubscribedUnassignedPlayers(); }
    });
  }

  generatePoules(): void {
    this.poulesService.generatePoules(this.tableau).subscribe(() => {}, err => {
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

  editBinome(event: CdkDragDrop<[id: JoueurInterface], any>, id_binome: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.data.length < 2 || id_binome === null) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        this.binomeService.editBinome(event.item.data[1], id_binome, event.container.data, event.item.data[0])
          .subscribe(() => { this.generatePoules(); }, err => {
            this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
          });
      } else {
        this.notifyService.notifyUser('Le binôme est complet', this.snackBar, 'error', 2000, 'OK');
      }
    }
  }

  unsubscribeDblClick(idBinome, idPlayer): void {
    this.binomeService.removePlayer(idBinome, idPlayer).subscribe(() => {
      this.getAllBinomes();
      this.generatePoules();
      this.getSubscribedUnassignedPlayers();
    }, err => {
      this.notifyService.notifyUser(err, this.snackBar, 'error', 2000, 'OK');
    });
  }
}
