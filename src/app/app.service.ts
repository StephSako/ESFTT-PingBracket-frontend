import { Injectable } from '@angular/core';
import { TableauState } from './SharedModule/TableauState.enum';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  getTableauState() {
    return TableauState;
  }

  getTableauStateColor(state: number) {
    return state === TableauState.PointageState
      ? 'pointage'
      : state === TableauState.PouleState || state === TableauState.BracketState
      ? 'playing'
      : 'termine';
  }
}
