"use client";
import React, { useEffect, useState } from "react";
import Card, { CardContent } from "../components/ui/card";
import Progress from "../components/ui/progress";

interface Call {
  id_call: number;
  duration: number;
  silence_percentage: number;
  id_user: number;
  report?: {
    overall_emotion?: number;
    speakers: Array<{
      emotions: {
        happiness?: number;
        sadness?: number;
        anger?: number;
      };
    }>;
  };
}

const Dashboard = () => {
  // Leer los datos del usuario desde el localStorage
  const stored =
    typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;
  const fallback = stored ? JSON.parse(stored) : {};

  const name = fallback.name || "";
  const role = fallback.role || "";
  const id_team = fallback.id_team || "";

  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/calls-by-agent/${name}`,
          {
            headers: {
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
            },
          }
        );
        const data = await res.json();
        setCalls(data);
      } catch (error) {
        console.error("Error fetching calls:", error);
      }
    };

    if (name) {
      fetchCalls();
    }
  }, [name]);

  // Función para calcular la duración promedio de las llamadas
  const getAverageCallDuration = () => {
    if (calls.length === 0) return 0;
    const totalDuration = calls.reduce((acc, call) => acc + call.duration, 0);
    return totalDuration / calls.length;
  };

  // Función para calcular las emociones promedio
  const getAverageEmotion = (emotion: "happiness" | "sadness" | "anger") => {
    const totalEmotion = calls.reduce((acc, call) => {
      const emotionValue =
        call.report?.speakers?.reduce((emotionAcc, speaker) => {
          return emotionAcc + (speaker.emotions[emotion] || 0);
        }, 0) || 0;
      return acc + emotionValue;
    }, 0);
    return totalEmotion / calls.length;
  };

  const averageCallDuration = getAverageCallDuration();
  const happiness = getAverageEmotion("happiness");
  const sadness = getAverageEmotion("sadness");
  const anger = getAverageEmotion("anger");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-400 mb-4">
          Bienvenido, <strong>{name}</strong> — Rol: {role} — Equipo: {id_team}
        </p>

        <h1 className="text-2xl font-bold mb-4">Dashboard de Llamadas</h1>

        {/* Promedio de duración de llamadas comparado con 5 minutos */}
        <Card className="mb-4 bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold">
              Duración Promedio de Llamadas
            </h2>
            <Progress
              value={(averageCallDuration / 300) * 100}
              label={`${averageCallDuration}s / 5min`}
            />
          </CardContent>
        </Card>

        {/* Gráfico de emociones: Felicidad, Tristeza, Ira */}
        <Card className="mb-4 bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold">Promedio de Emociones</h2>
            <div className="flex space-x-4">
              <div className="flex-1">
                <h3 className="text-md">Felicidad</h3>
                <Progress
                  value={happiness * 100}
                  label={`${(happiness * 100).toFixed(2)}%`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-md">Tristeza</h3>
                <Progress
                  value={sadness * 100}
                  label={`${(sadness * 100).toFixed(2)}%`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-md">Ira</h3>
                <Progress
                  value={anger * 100}
                  label={`${(anger * 100).toFixed(2)}%`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Llamadas individuales */}
        {calls.map((call) => (
          <Card key={call.id_call} className="mb-4 bg-gray-800">
            <CardContent>
              <p>
                <strong>ID de llamada:</strong> {call.id_call}
              </p>
              <p>
                <strong>Duración:</strong> {call.duration} segundos
              </p>
              <p>
                <strong>Silencio:</strong> {call.silence_percentage}%
              </p>
              {call.report && call.report.overall_emotion !== undefined && (
                <Progress
                  value={call.report.overall_emotion * 100}
                  label={`Emoción: ${(
                    call.report.overall_emotion * 100
                  ).toFixed(2)}%`}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
