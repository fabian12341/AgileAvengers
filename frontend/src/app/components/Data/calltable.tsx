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
  hasReport: boolean;
}

const CallTable: React.FC = () => {
  const [callsData, setCallsData] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [view, setView] = useState<"none" | "transcription" | "report">("none");
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
          hasReport: !!call.report,
          transcript: call.transcript?.text
            ? [{
                speaker: call.user?.name || "Agente",
                message: call.transcript.text,
              }]
            : [],
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

      {selectedCall && view !== "none" && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            {view === "transcription" ? "Transcript" : "Report"}
          </h3>
          {view === "transcription" ? (
            <div className="space-y-4">
              {selectedCall.transcript.map((entry, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-white text-xs">
                      {entry.speaker.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white uppercase">{entry.speaker}</p>
                    <p className="text-sm text-gray-300">{entry.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">Aquí iría el reporte de la llamada...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CallTable;
