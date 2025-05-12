"use client";
import React, { useEffect, useState } from "react";
import Card, { CardContent } from "../components/ui/card";
import Progress from "../components/ui/progress";

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
  const stored =
    typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;
  const fallback = stored ? JSON.parse(stored) : {};

  const name = fallback.name || "";
  const role = fallback.role || "";
  const id_team = fallback.id_team || "";
  const id_user = fallback.id_user || null;

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

  useEffect(() => {
    if (calls.length > 0) {
      console.log("Primer llamada:", calls[0]);
    }
  }, [calls]);

  const getAverageCallDuration = () => {
    if (calls.length === 0) return 0;
    const totalDuration = calls.reduce((acc, call) => acc + call.duration, 0);
    return totalDuration / calls.length;
  };

  const getAverageEmotion = (emotion: "happiness" | "sadness" | "anger") => {
    let totalEmotion = 0;
    let count = 0;

    calls.forEach((call) => {
      if (call.report?.speakers?.length) {
        call.report.speakers.forEach((speaker) => {
          const value = speaker.emotions[emotion];
          if (typeof value === "number") {
            totalEmotion += value;
            count++;
          }
        });
      }
    });

    return count > 0 ? totalEmotion / count : 0;
  };

  const averageCallDuration = getAverageCallDuration();
  const happiness = getAverageEmotion("happiness");
  const sadness = getAverageEmotion("sadness");
  const anger = getAverageEmotion("anger");

  const total = happiness + sadness + anger;
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
    const distribution = {
      happiness: 0,
      sadness: 0,
      anger: 0,
    };

    calls.forEach((call) => {
      call.report?.speakers?.forEach((speaker) => {
        for (const emotion in distribution) {
          const value = speaker.emotions[emotion as keyof typeof distribution];
          if (typeof value === "number") {
            distribution[emotion as keyof typeof distribution] += value;
          }
        }
      });
    });

    return distribution;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-400 mb-4">
          Bienvenido, <strong>{name}</strong> — Rol: {role} — Equipo: {id_team}
        </p>

        <h1 className="text-2xl font-bold mb-4">Dashboard de Llamadas</h1>

        {/* Gráficas combinadas en una sola fila responsiva */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Duración promedio */}
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

          {/* Pie Chart de emociones */}
          <Card className="flex-1 bg-gray-800">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">
                Distribución Emocional Promedio
              </h2>
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className="mx-auto"
              >
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

        {/* Promedio de emociones */}
        <Card className="mb-4 bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">
              Promedio de Emociones
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
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

        {/* Distribución total de emociones */}
        <Card className="mb-4 bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">
              Distribución Total de Emociones
            </h2>
            {(() => {
              const distribution = getEmotionDistribution();
              const maxValue = Math.max(...Object.values(distribution), 1);
              const barColors = {
                happiness: "bg-green-400",
                sadness: "bg-blue-400",
                anger: "bg-red-400",
              };
              return (
                <div className="space-y-3">
                  {Object.entries(distribution).map(([emotion, value]) => (
                    <div key={emotion}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{emotion}</span>
                        <span>{value.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-4 bg-gray-700 rounded">
                        <div
                          className={`${
                            barColors[emotion as keyof typeof barColors]
                          } h-4 rounded`}
                          style={{ width: `${(value / maxValue) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Línea de tiempo */}
        <Card className="mb-4 bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">
              Tendencia de Felicidad por Fecha
            </h2>
            <div className="overflow-x-auto">
              <svg width={calls.length * 60} height="150">
                {calls.map((call, i) => {
                  const y =
                    130 -
                    (call.report?.speakers?.[0]?.emotions?.happiness || 0) *
                      100;
                  return (
                    <circle
                      key={i}
                      cx={i * 60 + 30}
                      cy={y}
                      r="4"
                      fill="#34D399"
                    >
                      <title>{`Felicidad: ${
                        (call.report?.speakers?.[0]?.emotions?.happiness || 0) *
                        100
                      }%`}</title>
                    </circle>
                  );
                })}
                {calls.map((call, i) => {
                  const y1 =
                    130 -
                    (call.report?.speakers?.[0]?.emotions?.happiness || 0) *
                      100;
                  const next = calls[i + 1];
                  if (!next) return null;
                  const y2 =
                    130 -
                    (next.report?.speakers?.[0]?.emotions?.happiness || 0) *
                      100;
                  return (
                    <line
                      key={`line-${i}`}
                      x1={i * 60 + 30}
                      y1={y1}
                      x2={(i + 1) * 60 + 30}
                      y2={y2}
                      stroke="#34D399"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Detalle de llamadas individuales */}
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
              {call.report?.overall_emotion !== undefined && (
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
