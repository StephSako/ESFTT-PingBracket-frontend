import { JoueurInterface } from './Joueur';

export interface InfosParisJoueurInterface {
  _id: string;
  id_pronostiqueur: { _id: string; nom: string };
  id_prono_vainqueur: JoueurInterface;
  paris: PariInterface[];
}

export interface PariInterface {
  id_gagnant: string;
  id_tableau: string;
  phase: string;
  id_match: number;
  round: number;
}
