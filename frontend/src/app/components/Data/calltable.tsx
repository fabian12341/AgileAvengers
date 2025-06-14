"use client";
import React, { useState, useEffect } from "react";
import TableComponent from "./tablecomponent";
import CallSearch from "./callsearch";
import { ApiCall } from "@/app/types/APICall";
import { Call } from "@/app/types/Call";

const safeFixed = (val: number | undefined | null, digits = 2) =>
  val != null ? val.toFixed(digits) : "N/A";

const CallTable: React.FC<{
  refresh: boolean;
  role: string;
  id_team: number;
  agentName: string;
}> = ({ refresh, role, id_team, agentName }) => {
  const [callsData, setCallsData] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [view, setView] = useState<"none" | "report" | "transcription">("none");
  const [searchId, setSearchId] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const showDelete = role === "Admin" || role === "TeamLeader";

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls/users`, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    })
      .then((res) => res.json() as Promise<ApiCall[]>)
      .then((data) => {
        let filtered = data;

        if (role === "TeamLeader") {
          const teamId = Number(id_team);
          filtered = data.filter((call) => call.user?.id_team === teamId);
        } else if (role === "Agent") {
          filtered = data.filter(
            (call) =>
              call.user?.name?.toLowerCase().trim() ===
              agentName.toLowerCase().trim()
          );
        }

        const calls: Call[] = filtered.map((call: ApiCall) => ({
          id: call.id_call,
          name: call.client_name ?? "Desconocido", // Usa client_name para name, con valor por defecto
          date: call.date.split(" ")[0],
          duration: `${Math.floor(call.duration / 60)}:${(call.duration % 60)
            .toString()
            .padStart(2, "0")}`,
          agent: call.user?.name ?? call.user?.role ?? "Sin rol", // Prioriza user.name, luego user.role
          sentimentScore: call.report?.overall_emotion ?? 0, // Usa overall_emotion o 0 como default
          transcript:
            typeof call.transcript?.text === "string"
              ? call.transcript.text.split("\n\n").map((block) => {
                  const [speakerLine, ...textLines] = block.split("\n");
                  const speakerRaw = speakerLine?.replace(":", "").trim();
                  const speaker =
                    speakerRaw === "AGENT"
                      ? call.user?.name || "Agente"
                      : call.client_name || "Cliente";
                  return {
                    speaker,
                    message: textLines.join("\n").trim(),
                  };
                })
              : [],
          report: call.report
            ? {
                id_report: call.report.id_report,
                summary: call.report.summary,
                overall_emotion: call.report.overall_emotion,
                silence_percentage: call.report.silence_percentage,
                suggestions: call.report.suggestions,
                path: call.report.path,
                speakers: call.report.speakers?.map((speaker) => {
                  const emotion = speaker.emotion ?? "unknown"; // Valor por defecto si emotion es undefined o null
                  return {
                    role: speaker.name,
                    emotions: {
                      happiness: emotion.toLowerCase() === "happy" ? 1 : 0,
                      sadness: emotion.toLowerCase() === "sad" ? 1 : 0,
                      anger: emotion.toLowerCase() === "angry" ? 1 : 0,
                      neutrality: emotion.toLowerCase() === "neutral" ? 1 : 0,
                      text_sentiment: emotion,
                      text_sentiment_score: emotion !== "unknown" ? 1 : 0, // Ajusta según si hay emoción válida
                    },
                    voice: {
                      pitch: 0, // Valor por defecto, ajusta si tienes datos
                      pitch_std_dev: 0,
                      loudness: 0,
                      zcr: 0,
                      hnr: 0,
                      tempo: 0,
                    },
                    // download: undefined, // Opcional, no hay datos en ApiCall
                  };
                }),
              }
            : null,
          download: call.report?.path ? (
            <button
              onClick={async () => {
                try {
                  const url = call.report?.path ?? "";
                  window.open(url, "_blank");
                } catch (error) {
                  console.error("Error al abrir el PDF:", error);
                  alert("No se pudo abrir el archivo PDF.");
                }
              }}
              title="Descargar PDF"
              className="text-blue-400 text-lg"
            >
              📄
            </button>
          ) : (
            <span className="text-gray-400">-</span>
          ),
          deleteButton: showDelete ? (
            <button
              onClick={async () => {
                const confirmDelete = confirm(
                  "¿Estás seguro de que quieres eliminar esta llamada?"
                );
                if (!confirmDelete) return;

                try {
                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/calls/${call.id_call}`,
                    {
                      method: "DELETE",
                      headers: {
                        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
                      },
                    }
                  );
                  if (res.ok) {
                    setCallsData((prev) =>
                      prev.filter((c) => c.id !== call.id_call)
                    );
                  } else {
                    alert("Error al eliminar la llamada");
                  }
                } catch (err) {
                  console.error("Error al eliminar:", err);
                  alert("Error de red al eliminar");
                }
              }}
              className="text-red-500 text-xl hover:text-red-700 ml-auto"
              title="Eliminar llamada"
            >
              🗑️
            </button>
          ) : null,
        }));

        setCallsData(calls);
      })
      .catch((error) => {
        console.error("Error al obtener las llamadas:", error);
      });
  }, [refresh, role, id_team, agentName]);

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
          deleteButton: call.deleteButton,
        }))}
        showDelete={showDelete}
      />

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
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {selectedCall.transcript.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      entry.speaker !== selectedCall.name
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-[75%] shadow ${
                        entry.speaker.toLowerCase().includes("client")
                          ? "bg-gray-700 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <p className="text-xs text-gray-300 mb-1">
                        {entry.speaker}
                      </p>
                      <p className="text-sm">{entry.message}</p>
                    </div>
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

      {selectedCall && view === "report" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
          onClick={() => setView("none")}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#151D2A] border border-gray-500 text-white p-6 rounded-md max-w-2xl w-full shadow-xl overflow-y-auto max-h-[90vh]"
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
              {selectedCall.report?.summary}
            </p>

            {selectedCall.report?.overall_emotion !== undefined && (
              <p className="mt-2">
                <strong>Overall Emotion Score:</strong>{" "}
                {safeFixed(selectedCall.report?.overall_emotion)}
              </p>
            )}

            {selectedCall.report?.silence_percentage !== undefined && (
              <p>
                <strong>Silence %:</strong>{" "}
                {safeFixed(selectedCall.report?.silence_percentage)}%
              </p>
            )}

            {selectedCall.report?.speakers &&
              selectedCall.report.speakers.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-1">
                    Análisis por hablante:
                  </h3>
                  {selectedCall.report.speakers.map((speaker, index) => (
                    <div
                      key={index}
                      className="mb-2 border-t border-gray-700 pt-2"
                    >
                      <p className="text-sm text-gray-300 mb-1">
                        <strong>{speaker.role}</strong>
                      </p>
                      <p className="text-sm">
                        <strong>Emociones:</strong>
                        <br />
                        Felicidad: {safeFixed(speaker.emotions.happiness)} |
                        Tristeza: {safeFixed(speaker.emotions.sadness)} | Ira:{" "}
                        {safeFixed(speaker.emotions.anger)} | Neutralidad:{" "}
                        {safeFixed(speaker.emotions.neutrality)}
                        <br />
                        Sentimiento de texto: {
                          speaker.emotions.text_sentiment
                        }{" "}
                        ({safeFixed(speaker.emotions.text_sentiment_score)})
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Voz:</strong>
                        <br />
                        Pitch: {safeFixed(speaker.voice.pitch)} Hz | Tempo:{" "}
                        {safeFixed(speaker.voice.tempo)} BPM
                        <br />
                        Volumen: {safeFixed(speaker.voice.loudness, 4)} | ZCR:{" "}
                        {safeFixed(speaker.voice.zcr, 4)} | HNR:{" "}
                        {safeFixed(speaker.voice.hnr)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            {selectedCall.report?.suggestions &&
              selectedCall.report.suggestions.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-1">Sugerencias:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {selectedCall.report.suggestions.map((sug, idx) => (
                      <li key={idx}>{sug}</li>
                    ))}
                  </ul>
                </div>
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
