import { Component, OnInit } from '@angular/core';
import { PoulesService } from '../Service/poules.service';
import { JoueurInterface } from '../Interface/Joueur';
import { PouleInterface } from '../Interface/Poule';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifyService} from '../Service/notify.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-poule',
  templateUrl: './poule.component.html',
  styleUrls: ['./poule.component.scss']
})
export class PouleComponent implements OnInit {

  public poules: PouleInterface[];

  constructor(private pouleService: PoulesService, private router: Router, private route: ActivatedRoute,
              private notifyService: NotifyService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getAllPoules();
    });
  }

  getAllPoules(): void {
    this.pouleService.getAll(this.router.url.split('/').pop()).subscribe(poules => {
      console.log(poules);
      this.poules = poules;
    });
  }

  generatePoules(): void {
    this.pouleService.generatePoules(this.router.url.split('/').pop()).subscribe(() => {
      this.getAllPoules();
      this.notifyService.notifyUser('Poules générées', this.snackBar, 'success', 1500, 'OK');
    });
  }

  drop(event: CdkDragDrop<[id: JoueurInterface, points: number], any>, id_poule: string): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.pouleService.edit(id_poule, event.container.data).subscribe(() => {}, err => console.log(err));
  }

  setStatus(poule: PouleInterface): void {
    this.pouleService.setStatus(poule).subscribe(() => this.getAllPoules(), err => console.error(err));
  }
}
