"use client";
import React, { useState, useEffect } from "react";
import TableComponent from "./tablecomponent";
import CallSearch from "./callsearch";

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
  } | null;
}

// Define el tipo para los datos crudos de la API
interface RawCall {
  id_call: number;
  user?: {
    name: string;
    role: string;
  };
  date: string;
  duration: number;
  transcript?: {
    text: string;
  };
  report?: {
    id_report: number;
    summary: string;
  } | null;
}

const CallTable: React.FC = () => {
  const [callsData, setCallsData] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [view, setView] = useState<"none" | "report" | "transcription">("none");
  const [searchId, setSearchId] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls/users`, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const calls: Call[] = data.map((call: RawCall) => ({
          id: call.id_call,
          name: call.user?.name || "Desconocido",
          date: call.date.split(" ")[0],
          duration: `${Math.floor(call.duration / 60)}:${(call.duration % 60)
            .toString()
            .padStart(2, "0")}`,
          agent: call.user?.role || "Sin rol",
          sentimentScore: 80,
          transcript: call.transcript?.text
            ? [
                {
                  speaker: call.user?.name || "Agente",
                  message: call.transcript.text,
                },
              ]
            : [],
          report: call.report || null,
        }));
        setCallsData(calls);
      })
      .catch((error) => {
        console.error("Error al obtener las llamadas:", error);
      });
  }, []);

  const handleView = (call: Call, type: "transcription" | "report") => {
    setSelectedCall(call);
    setView(type);
  };

  const filteredCalls = callsData.filter((call) => {
    return (
      (searchId === "" || call.id.toString().includes(searchId)) &&
      (searchClient === "" ||
        call.name.toLowerCase().includes(searchClient.toLowerCase())) &&
      (searchDate === "" || call.date === searchDate)
    );
  });

  return (
    <div>
      <CallSearch
        searchId={searchId}
        setSearchId={setSearchId}
        searchClient={searchClient}
        setSearchClient={setSearchClient}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
      />

      <TableComponent
        calls={filteredCalls.map((call) => ({
          ...call,
          onView: (type) => handleView(call, type),
        }))}
      />

      {/* Popup de TRANSCRIPCIÓN */}
      {selectedCall && view === "transcription" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
          onClick={() => setView("none")}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#151D2A] border border-gray-500 text-white p-6 rounded-md max-w-md w-full shadow-xl"
          >
            <h2 className="text-lg font-bold mb-3">Transcript</h2>
            {selectedCall.transcript.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {selectedCall.transcript.map((entry, index) => (
                  <div key={index}>
                    <p className="text-sm font-semibold">{entry.speaker}</p>
                    <p className="text-sm text-gray-300">{entry.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No hay transcripción disponible.
              </p>
            )}
            <button
              onClick={() => setView("none")}
              className="mt-4 text-blue-400 hover:underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Popup de REPORTE */}
      {selectedCall && view === "report" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
          onClick={() => setView("none")}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#151D2A] border border-gray-500 text-white p-6 rounded-md max-w-md w-full shadow-xl"
          >
            <h2 className="text-lg font-bold mb-3">Reporte detallado</h2>
            <p>
              <strong>Fecha:</strong> {selectedCall.date}
            </p>
            <p>
              <strong>Cliente ID:</strong> {selectedCall.id}
            </p>
            <p>
              <strong>Agente:</strong> {selectedCall.name}
            </p>
            <p className="mt-2">
              <strong>Resumen:</strong>
              <br />
              {selectedCall.report?.summary || "No hay resumen disponible."}
            </p>
            <button
              onClick={() => setView("none")}
              className="mt-4 text-blue-400 hover:underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallTable;
