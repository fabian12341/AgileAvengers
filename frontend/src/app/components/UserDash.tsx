"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card, { CardContent } from "../components/ui/card";
import Progress from "../components/ui/progress";
import { useDashboard } from "../hooks/useUsercalls";


interface Call {
  id_call: number;
  duration: number;
  silence_percentage: number;
  id_user: number;
  date?: string;
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
  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "Nombre del Usuario";
  const role = searchParams.get("role") || "agent";
  const id_team = searchParams.get("id_team") || "";
  const id_user = searchParams.get("id") || "";

  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/calls-by-agent-id/${id_user}`,
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

    if (id_user) {
      fetchCalls();
    }
  }, [id_user]);

  const getAverageCallDuration = () => {
    if (calls.length === 0) return 0;
    const total = calls.reduce((acc, call) => acc + call.duration, 0);
    return total / calls.length;
  };

  const getAverageEmotion = (emotion: "happiness" | "sadness" | "anger") => {
    let total = 0;
    let count = 0;

    calls.forEach((call) => {
      call.report?.speakers?.forEach((s) => {
        const val = s.emotions[emotion];
        if (typeof val === "number") {
          total += val;
          count++;
        }
      });
    });

    return count > 0 ? total / count : 0;
  };

  const averageCallDuration = getAverageCallDuration();
  const happiness = getAverageEmotion("happiness");
  const sadness = getAverageEmotion("sadness");
  const anger = getAverageEmotion("anger");

  const total = happiness + sadness + anger || 1; // evitar división por 0
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const getArc = (value: number, offset: number, color: string) => {
    const length = (value / total) * circumference;
    return (
      <circle
        r={radius}
        cx="100"
        cy="100"
        stroke={color}
        strokeWidth="30"
        fill="transparent"
        strokeDasharray={`${length} ${circumference - length}`}
        strokeDashoffset={-offset}
      />
    );
  };

  const happinessLength = (happiness / total) * circumference;
  const sadnessLength = (sadness / total) * circumference;

  const getEmotionDistribution = () => {
    const result = { happiness: 0, sadness: 0, anger: 0 };

    calls.forEach((call) => {
      call.report?.speakers?.forEach((s) => {
        (["happiness", "sadness", "anger"] as const).forEach((e) => {
          const val = s.emotions[e];
          if (typeof val === "number") {
            result[e] += val;
          }
        });
      });
    });

    return result;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-400 mb-4">
          Bienvenido, <strong>{name}</strong> — Rol: {role} — Equipo: {id_team}
        </p>

        <h1 className="text-2xl font-bold mb-4">Dashboard de Llamadas</h1>

        {/* Duración y pie chart */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Card className="flex-1 bg-gray-800">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">
                Duración Promedio de Llamadas
              </h2>
              <Progress
                value={(averageCallDuration / 300) * 100}
                label={`${averageCallDuration.toFixed(2)}s / 5min`}
              />
            </CardContent>
          </Card>

          <Card className="flex-1 bg-gray-800">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">
                Distribución Emocional Promedio
              </h2>
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                {getArc(happiness, 0, "#34D399")}
                {getArc(sadness, happinessLength, "#60A5FA")}
                {getArc(anger, happinessLength + sadnessLength, "#F87171")}
              </svg>
              <div className="text-center mt-2 text-sm text-gray-400">
                <p>Felicidad: {(happiness * 100).toFixed(1)}%</p>
                <p>Tristeza: {(sadness * 100).toFixed(1)}%</p>
                <p>Ira: {(anger * 100).toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Promedio barras */}
        <Card className="mb-4 bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Promedio de Emociones</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <Progress value={happiness * 100} label={`Felicidad: ${(happiness * 100).toFixed(2)}%`} />
              <Progress value={sadness * 100} label={`Tristeza: ${(sadness * 100).toFixed(2)}%`} />
              <Progress value={anger * 100} label={`Ira: ${(anger * 100).toFixed(2)}%`} />
            </div>
          </CardContent>
        </Card>

        {/* Distribución total */}
        <Card className="mb-4 bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Distribución Total de Emociones</h2>
            {(() => {
              const dist = getEmotionDistribution();
              const max = Math.max(...Object.values(dist), 1);
              const colors = {
                happiness: "bg-green-400",
                sadness: "bg-blue-400",
                anger: "bg-red-400",
              };

              return (
                <div className="space-y-3">
                  {Object.entries(dist).map(([emotion, val]) => (
                    <div key={emotion}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{emotion}</span>
                        <span>{val.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-4 bg-gray-700 rounded">
                        <div
                          className={`${colors[emotion as keyof typeof colors]} h-4 rounded`}
                          style={{ width: `${(val / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
