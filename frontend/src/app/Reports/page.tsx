"use client";
import React, { useState } from "react";
import Navigation from "../components/Navigation";
import Button from "../components/ui/button";
import { useCallsData } from "../hooks/useCallData";
import { useReports } from "../hooks/useReportsData";
import { Report } from "../hooks/useReportsData";
import { Call } from "../hooks/useCallData";

const ReportsPage = () => {
  const callsData = useCallsData();
  const { reports, deleteReport } = useReports();
  const clients = Array.from(new Set(callsData.map(call => call.name)));

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    const callDetail = callsData.find(call => call.id === report.call.id_call);
    setSelectedCall(callDetail || null);
  };

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
      window.location.reload();
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
                Select Agent
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
              <div key={report.id_report} className="bg-gray-800 p-4 rounded-md mb-4 cursor-pointer hover:bg-gray-700"
                onClick={() => handleReportClick(report)}>
                <p className="text-white font-bold">Reporte de llamada de {report.call.date}</p>
                <p className="text-gray-400 text-sm mb-2">Cliente ID: {report.call.client} — Agente: {report.call.agent}</p>
                <p className="text-white text-sm mb-2">{report.summary}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteReport(report.id_report);
                  }}
                  className="text-red-400 hover:text-red-200 text-sm"
                >
                  Eliminar reporte
                </button>
              </div>
            ))}
          </div>

          {selectedReport && selectedCall && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setSelectedReport(null);
                setSelectedCall(null);
              }}
            >
              <div
                className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4">Reporte detallado</h3>
                <p><strong>Fecha:</strong> {selectedCall.date}</p>
                <p><strong>Cliente:</strong> {selectedReport.call.client}</p>
                <p><strong>Agente:</strong> {selectedCall.name}</p>
                <p className="mt-4"><strong>Resumen:</strong> {selectedReport.summary}</p>
                {selectedCall.transcript.length > 0 && (
                  <div className="mt-4">
                    <strong>Transcript:</strong>
                    <p className="text-sm text-gray-300 mt-1">{selectedCall.transcript[0].message}</p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setSelectedCall(null);
                  }}
                  className="mt-4 text-sm text-blue-400 hover:underline"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
};

export default ReportsPage;
