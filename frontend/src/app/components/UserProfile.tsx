"use client";
import React from "react";
import Tabs from "../components/ui/Tabs";
import Navigation from "../components/Navigation";
import Userbar from "../components/ui/UserCard";
import Dashboard from "./UserDash";
interface Props {
  role?: string;
}

const UserProfilePage: React.FC<Props> = ({ role = "agent" }) => {
  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const tabs = [
    {
      label: "Resumen",
      content: <Dashboard />,
    },
    ...(storedUser.role === "leader"
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
    ...(storedUser.role === "admin"
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
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-900">
        <Userbar
          name={storedUser.name || "Nombre del Usuario"}
          email={storedUser.email || "usuario@empresa.com"}
          role={storedUser.role || role}
          imageUrl="https://via.placeholder.com/100"
        />
        <div className="col-span-2 space-y-6">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
