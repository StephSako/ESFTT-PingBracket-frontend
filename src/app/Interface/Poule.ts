import { JoueurInterface } from './Joueur';

export interface PouleInterface {
  _id: string;
  type: string;
  locked: boolean;
  joueurs: [
    id: JoueurInterface
  ];
}
