import { Call } from "./Call";

export interface ApiCall {
  id_call: number;
  user?: {
    name?: string;
    role?: string;
  };
  client_name?: string;
  date: string;
  duration: number;
  client?: string;
  transcript?: {
    text?: string;
  };
  report?: Call['report'] | null;
}
