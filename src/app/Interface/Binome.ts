import { JoueurInterface } from './Joueur';

export interface BinomeInterface {
  _id: string;
  tableau: string;
  locked: boolean;
  joueurs: JoueurInterface[];
}
