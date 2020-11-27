import { JoueurInterface } from './Joueur';

export interface PouleInterface {
  _id: string;
  type: string;
  joueurs: [
    id: JoueurInterface,
    points: number
  ];
}
