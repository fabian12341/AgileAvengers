import React, { useState } from "react";
import TableComponent from "./tablecomponent";
import CallSearch from "./callsearch";

interface Call {
  id: number;
  name: string;
  date: string;
  duration: string;
  agent: string;
}

const callsData: Call[] = [
  {
    id: 1,
    name: "John Doe",
    date: "2025-03-25",
    duration: "5:32",
    agent: "Jose Miguel",
  },
  {
    id: 2,
    name: "Jane Smith",
    date: "2025-03-24",
    duration: "8:15",
    agent: "Marco Martinez",
  },
  {
    id: 3,
    name: "Bob Johnson",
    date: "2025-03-23",
    duration: "12:45",
    agent: "Gabriel Aguilera",
  },
  {
    id: 4,
    name: "Robbie Williams",
    date: "2025-03-26",
    duration: "8:45",
    agent: "Dan Reynolds",
  },
];

const CallTable: React.FC = () => {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [view, setView] = useState<"none" | "transcription" | "report">("none");
  const [searchId, setSearchId] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchDate, setSearchDate] = useState("");

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
