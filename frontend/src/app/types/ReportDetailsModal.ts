export interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    id_report: number;
    summary: string;
    call: {
      id_call: number;
      date: string;
      client: number;
      agent: string;
    };
  } | null;
}