import { BracketInterface } from './Bracket';
import { InfosParisJoueurInterface } from './Pari';

export interface ResponseGetBracket {
  bracket: BracketInterface;
  parisJoueur: InfosParisJoueurInterface;
}
