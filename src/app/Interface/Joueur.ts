import {TableauInterface} from './Tableau';

export interface JoueurInterface {
  _id: string;
  classement: number;
  nom: string;
  age: number;
  tableaux: TableauInterface[];
}
