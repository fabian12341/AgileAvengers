"use client";
import React from "react";
import Tabs from "../components/ui/Tabs";
import Navigation from "../components/Navigation";
import Userbar from "../components/ui/UserCard";
import Dashboard from "./UserDash";
import { useRouter, useSearchParams } from "next/navigation";

const UserProfilePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Datos del usuario desde URL o localStorage
  const stored =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userInfo") || "{}")
      : {};

  const name = searchParams.get("name") || stored.name || "Nombre del Usuario";
  const role = searchParams.get("role") || stored.role || "agent";
  const id_team = searchParams.get("id_team") || stored.id_team || "";
  const id = searchParams.get("id") || stored.id || "";

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    router.push("/Login");
  };

  const tabs = [
    {
      label: "Resumen",
      content: <Dashboard />,
    },
    ...(role === "leader"
      ? [
          {
            label: "Equipo",
            content: (
              <div>
                <h3 className="text-lg font-semibold mb-4">Resumen del Equipo</h3>
                <p className="text-sm text-gray-400">
                  Aquí puedes ver el desempeño promedio de tu equipo, agentes destacados y áreas de mejora.
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
                <h3 className="text-lg font-semibold mb-4">Administración del Sistema</h3>
                <p className="text-sm text-gray-400">
                  Desde aquí puedes gestionar usuarios, configuraciones del sistema y ver auditorías recientes.
                </p>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Navigation name={name} role={role} id_team={id_team} />
      <div className="p-6 bg-gray-900 text-white min-h-screen space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <Userbar
              name={name}
              email={searchParams.get("email") || stored.email || "usuario@empresa.com"}
              role={role}
              imageUrl="https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
            />
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
            >
              🚪 Cerrar sesión
            </button>
          </div>

          <div className="col-span-2 space-y-6">
            <Tabs tabs={tabs} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
