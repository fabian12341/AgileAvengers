// components/ReportModal.tsx
"use client";
import React from "react";

interface ReportModalProps {
  report: {
    date: string;
    agent: string;
    client: string;
    summary: string;
  };
  onClose: () => void;
}

const ReportModal = ({ report, onClose }: ReportModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
      onClick={onClose}
      data-testid="modal-backdrop"
    >
      <div
        className="bg-white text-black p-6 rounded-xl max-w-lg w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          Reporte de llamada del {report.date}
        </h2>
        <p className="mb-2">
          <strong>Agente:</strong> {report.agent}
        </p>
        <p className="mb-2">
          <strong>Cliente:</strong> {report.client}
        </p>
        <p>
          <strong>Resumen:</strong>
        </p>
        <p className="bg-gray-100 p-2 rounded mt-1 whitespace-pre-line">
          {report.summary}
        </p>
        <button
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ReportModal;
