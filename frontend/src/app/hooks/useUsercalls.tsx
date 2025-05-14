import { useEffect, useState } from "react";
import axios from "axios";

interface Call {
  id_call: number;
  duration: number;
  silence_percentage: number;
  date?: string;
  client?: string;
  report?: Report; // Añadido: relación con el Report
}

interface Report {
  id_report: number;
  summary: string;
  date?: string;
  client?: string;
  speakers: Speaker[]; // Añadido: lista de Speakers
}

interface Speaker {
  emotions: {
    happiness: number;
    sadness: number;
    anger: number;
  };
}

interface UserDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    id_team: number;
  };
  calls: Call[]; // Llamadas con su posible 'report'
  reports: Report[]; // Informes con sus speakers
}

export const useDashboard = (id_user: number | null) => {
  const [dashboardData, setDashboardData] = useState<UserDashboard | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id_user) throw new Error("ID de usuario no proporcionado");
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
        console.log("API Key:", process.env.NEXT_PUBLIC_API_KEY);
        console.log(
          "Solicitando a:",
          `${process.env.NEXT_PUBLIC_API_URL}/User/${id_user}`
        );
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/User/${id_user}`,
          {
            headers: {
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
            },
          }
        );
        console.log("✅ Datos del Dashboard recibidos:", response.data);
        setDashboardData(response.data);
      } catch (error: any) {
        console.error("❌ Error al obtener el Dashboard:", error);
        console.error(
          "Detalles del error:",
          error.response?.data || error.message
        );
        setError(
          error.response?.data?.error ||
            error.message ||
            "Error al conectar con el servidor"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id_user) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError("No se encontró el ID de usuario");
    }
  }, [id_user]);

  return { dashboardData, loading, error };
};
