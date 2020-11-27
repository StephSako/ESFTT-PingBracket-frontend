import { JoueurInterface } from './Joueur';

export interface PouleInterface {
  _id: string;
  joueurs: [
    id: JoueurInterface,
    points: number
  ];
  nom: string;
}
