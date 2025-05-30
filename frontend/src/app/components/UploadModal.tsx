"use client";

import React from "react";
import { X } from "lucide-react";

interface UploadModalProps {
  show: boolean;
  onClose: () => void;
  agentName?: string; // opcional
  clientName?: string; // opcional
}

const UploadModal: React.FC<UploadModalProps> = ({
  show,
  onClose,
  agentName,
  clientName,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full text-white relative border border-gray-600 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-purple-400">
          ¡Llamada subida exitosamente!
        </h2>
        <p className="mb-4 text-gray-300">
          Estamos transcribiendo tu llamada y generando el reporte de análisis
          de sentimientos. Esto puede tomar unos minutos.
        </p>

        {/* Aquí podrías mostrar los datos */}
        {agentName && (
          <p className="mb-2 text-gray-300">
            Agente: <strong>{agentName}</strong>
          </p>
        )}
        {clientName && (
          <p className="mb-6 text-gray-300">
            Cliente: <strong>{clientName}</strong>
          </p>
        )}

        <p className="mb-6 text-gray-400">
          Mientras tanto, puedes seguir navegando por la app o jugar en el{" "}
          <strong>Shield AI Arcade</strong> 🎮
        </p>
        <a
          href="/arcade"
          className="inline-block px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-full transition text-white font-medium text-center"
        >
          Ir al Arcade
        </a>
      </div>
    </div>
  );
};

export default UploadModal;
