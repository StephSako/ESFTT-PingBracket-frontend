export interface TableauInterface {
  _id: string;
  nom: string;
  format: string;
  poules: boolean;
  consolante: boolean;
  handicap: boolean;
  is_launched: number;
  maxNumberPlayers: number;
  age_minimum: number;
  nbPoules: number;
  palierQualifies: number;
  palierConsolantes: number;
  hasChapeau: boolean;
}

export interface PlayerCountPerTableau {
  [key: string]: number;
}
