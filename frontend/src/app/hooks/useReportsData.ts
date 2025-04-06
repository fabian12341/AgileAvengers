// src/app/hooks/useReportsData.ts
import { useState, useEffect } from "react";

export interface Report {
  id_report: number;
  summary: string;
  calls: {
    id_call: number;
    date: string;
    client: number; // o el nombre si lo mapeas
  }[];
}

export const useReportsData = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    })
      .then((res) => res.json())
      .then(setReports)
      .catch((err) => console.error("Error al obtener reportes:", err));
  }, []);

  return reports;
};
