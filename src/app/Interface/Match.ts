import { JoueurInterface } from 'src/app/Interface/Joueur';

interface JoueurMatchInterface {
  _id: JoueurInterface;
  winner: boolean;
}

export interface MatchInterface {
  id: number;
  isCancelable: boolean;
  round: number;
  joueurs: JoueurMatchInterface[];
}
