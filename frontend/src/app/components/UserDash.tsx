// app/Dashboard.tsx
"use client";
import React from "react";
import { useDashboardData } from "../hooks/useDashUserData";
import Card, { CardContent } from "../components/ui/card";
import Progress from "../components/ui/progress";
import { ArrowLeft } from "lucide-react";

const Dashboard = () => {
  const {
    name,
    role,
    id_team,
    calls,
    teamAgents,
    selectedAgentId,
    setSelectedAgentId,
    fetchUserCalls,
    getAverageCallDuration,
    getEmotionDistribution,
  } = useDashboardData();

  const averageCallDuration = getAverageCallDuration();
  const emotionTotals = getEmotionDistribution();
  const max = Math.max(...Object.values(emotionTotals), 1);
  const colors = {
    happiness: "bg-green-400",
    sadness: "bg-blue-400",
    anger: "bg-red-400",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-400 mb-4">
          Bienvenido, <strong>{name}</strong> — Rol: {role} — Equipo: {id_team}
        </p>

        {!selectedAgentId && role === "TeamLeader" && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Selecciona un agente</h2>
            <div className="flex flex-col gap-3">
              {teamAgents.map((agent) => (
                <button
                  key={agent.id}
                  className="bg-transparent border border-white text-white hover:bg-white hover:text-gray-900 rounded px-4 py-2 transition text-left"
                  onClick={() => {
                    setSelectedAgentId(agent.id);
                    fetchUserCalls(agent.id);
                  }}
                >
                  {agent.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {(role !== "TeamLeader" || selectedAgentId) && (
          <>
            {role === "TeamLeader" && selectedAgentId && (
              <button
                onClick={() => {
                  setSelectedAgentId(null);
                }}
                className="flex items-center text-sm text-gray-400 hover:text-white mb-4"
              >
                <ArrowLeft className="mr-2" size={16} />
                Volver a lista de agentes
              </button>
            )}

            <h1 className="text-2xl font-bold mb-6">Dashboard de Llamadas</h1>

            <Card className="mb-6">
              <CardContent>
                <h2 className="text-xl font-semibold mb-2">
                  Duración Promedio de Llamadas
                </h2>
                <Progress
                  value={(averageCallDuration / 300) * 100}
                  label={`${averageCallDuration.toFixed(0)}s / 5min`}
                />
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent>
                <h2 className="text-xl font-semibold mb-4">
                  Distribución Total de Emociones
                </h2>
                <div className="space-y-3">
                  {Object.entries(emotionTotals).map(([emotion, val]) => (
                    <div key={emotion}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{emotion}</span>
                        <span>{val.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-4 bg-gray-700 rounded">
                        <div
                          className={`${
                            colors[emotion as keyof typeof colors]
                          } h-4 rounded`}
                          style={{ width: `${(val / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
