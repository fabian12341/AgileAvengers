"use client";
import React from "react";
import Navigation from "../components/Navigation";
import Dashboard from "../components/Dashboard";
import { useSearchParams } from "next/navigation";

const Home: React.FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const role = searchParams.get("role") || "";
  const id_team = searchParams.get("id_team") || "";

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navigation name={name} role={role} id_team={id_team} />
      <Dashboard />
    </div>
  );
};

export default Home;
