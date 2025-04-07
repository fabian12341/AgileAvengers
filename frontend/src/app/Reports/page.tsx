"use client";
import React, { useState } from "react";
import Navigation from "../components/Navigation";
import Button from "../components/ui/button";
import { useCallsData } from "../hooks/useCallData";
import { useReports } from "../hooks/useReportsData";

const ReportsPage = () => {
  const callsData = useCallsData();
  const reports = useReports();
  const clients = Array.from(new Set(callsData.map(call => call.name)));

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      console.log("Reporte generado:", data);
      alert("Reporte generado correctamente. ID(s): " + data.reports.map((r: any) => r.id_report).join(", "));
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("Error al generar el reporte.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteReport = async (id: number) => {
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este reporte?");
    if (!confirmed) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      });
      window.location.reload();
    } catch (err) {
      console.error("Error al eliminar el reporte:", err);
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

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Reportes generados</h2>
            {reports.map(report => (
              <div key={report.id_report} className="bg-gray-800 p-4 rounded-md mb-4">
                <p className="text-white font-bold">Reporte de llamada de {report.call.date}</p>
                <p className="text-gray-400 text-sm mb-2">Cliente ID: {report.call.client} — Agente: {report.call.agent}</p>
                <p className="text-white text-sm mb-2">{report.summary}</p>
                <button
                  onClick={() => deleteReport(report.id_report)}
                  className="text-red-400 hover:text-red-200 text-sm"
                >
                  Eliminar reporte
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
};

export default ReportsPage;