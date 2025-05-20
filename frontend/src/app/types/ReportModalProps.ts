export interface ReportModalProps {
  report: {
    date: string;
    agent: string;
    client: string;
    summary: string;
  };
  onClose: () => void;
}