// src/app/hooks/useReports.ts
import { useState, useEffect } from "react";

export interface Report {
  id_report: number;
  summary: string;
  call: {
    id_call: number;
    date: string;
    client: number;
    agent: string;
  };
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    })
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error("Error al cargar reportes:", err));
  }, []);

  return reports;
};
