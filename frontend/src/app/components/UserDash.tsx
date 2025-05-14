"use client";
import React from "react";
import Card, { CardContent } from "../components/ui/card";
import Progress from "../components/ui/progress";
import { useDashboard } from "../hooks/useUsercalls";

const Dashboard = () => {
  const stored =
    typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;
  console.log("Contenido de localStorage.userInfo:", stored);
  const fallback = stored ? JSON.parse(stored) : {};
  console.log("Objeto parseado:", fallback);
  const id_user = fallback.id || null; // Usa "id" porque el backend lo devuelve como "id"
  console.log("id_user:", id_user);

  const { dashboardData, loading, error } = useDashboard(id_user);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dashboardData) return <div>No hay datos disponibles</div>;

  const { user, calls } = dashboardData;

  const getAverageCallDuration = () => {
    if (calls.length === 0) return 0;
    const totalDuration = calls.reduce((acc, call) => acc + call.duration, 0);
    return totalDuration / calls.length;
  };

  const getAverageEmotion = (emotion: "happiness" | "sadness" | "anger") => {
    let totalEmotion = 0;
    let count = 0;

    calls.forEach((call) => {
      call.report?.speakers?.forEach((speaker) => {
        const value = speaker.emotions[emotion];
        if (typeof value === "number") {
          totalEmotion += value;
          count++;
        }
      });
    });

    return count > 0 ? totalEmotion / count : 0;
  };

  const getEmotionDistribution = () => {
    const distribution = { happiness: 0, sadness: 0, anger: 0 };

    calls.forEach((call) => {
      call.report?.speakers?.forEach((speaker) => {
        for (const emotion in distribution) {
          const val = speaker.emotions[emotion as keyof typeof distribution];
          if (typeof val === "number") {
            distribution[emotion as keyof typeof distribution] += val;
          }
        }
      });
    });

    return distribution;
  };

  const averageCallDuration = getAverageCallDuration();
  const happiness = getAverageEmotion("happiness");
  const sadness = getAverageEmotion("sadness");
  const anger = getAverageEmotion("anger");

  const total = happiness + sadness + anger;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const happinessLength = (happiness / total) * circumference;
  const sadnessLength = (sadness / total) * circumference;

  const getArc = (value: number, offset: number, color: string) => {
    const length = (value / total) * circumference;
    return (
      <circle
        key={color}
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-400 mb-4">
          Bienvenido, <strong>{user.name}</strong> — Rol: {user.role} — Equipo:{" "}
          {user.id_team}
        </p>

        <h1 className="text-2xl font-bold mb-4">Dashboard de Llamadas</h1>

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

        <Card className="mb-4 bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2 text-white">
              Tendencia de Felicidad por Fecha
            </h2>
            <div className="overflow-x-auto">
              <svg width={calls.length * 60} height="160">
                {[30, 80, 130].map((y, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={y}
                    x2={calls.length * 60}
                    y2={y}
                    stroke="#ccc"
                    strokeDasharray="4 2"
                  />
                ))}

                <polyline
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="2"
                  points={calls
                    .map((call, i) => {
                      const happiness =
                        call.report?.speakers?.[0]?.emotions?.happiness || 0;
                      const x = i * 60 + 30;
                      const y = 130 - happiness * 100;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />

                {calls.map((call, i) => {
                  const happiness =
                    call.report?.speakers?.[0]?.emotions?.happiness || 0;
                  const x = i * 60 + 30;
                  const y = 130 - happiness * 100;
                  return (
                    <circle key={i} cx={x} cy={y} r="4" fill="#34D399">
                      <title>
                        Fecha: {call.date || "N/A"} - Felicidad:{" "}
                        {(happiness * 100).toFixed(1)}%
                      </title>
                    </circle>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
