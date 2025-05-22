export interface Call {
  id_call: number;
  duration: number;
  silence_percentage: number;
  id_user: number;
  date?: string;
  report?: {
    overall_emotion?: number;
    speakers: Array<{
      emotions: {
        happiness?: number;
        sadness?: number;
        anger?: number;
      };
    }>;
  };
}

export interface Agent {
  id: number;
  name: string;
  role: string;
  id_team: number;
}