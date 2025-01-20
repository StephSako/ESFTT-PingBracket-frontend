import { JoueurInterface } from 'src/app/Interface/Joueur';
import { RoundInterface } from './Bracket';

export interface JoueurMatchInterface {
  _id: JoueurInterface;
  winner: boolean;
}

export interface MatchInterface {
  id: number;
  isCancelable: boolean;
  isLockToBets: boolean;
  round: number;
  joueurs: JoueurMatchInterface[];
}

export interface TableauMatchInterface {
  tableauId: string;
  match: RoundInterface[];
  phase: string;
}
