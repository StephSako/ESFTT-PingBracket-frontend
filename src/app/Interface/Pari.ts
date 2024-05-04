export interface ParisJoueurInterface {
  _id: string;
  id_pronostiqueur: string;
  id_prono_vainqueur: string;
  paris: PariInterface[];
}

export interface PariInterface {
  id_gagnant: string;
  id_bracket: string;
  id_match: number;
  round: number;
}
