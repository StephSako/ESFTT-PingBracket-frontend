import { RoundInterface } from './Bracket';
import { PariInterface, PronoVainqueur } from './Pari';
import { TableauInterface } from './Tableau';

export interface ScoreTableauPhaseInterface {
  tableau: TableauInterface;
  phase: string;
  rounds: RoundInterface[];
  paris: PariInterface[];
  waiting: boolean;
  pronos_vainqueurs?: PronoVainqueur[];
}
