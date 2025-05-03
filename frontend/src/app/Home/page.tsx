"use client";
import React from "react";
import Navigation from "../components/Navigation";
import Dashboard from "../components/Dashboard";
import { useSearchParams } from "next/navigation";

const Home: React.FC = () => {
  const searchParams = useSearchParams();

  const stored = typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;
  const fallback = stored ? JSON.parse(stored) : {};

  const name = searchParams.get("name") || fallback.name || "";
  const role = searchParams.get("role") || fallback.role || "";
  const id_team = searchParams.get("id_team") || fallback.id_team || "";

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navigation name={name} role={role} id_team={id_team} />
      <Dashboard />
    </div>
  );
};

export default Home;
