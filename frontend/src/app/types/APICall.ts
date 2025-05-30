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
  report?: {
    id_report: number;
    summary: string;
    overall_emotion?: number;
    silence_percentage?: number;
    suggestions?: string[];
    path?: string;
    speakers?: {
      name: string;
      emotion: string;
    }[];
  } | null;
}
