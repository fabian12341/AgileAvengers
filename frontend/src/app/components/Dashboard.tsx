"use client";
import React from "react";
import Card, { CardContent } from "./ui/card";
import CallTable from "./Data/callTableHome";

const sentimentData = [
  { month: "January", score: 75 },
  { month: "February", score: 80 },
  { month: "March", score: 78 },
  { month: "April", score: 85 },
  { month: "May", score: 82 },
  { month: "June", score: 90 },
  { month: "July", score: 88 },
];

const topicsData = [
  { topic: "ProjectX", satisfaction: 60 },
  { topic: "ProjectY", satisfaction: 71 },
  { topic: "ProjectZ", satisfaction: 28 },
  { topic: "Issues", satisfaction: 87 },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mt-6 text-white">Welcome, Agent</h2>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="bg-gray-800 p-4 rounded-lg shadow-md">
          <CardContent>
            <h3 className="text-lg font-semibold text-white">Total Calls</h3>
            <p className="text-2xl text-white">2,200</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 p-4 rounded-lg shadow-md">
          <CardContent>
            <h3 className="text-lg font-semibold text-white">
              Positivity Score
            </h3>
            <p className="text-2xl text-white">86</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 p-4 rounded-lg shadow-md">
          <CardContent>
            <h3 className="text-lg font-semibold text-white">
              Average Call Length
            </h3>
            <p className="text-2xl text-white">4:32</p>
          </CardContent>
        </Card>
      </div>

      {/* Sección de gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Positivity Score Over Time */}
        <Card className="bg-gray-800 p-4 rounded-lg shadow-md">
          <CardContent>
            <h3 className="text-lg font-semibold text-white">
              Positivity Score Over Time
            </h3>
            <div className="mt-4 space-y-2">
              {sentimentData.map((data, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-16 text-sm text-white">{data.month}</span>
                  <div
                    className="h-3 bg-blue-500 rounded"
                    style={{ width: `${data.score}%` }}
                  ></div>
                   <span className="text-sm font-semibold text-white mb-2 ml-1">
                    {`${data.score}%`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Call Topics Satisfaction */}
        <Card className="bg-gray-800 p-4 rounded-lg shadow-md">
          <CardContent>
            <h3 className="text-lg font-semibold text-white">
              Main Call Topics Satisfaction
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {topicsData.length} topics
            </p>
            <div className="flex justify-around items-end h-48 mt-4">
              {topicsData.map((topic, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Percentage label above the bar */}
                  <span className="text-sm font-semibold text-white mb-2">
                    {`${topic.satisfaction}%`}
                  </span>
                  {/* Bar with gradient and rounded top */}
                  <div
                    className="w-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md"
                    style={{
                      height: `${topic.satisfaction * 1.5}px`, // Scale the height for better visibility
                      transition: "height 0.3s ease-in-out", // Smooth animation for height changes
                    }}
                  ></div>
                  {/* Topic label below the bar */}
                  <span className="text-xs mt-2 text-gray-300 text-center">
                    {topic.topic}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de historial de llamadas */}
      <div className="mt-6">
        <CallTable />
      </div>
    </div>
  );
};

export default Dashboard;
