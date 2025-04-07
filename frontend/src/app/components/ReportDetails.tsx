// src/app/components/ReportDetailsModal.tsx
import React from "react";

interface ReportDetailsModalProps {
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

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg text-black relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Detalles del Reporte</h2>

        <p><strong>ID del Reporte:</strong> {report.id_report}</p>
        <p><strong>Fecha de llamada:</strong> {report.call.date}</p>
        <p><strong>Cliente ID:</strong> {report.call.client}</p>
        <p><strong>Agente:</strong> {report.call.agent}</p>
        <p className="mt-4"><strong>Resumen:</strong></p>
        <p className="text-sm text-gray-800 mt-1">{report.summary}</p>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
