import { Component, OnInit } from '@angular/core';
import {PoulesService} from '../Service/poules.service';

@Component({
  selector: 'app-poule',
  templateUrl: './poule.component.html',
  styleUrls: ['./poule.component.scss']
})
export class PouleComponent implements OnInit {

  constructor(private pouleService: PoulesService) { }

  ngOnInit(): void {
    this.updateAllJoueurs();
  }

  updateAllJoueurs(): void {
    this.pouleService.getAll().subscribe(joueurs => this.listJoueurs = joueurs);
  }

}
