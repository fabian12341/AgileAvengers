// src/app/reports/page.tsx
"use client";
import React, { useState } from "react";
import Navigation from "../components/Navigation";
import Button from "../components/ui/button";
import { useCallsData } from "../hooks/useCallData";
import ReportModal from "../components/ReportModal";

const ReportsPage = () => {
  const callsData = useCallsData();
  const clients = Array.from(new Set(callsData.map(call => call.name)));

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const generateReport = async () => {
    const filteredCallIds = callsData
      .filter(call => {
        const matchesClient = selectedClient === "" || call.name === selectedClient;
        const callDate = new Date(call.date);
        const matchesDate = (!startDate || callDate >= new Date(startDate)) &&
                            (!endDate || callDate <= new Date(endDate));
        return matchesClient && matchesDate;
      })
      .map(call => call.id);

    if (filteredCallIds.length === 0) {
      alert("No se encontraron llamadas para generar el reporte.");
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/from-calls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || ""
        },
        body: JSON.stringify({ call_ids: filteredCallIds })
      });

      const data = await res.json();
      if (Array.isArray(data.reports)) {
        setReports(data.reports);
      } else if (data.id_report) {
        setReports([{ ...data }]);
      }
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("Error al generar el reporte.");
    } finally {
      setIsGenerating(false);
    }
  };

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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
            />
          </div>

          <Button
            className="w-full sm:w-auto px-6 py-2 mt-4 rounded-full text-white transition bg-[#635169] border border-[#E5E8EB] hover:opacity-90"
            onClick={generateReport}
          >
            Generate
          </Button>

          {isGenerating && (
            <>
              <p className="mb-2">Generating report...</p>
              <div className="w-full max-w-xl h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-purple-500 w-[65%] transition-all duration-1000"></div>
              </div>
            </>
          )}

          {reports.length > 0 && (
            <div className="mt-6 space-y-4">
              {reports.map((report, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedReport(report)}
                  className="cursor-pointer p-4 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition"
                >
                  📄 Reporte de llamada del {report.date || 'día desconocido'}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
};

export default ReportsPage;