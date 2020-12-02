import { Component, OnInit } from '@angular/core';
import { PoulesService } from '../Service/poules.service';
import { JoueurInterface } from '../Interface/Joueur';
import { PouleInterface } from '../Interface/Poule';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-poule',
  templateUrl: './poule.component.html',
  styleUrls: ['./poule.component.scss']
})
export class PouleComponent implements OnInit {

  public poules: PouleInterface[];

  constructor(private pouleService: PoulesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getAllPoules();
    });
  }

  getAllPoules(): void {
    this.pouleService.getAll(this.router.url.split('/').pop()).subscribe(poules => this.poules = poules);
  }

  generatePoules(): void {
    this.pouleService.generatePoules(this.router.url.split('/').pop()).subscribe(() => this.getAllPoules());
  }

  drop(event: CdkDragDrop<[id: JoueurInterface, points: number], any>, id_poule: string): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.pouleService.edit(id_poule, event.container.data).subscribe(() => {}, err => console.log(err));
  }

  setStatus(poule: PouleInterface): void {
    this.pouleService.setStatus(poule).subscribe(() => this.getAllPoules(), err => console.error(err));
  }
}
