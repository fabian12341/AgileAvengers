import { Call } from "./Call";

export interface ApiCall {
  id_call: number;
  user?: {
    name?: string;
    role?: string;
  };
  date: string;
  duration: number;
  client?: string;
  transcript?: {
    text?: Array<{
      speaker: string;
      text: string;
    }>;
  };
  report?: Call['report'] | null;
}