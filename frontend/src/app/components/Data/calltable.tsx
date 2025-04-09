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
        const calls: Call[] = data.map((call: any) => ({
          id: call.id_call,
          name: call.user?.name || "Desconocido",
          date: call.date.split(" ")[0],
          duration: `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, "0")}`,
          agent: call.user?.role || "Sin rol",
          sentimentScore: 80,
          transcript: call.transcript?.text
            ? [{ speaker: call.user?.name || "Agente", message: call.transcript.text }]
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
      (searchClient === "" || call.name.toLowerCase().includes(searchClient.toLowerCase())) &&
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

      {/* Solo popup para reporte */}
      {selectedCall && view === "report" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setView("none")}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 text-white p-6 rounded-md max-w-lg w-full shadow-lg border border-white"
          >
            <h2 className="text-xl font-bold mb-4">Reporte</h2>
            {selectedCall.report?.summary ? (
              <p className="text-sm text-gray-200">{selectedCall.report.summary}</p>
            ) : (
              <p className="text-sm text-gray-400">No hay reporte disponible.</p>
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
    </div>
  );
};

export default CallTable;
