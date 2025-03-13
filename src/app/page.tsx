import React from "react";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";

const Home = () => {
  return (
    <div className="bg-gray-950 text-white min-h-screen p-6">
      <Navigation />
      <Dashboard />
    </div>
  );
};

export default Home;
