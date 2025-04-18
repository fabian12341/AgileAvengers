export interface Call {
    id: number;
    name: string;
    date: string;
    duration: string;
    agent: string;
    sentimentScore: number;
    transcript: { speaker: string; message: string }[];
    report?: {
      id_report: number;
      summary: string;
      overall_emotion?: number;
      silence_percentage?: number;
      suggestions?: string[];
      speakers?: {
        role: string;
        emotions: {
          happiness: number;
          sadness: number;
          anger: number;
          neutrality: number;
          text_sentiment: string;
          text_sentiment_score: number;
        };
        voice: {
          pitch: number;
          pitch_std_dev: number;
          loudness: number;
          zcr: number;
          hnr: number;
          tempo: number;
        };
      }[];
    } | null;
  }