"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navigation from "../components/Navigation";
import Dashboard from "../components/Dashboard";

const HomeClient = () => {
  useEffect(() => {
    const nameParam = searchParams.get("name");
    const roleParam = searchParams.get("role");
    const idTeamParam = searchParams.get("id_team");
    const idParam = searchParams.get("id");

    if (nameParam && roleParam && idTeamParam && idParam) {
      const userInfo = {
        name: nameParam,
        role: roleParam,
        id_team: idTeamParam,
        id: Number(idParam),
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }, []);

  const searchParams = useSearchParams();

  const stored = typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;
  const fallback = stored ? JSON.parse(stored) : {};

  const name = searchParams.get("name") || fallback.name || "";
  const role = searchParams.get("role") || fallback.role || "";
  const id_team = searchParams.get("id_team") || fallback.id_team || "";
  const idFromParams = searchParams.get("id");
  const id_user = idFromParams && !isNaN(Number(idFromParams)) ? Number(idFromParams) : fallback.id;

  useEffect(() => {
    if (typeof window !== "undefined" && name && role && id_team && id_user) {
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          name,
          role,
          id_team,
          id: id_user,
        })
      );
    }
  }, [name, role, id_team, id_user]);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navigation name={name} role={role} id_team={id_team} id={id_user} />
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-400 text-xl mb-4">
          Bienvenido, <strong>{name}</strong>
        </p>
      </div>
      <Dashboard />
    </div>
  );
};

export default HomeClient;