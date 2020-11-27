import { JoueurInterface } from './Joueur';

export interface PouleInterface {
  _id: string;
  id: number;
  joueurs: [
    id: JoueurInterface,
    points: number
  ];
  nom: string;
}
