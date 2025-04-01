import React, { useState, useEffect } from "react";
import TableComponent from "./tablecomponent";
import CallSearch from "./callsearch";

export interface Call {
  id: number;
  name: string;
  date: string;
  duration: string;
  agent: string;
}

interface CallTableProps {
  onDataLoad?: (calls: Call[]) => void;
}

const CallTable: React.FC<CallTableProps> = ({ onDataLoad }) => {
  const [callsData, setCallsData] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [view, setView] = useState<"none" | "transcription" | "report">("none");
  const [searchId, setSearchId] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    fetch("/calls")
      .then((res) => res.json())
      .then((data) => {
        setCallsData(data);
        if (onDataLoad) {
          onDataLoad(data);
        }
      })
      .catch((err) => console.error("Error fetching calls:", err));
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
      {/* Search Section */}
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
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">
            {view === "transcription"
              ? "Transcripción de la llamada"
              : "Reporte de la llamada"}
          </h3>
          <p className="text-gray-600">
            {view === "transcription"
              ? "Aquí iría la transcripción de la llamada..."
              : "Aquí iría el reporte de la llamada..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default CallTable;
