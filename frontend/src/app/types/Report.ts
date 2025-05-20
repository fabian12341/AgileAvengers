export interface Report {
  id_report: number;
  summary: string;
  call: {
    id_call: number;
    date: string;
    client: number;
    agent: string;
  };
}
