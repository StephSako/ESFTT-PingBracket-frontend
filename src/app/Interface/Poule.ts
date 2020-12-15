import { JoueurInterface } from './Joueur';

export interface PouleInterface {
  _id: string;
  tableau: string;
  locked: boolean;
  joueurs: JoueurInterface[];
}
