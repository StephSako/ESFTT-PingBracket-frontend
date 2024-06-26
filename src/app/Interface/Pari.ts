import { IdNomFormatInterface, IdNomInterface } from './IdNomInterface';

export interface InfosParisJoueurInterface {
  _id: string;
  id_pronostiqueur: IdNomInterface;
  pronos_vainqueurs: PronoVainqueur[];
  paris: PariInterface[];
}

export interface PariInterface {
  id_gagnant: IdNomInterface;
  id_tableau: IdNomFormatInterface;
  phase: string;
  id_match: number;
  round: number;
}

export interface PronoVainqueur {
  id_gagnant: IdNomInterface;
  id_tableau: string;
}

export interface ResultatPariJoueur {
  nom?: string;
  score: number;
  details: string[];
  parisVainqueursTableauxResults: PariVainqueurTableauResult[];
}

export interface PariVainqueurTableauResult {
  pariVainqueurOK: boolean | null;
  id_tableau: string;
}
