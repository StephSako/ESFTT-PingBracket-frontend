import { JoueurInterface } from 'src/app/Interface/Joueur';

export interface JoueurMatchInterface {
  _id: JoueurInterface;
  winner: boolean;
}

export interface MatchInterface {
  id: number;
  isCancelable: boolean;
  round: number;
  joueurs: JoueurMatchInterface[];
}
