import { Call } from "./Call";

export interface ApiCall {
  id_call: number;
  date: string;
  duration: number;
  client_name?: string;
  user?: {
    name?: string;
    role?: string;
    id_team?: number;
  };
  transcript?: {
    text?: string;
  };
  report?: any;
}

