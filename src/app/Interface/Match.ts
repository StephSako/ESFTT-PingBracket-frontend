import { JoueurInterface } from 'src/app/Interface/Joueur';

interface JoueurMatchInterface {
  _id: JoueurInterface;
  winner: boolean;
}

export interface MatchInterface {
  id: number;
  round: number;
  joueurs: JoueurMatchInterface[];
}
