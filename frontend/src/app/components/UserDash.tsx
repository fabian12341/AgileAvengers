"use client";
import React, { useEffect, useState } from "react";
import Card, { CardContent } from "../components/ui/card";
import Progress from "../components/ui/progress";

// Datos simulados para pruebas sin login
const fakeCalls = [
  {
    id_call: 1,
    duration: 300,
    silence_percentage: 20,
    id_user: 1,
    report: {
      overall_emotion: 75,
      speakers: [
        { emotions: { happiness: 80, sadness: 10, anger: 10 } },
        { emotions: { happiness: 60, sadness: 30, anger: 10 } },
      ],
    },
  },
  {
    id_call: 2,
    duration: 180,
    silence_percentage: 10,
    id_user: 1,
    report: {
      overall_emotion: 65,
      speakers: [{ emotions: { happiness: 70, sadness: 20, anger: 10 } }],
    },
  },
];

interface DashboardData {
  totalCalls: number;
  silentPercentage: number;
  positivityScore: number;
  averageCallLength: number;
  emotions: {
    happiness: number;
    sadness: number;
    anger: number;
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carga de datos fake
    const loadFakeData = () => {
      try {
        const userCalls = fakeCalls;

        const totalCalls = userCalls.length;
        const silentPercentage =
          userCalls.reduce((sum, call) => sum + call.silence_percentage, 0) /
          totalCalls;
        const positivityScore =
          userCalls.reduce(
            (sum, call) => sum + (call.report?.overall_emotion || 0),
            0
          ) / totalCalls;
        const averageCallLength =
          userCalls.reduce((sum, call) => sum + call.duration, 0) /
          totalCalls /
          60;

        let totalHappiness = 0;
        let totalSadness = 0;
        let totalAnger = 0;
        let speakerCount = 0;

        userCalls.forEach((call) => {
          if (call.report?.speakers) {
            call.report.speakers.forEach((speaker) => {
              totalHappiness += speaker.emotions.happiness || 0;
              totalSadness += speaker.emotions.sadness || 0;
              totalAnger += speaker.emotions.anger || 0;
              speakerCount++;
            });
          }
        });

        const emotions = {
          happiness: speakerCount > 0 ? totalHappiness / speakerCount : 0,
          sadness: speakerCount > 0 ? totalSadness / speakerCount : 0,
          anger: speakerCount > 0 ? totalAnger / speakerCount : 0,
        };

        setData({
          totalCalls,
          silentPercentage,
          positivityScore,
          averageCallLength,
          emotions,
        });
        setLoading(false);
      } catch (err) {
        setError("Error al cargar datos simulados");
        setLoading(false);
      }
    };

    loadFakeData();
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div className="text-white">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">Total Calls</h3>
            <p className="text-2xl font-bold">{data.totalCalls}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">Silent Percentage</h3>
            <p className="text-2xl font-bold">
              {data.silentPercentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">Positivity Score</h3>
            <p className="text-2xl font-bold">
              {data.positivityScore.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500">Average Call Length</h3>
            <p className="text-2xl font-bold">
              {data.averageCallLength.toFixed(1)} min
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h4 className="text-sm mb-2 text-gray-500">Emociones Detectadas</h4>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p>Anger</p>
              <Progress value={data.emotions.anger} label="Anger" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p>Sadness</p>
              <Progress value={data.emotions.sadness} label="Sadness" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p>Happiness</p>
              <Progress value={data.emotions.happiness} label="Happiness" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
