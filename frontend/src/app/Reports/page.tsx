"use client";
import React, { useState } from "react";
import Navigation from "../components/Navigation";
import Button from "../components/ui/button";

const ReportsPage = () => {
  const [isGenerating, setIsGenerating] = useState(true); // Puedes poner false por defecto
  const [selectedClient, setSelectedClient] = useState("");

  // Simulación de clientes (se reemplazará con datos del backend)
  const clients = ["Client A", "Client B", "Client C"];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-900 text-white px-8 py-10">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-2">Generate report</h1>
          <p className="mb-8">
            Please fill out the following information to generate a report for a group of calls.
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="bg-transparent border border-gray-400 text-white px-4 py-2 rounded w-[200px]"
            >
              <option value="" disabled>
                Select Client
              </option>
              {clients.map((client, index) => (
                <option key={index} value={client} className="text-black">
                  {client}
                </option>
              ))}
            </select>

            <input
              type="date"
              placeholder="Start Date"
              className="bg-transparent border border-gray-400 text-white px-4 py-2 rounded w-[200px]"
            />
            <input
              type="date"
              placeholder="End Date"
              className="bg-transparent border border-gray-400 text-white px-4 py-2 rounded w-[200px]"
            />
          </div>

          <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded mb-10">
            Generate
          </Button>

          {isGenerating && (
            <>
              <p className="mb-2">Generating report...</p>
              <div className="w-full max-w-xl h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-purple-500 w-[65%] transition-all duration-1000"></div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded">
                  View
                </Button>
                <Button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded">
                  Download
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ReportsPage;
