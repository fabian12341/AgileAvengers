"use client";
import React, { useState } from "react";
import Navigation from "../components/Navigation";
import Button from "../components/ui/button";
import { useCallsData } from "../hooks/useCallData";

const ReportsPage = () => {
  const callsData = useCallsData();
  const clients = Array.from(new Set(callsData.map(call => call.name)));

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-900 text-white px-8 py-10">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-2">Generate report</h1>
          <p className="text-gray-400 mb-4">
            Please fill out the following information to generate a report for a group of calls.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
            >
              <option value="" disabled className="text-gray-400 mb-4">
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
              className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
            />
            <input
              type="date"
              placeholder="End Date"
              className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
            />
          </div>

          <Button className="w-full sm:w-auto px-6 py-2 mt-4 rounded-full text-white transition bg-[#635169] border border-[#E5E8EB] hover:opacity-90">
            Generate
          </Button>

          {isGenerating && (
            <>
              <p className="mb-2">Generating report...</p>
              <div className="w-full max-w-xl h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-purple-500 w-[65%] transition-all duration-1000"></div>
              </div>

              <div className="flex gap-4">
                <Button className="flex items-center gap-2 bg-gray-800 border border-gray-600 px-4 py-2 rounded-md text-white hover:bg-gray-700 transition">
                  View
                </Button>
                <Button className="flex items-center gap-2 bg-gray-800 border border-gray-600 px-4 py-2 rounded-md text-white hover:bg-gray-700 transition">
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
