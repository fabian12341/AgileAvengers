import React, { useState } from "react";
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
}

export const callsData: Call[] = [
  {
    id: 1,
    name: "John Doe",
    date: "2025-03-25",
    duration: "5:32",
    agent: "Jose Miguel",
    sentimentScore: 90,
    transcript: [
      {
        speaker: "John Doe",
        message: "Hi, I'm calling about my recent order.",
      },
      {
        speaker: "Jose Miguel",
        message: "Sorry to hear that. What's the order number?",
      },
      { speaker: "John Doe", message: "It's order number 1234." },
      {
        speaker: "Jose Miguel",
        message: "I see, let me check on that for you.",
      },
      { speaker: "John Doe", message: "Thank you." },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    date: "2025-03-24",
    duration: "8:15",
    agent: "Marco Martinez",
    sentimentScore: 70,
    transcript: [
      {
        speaker: "Jane Smith",
        message: "Hello, I have an issue with my account.",
      },
      {
        speaker: "Marco Martinez",
        message: "Can you please provide your account ID?",
      },
      { speaker: "Jane Smith", message: "Sure, it's 5678." },
      {
        speaker: "Marco Martinez",
        message: "Thanks, I'm looking into it now.",
      },
      { speaker: "Jane Smith", message: "Appreciate it." },
    ],
  },
  {
    id: 3,
    name: "Bob Johnson",
    date: "2025-03-23",
    duration: "12:45",
    agent: "Gabriel Aguilera",
    sentimentScore: 88,
    transcript: [
      {
        speaker: "Bob Johnson",
        message: "Hi, I need help with a payment issue.",
      },
      {
        speaker: "Gabriel Aguilera",
        message: "Of course, can you tell me more?",
      },
      {
        speaker: "Bob Johnson",
        message: "I was charged twice for the same order.",
      },
      {
        speaker: "Gabriel Aguilera",
        message: "I’ll check the transaction history.",
      },
      { speaker: "Bob Johnson", message: "Thanks for your help." },
    ],
  },
  {
    id: 4,
    name: "Robbie Williams",
    date: "2025-03-26",
    duration: "8:45",
    agent: "Dan Reynolds",
    sentimentScore: 92,
    transcript: [
      {
        speaker: "Robbie Williams",
        message: "Hey, I need to update my shipping address.",
      },
      { speaker: "Dan Reynolds", message: "Sure, what’s the new address?" },
      { speaker: "Robbie Williams", message: "123 Main St, New York." },
      { speaker: "Dan Reynolds", message: "Got it, I’ve updated it for you." },
      { speaker: "Robbie Williams", message: "Great, thanks!" },
    ],
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
        <div className="mt-4 p-4 border rounded-lg bg-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            {view === "transcription" ? "Transcript" : "Report"}
          </h3>
          {view === "transcription" ? (
            <div className="space-y-4">
              {selectedCall.transcript.map((entry, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {/* Avatar Placeholder */}
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-white text-xs">
                      {entry.speaker.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Speaker and Message */}
                  <div>
                    <p className="text-sm font-semibold text-white uppercase">
                      {entry.speaker}
                    </p>
                    <p className="text-sm text-gray-300">{entry.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">
              Aquí iría el reporte de la llamada...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CallTable;
