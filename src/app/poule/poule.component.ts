import { Component, OnInit } from '@angular/core';
import { PoulesService } from '../Service/poules.service';
import {JoueurInterface} from '../Interface/Joueur';
import { PouleInterface } from '../Interface/Poule';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-poule',
  templateUrl: './poule.component.html',
  styleUrls: ['./poule.component.scss']
})
export class PouleComponent implements OnInit {

  public poules: PouleInterface[];

  constructor(private pouleService: PoulesService) { }

  ngOnInit(): void {
    this.updateAllJoueurs();
  }

  updateAllJoueurs(): void {
    this.pouleService.getAll().subscribe(poules => {
      this.poules = poules;
    });
  }

  drop(event: CdkDragDrop<[id: JoueurInterface, points: number], any>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

}
