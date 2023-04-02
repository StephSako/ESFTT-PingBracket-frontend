import { TableauInterface } from './Tableau';
import { MatchInterface } from './Match';
interface RoundInterface {
  _id: string;
  objectRef: string;
  phase: string;
  round: number;
  tableau: TableauInterface;
  matches: MatchInterface[];
  type: string;
}

export interface BracketInterface {
  rounds: RoundInterface[];
}
