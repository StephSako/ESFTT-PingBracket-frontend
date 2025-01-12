import { PouleInterface } from './Poule';

export interface Dialog {
  id: string;
  action?: string;
  action_button_text: string;
  option?: string;
  text?: string;
  h1_class?: string;
  close_button?: string;
  printTitle?: boolean;
  poules?: PouleInterface[];
  hasTableauHandicap?: boolean;
  format?: string;
}
