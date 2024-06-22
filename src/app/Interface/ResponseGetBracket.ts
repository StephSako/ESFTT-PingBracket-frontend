import { BracketInterface, RoundInterface } from './Bracket';
import { InfosParisJoueurInterface } from './Pari';
import { TableauInterface } from './Tableau';

export interface ResponseGetBracket {
  bracket: BracketInterface;
  parisJoueur: InfosParisJoueurInterface;
  tableauxPariables: TableauInterface[];
}

export interface ResponseGetAllParisBrackets {
  brackets: RoundInterface[];
  parisJoueurs: InfosParisJoueurInterface[];
}
