import { JoueurInterface } from './Joueur';
import { BinomeInterface } from './Binome';

export interface PouleInterface {
  _id: string;
  tableau: string;
  locked: boolean;
  objectRef: string;
  i?: number;
  participants: JoueurInterface[] | BinomeInterface[];
}
