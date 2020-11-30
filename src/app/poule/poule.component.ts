import { Component, OnInit } from '@angular/core';
import { PoulesService } from '../Service/poules.service';
import {JoueurInterface} from '../Interface/Joueur';
import { PouleInterface } from '../Interface/Poule';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {Router} from '@angular/router';
import {JoueurService} from '../Service/joueur.service';
import {MatDialog} from '@angular/material/dialog';
import {NotifyService} from '../Service/notify.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-poule',
  templateUrl: './poule.component.html',
  styleUrls: ['./poule.component.scss']
})
export class PouleComponent implements OnInit {

  public poules: PouleInterface[];

  constructor(private pouleService: PoulesService, private router: Router, private joueurService: JoueurService,
              private notifyService: NotifyService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.updateAllPoules();
  }

  updateAllPoules(): void {
    this.pouleService.getAll(this.router.url.split('/').pop()).subscribe(poules => this.poules = poules);
  }

  drop(event: CdkDragDrop<[id: JoueurInterface, points: number], any>, id_poule: string): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.pouleService.edit(id_poule, event.container.data).subscribe(() => {}, err => console.log('La poule n\'a pas pu être mise à jour'));
  }

  generatePoules(): void {
    this.joueurService.getAll().subscribe(joueurs => {
      this.pouleService.generatePoules(joueurs, this.router.url.split('/').pop())
        .subscribe(
          () => {
            this.updateAllPoules();
            this.notifyService.notifyUser('Les poules ont été créées', this.snackBar, 'success', 1500, 'OK');
          },
          err => {
            console.error(err);
          }
        );
    });
  }

  setStatus(poule: PouleInterface): void {
    this.pouleService.setStatus(poule).subscribe(() => this.updateAllPoules(), err => console.error(err));
  }
}
