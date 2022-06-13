export interface TableauInterface {
  _id: string;
  nom: string;
  format: string;
  poules: boolean;
  consolante: boolean;
  is_launched: number;
  maxNumberPlayers: number;
  age_minimum: number;
  nbPoules: number;
}

export interface PlayerCountPerTableau {
  [key: string]: number;
}
