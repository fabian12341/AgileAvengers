"use client";
import React from "react";
import Card, { CardContent } from "../components/ui/card";
import Progress from "../components/ui/progress";
import Tabs from "../components/ui/Tabs";
import Navigation from "../components/Navigation";
import Userbar from "../components/ui/UserCard";

const UserProfilePage = ({ role = "agent" }) => {
  const tabs = [
    {
      label: "Resumen",
      content: (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm text-gray-500">Total Calls</h3>
                <p className="text-2xl font-bold">3</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm text-gray-500">Silent Percentage</h3>
                <p className="text-2xl font-bold">58%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm text-gray-500">Positivity Score</h3>
                <p className="text-2xl font-bold">6396%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm text-gray-500">Average Call Length</h3>
                <p className="text-2xl font-bold">30</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h4 className="text-sm mb-2 text-gray-500">Emociones Detectadas</h4>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p>Anger</p>
                  <Progress value={66.91} label="Anger" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p>Sadness</p>
                  <Progress value={1} label="Sadness" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p>Happiness</p>
                  <Progress value={14} label="Happiness" />
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ),
    },
    ...(role === "leader"
      ? [
          {
            label: "Equipo",
            content: (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Resumen del Equipo
                </h3>
                <p className="text-sm text-gray-400">
                  Aquí puedes ver el desempeño promedio de tu equipo, agentes
                  destacados, y áreas de mejora.
                </p>
              </div>
            ),
          },
        ]
      : []),
    ...(role === "admin"
      ? [
          {
            label: "Administración",
            content: (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Administración del Sistema
                </h3>
                <p className="text-sm text-gray-400">
                  Desde aquí puedes gestionar usuarios, configuraciones del
                  sistema, y ver auditorías recientes.
                </p>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Navigation />

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-900 p-4">
        <Userbar
          name="Nombre del Usuario"
          email="usuario@empresa.com"
          role="admin"
          imageUrl="https://via.placeholder.com/100"
        />

        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
