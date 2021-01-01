import { Component, OnInit } from '@angular/core';
import {BuffetInterface} from '../Interface/Buffet';
import {BuffetService} from '../Service/buffet.service';

@Component({
  selector: 'app-buffet',
  templateUrl: './buffet.component.html',
  styleUrls: ['./buffet.component.scss']
})
export class BuffetComponent implements OnInit {

  buffet: BuffetInterface = {
    _id: null,
    nb_moins_13_ans: null,
    nb_plus_13_ans: null,
    plats: null
  };

  constructor(private buffetService: BuffetService) { }

  ngOnInit(): void {
    this.getBuffet();
  }

  getBuffet(): void {
    this.buffetService.getBuffet().subscribe(buffet => this.buffet = buffet);
  }

}
