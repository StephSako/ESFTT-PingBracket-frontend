import { JoueurInterface } from './Joueur';

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
  type_licence: number;
  nbPoules: number;
  palierQualifies: number;
  palierConsolantes: number;
  hasChapeau: boolean;
  pariable: boolean;
  bracketPariable: boolean;
  consolantePariable: boolean;
  ptsGagnesParisVainqueur: number;
  ptsPerdusParisVainqueur: number;
  ptsGagnesParisWB: number;
  ptsPerdusParisWB: number;
  ptsGagnesParisLB: number;
  ptsPerdusParisLB: number;
}

export interface PlayerCountPerTableau {
  [key: string]: number;
}

export interface PariableTableauInterface {
  tableau: TableauInterface;
  participants: JoueurInterface;
}
