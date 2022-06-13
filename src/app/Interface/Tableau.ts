export interface TableauInterface {
  _id: string;
  nom: string;
  format: string;
  poules: boolean;
  consolante: boolean;
  is_launched: number;
  maxNumberPlayers: number; //TODO: Supprimer les joueurs en trop si la valeur diminue
  age_minimum: number;
  nbPoules: number;
}

export interface PlayerCountPerTableau {
  [key: string]: number;
}
