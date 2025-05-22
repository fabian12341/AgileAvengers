// src/app/hooks/useReportsData.ts
import { useState, useEffect } from "react";
import { Report } from "../types/Report";

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Error al cargar reportes:", err));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const deleteReport = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      });
      setReports((prev) => prev.filter((r) => r.id_report !== id));
    } catch (err) {
      console.error("Error al eliminar el reporte:", err);
    }
  };

  return { reports, deleteReport };
};
