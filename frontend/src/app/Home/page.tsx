// pages/Home.tsx
"use client";
import React from "react";
import Navigation from "../components/Navigation";
import Dashboard from "../components/Dashboard";

const Home: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen ">
      <Navigation />
      <Dashboard />
    </div>
  );
};

export default Home;
