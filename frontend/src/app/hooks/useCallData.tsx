// src/app/hooks/useCallsData.ts
import { useState, useEffect } from "react";

export interface Call {
  id: number;
  name: string;
  date: string;
  duration: string;
  agent: string;
  sentimentScore: number;
  transcript: { speaker: string; message: string }[];
}

export const useCallsData = () => {
  const [callsData, setCallsData] = useState<Call[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls/users`, {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const calls = data.map((call: any) => ({
          id: call.id_call,
          name: call.user?.name || "Desconocido",
          date: call.date.split(" ")[0],
          duration: `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, "0")}`,
          agent: call.user?.role || "Sin rol",
          sentimentScore: 80,
          transcript: call.transcript?.text
            ? [{ speaker: call.user?.name || "Agente", message: call.transcript.text }]
            : [],
        }));
        setCallsData(calls);
      })
      .catch((error) => console.error("Error al obtener llamadas:", error));
  }, []);

  return callsData;
};
