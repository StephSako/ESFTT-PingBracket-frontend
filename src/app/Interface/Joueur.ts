import {TableauInterface} from './Tableau';

export interface JoueurInterface {
  _id: string;
  classement: number;
  nom: string;
  tableaux: TableauInterface[];
}
