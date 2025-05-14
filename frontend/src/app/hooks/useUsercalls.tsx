// src/hooks/useDashboard.ts
import { useEffect, useState } from "react";
import axios from "axios";

interface Speaker {
  emotions: {
    happiness: number;
    sadness: number;
    anger: number;
  };
}

interface Report {
  id_report: number;
  summary: string;
  speakers: Speaker[];
}

interface Call {
  id_call: number;
  duration: number;
  silence_percentage: number;
  date?: string;
  report?: Report;
}

interface UserDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    id_team: number;
  };
  calls: Call[];
  reports: Report[]; // You can leave this as an empty array from backend for now
}

export const useDashboard = (id_user: number | null) => {
  const [dashboardData, setDashboardData] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id_user) throw new Error("ID de usuario no proporcionado");

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/User/${id_user}`,
          {
            headers: {
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
            },
          }
        );

        setDashboardData(res.data);
      } catch (err: any) {
        setError(
          err.response?.data?.error || err.message || "Error al obtener el dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [id_user]);

  return { dashboardData, loading, error };
};
