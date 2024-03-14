import { Injectable } from '@angular/core';
import { TableauState } from './SharedModule/TableauState.enum';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  getTableauState(): typeof TableauState {
    return TableauState;
  }

  getTableauStateColor(state: number): string {
    return state === TableauState.PointageState
      ? 'pointage'
      : state === TableauState.PouleState || state === TableauState.BracketState
      ? 'playing'
      : 'termine';
  }
}
