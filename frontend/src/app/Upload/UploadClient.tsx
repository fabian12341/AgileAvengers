"use client";

import React, { useState, useRef, useEffect } from "react";
import Navigation from "../components/Navigation";
import { FileText } from "lucide-react";
import CallTable from "../components/Data/calltable";
import ClientOnlySelect from "../components/ClientOnlySelect";
import { useSearchParams } from "next/navigation";
import TetrisPopup from "../components/tetrispopup";

const UploadClient = () => {
  const searchParams = useSearchParams();
  const stored =
    typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;
  const fallback = stored ? JSON.parse(stored) : {};

  const name = searchParams.get("name") || fallback.name || "";
  const role = searchParams.get("role") || fallback.role || "";
  const id_team = searchParams.get("id_team") || fallback.id_team || "";
  const idFromParams = searchParams.get("id");
  const id_user =
    idFromParams && !isNaN(Number(idFromParams))
      ? Number(idFromParams)
      : fallback.id;

  const [file, setFile] = useState<File | null>(null);
  const [clients, setClients] = useState<{ label: string; value: string }[]>(
    []
  );
  const [selectedClient, setSelectedClient] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [agent] = useState(name);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [project] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [language, setLanguage] = useState("es");
  const [isUploading, setIsUploading] = useState(false);
  //const [showTetrisPopup, setShowTetrisPopup] = useState(false); // NUEVO
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const options = data.map((c: { id_client: number; name: string }) => ({
          label: c.name,
          value: String(c.id_client),
        }));
        setClients(options);
      });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (!selectedFile.name.toLowerCase().endsWith(".wav")) {
        alert("Solo se permiten archivos .wav");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedClient || !agent || !date || !time) {
      alert("Please fill out all fields and select a .wav file.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("client", selectedClient.value);
    formData.append("agent", agent);
    formData.append("project", project);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("language", language);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload-call`,
        {
          method: "POST",
          headers: {
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Call uploaded and processed successfully!");
        setRefreshTrigger((prev) => !prev);
        //setShowTetrisPopup(true); // MOSTRAR POPUP AL SUBIR
      } else {
        console.error("Error:", data);
        alert(data.error || "Error uploading call.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Unexpected error uploading call.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation name={name} role={role} id_team={id_team} id={id_user} />
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-400 mb-4">
          Bienvenido, <strong>{name}</strong> — Rol: {role} — Equipo: {id_team}
        </p>

        {role === "Agent" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Upload New Call</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
              <div className="col-span-1">
                <ClientOnlySelect
                  options={clients}
                  value={selectedClient}
                  onChange={(newValue: unknown) =>
                    setSelectedClient(
                      newValue as { label: string; value: string } | null
                    )
                  }
                  placeholder="Selecciona un cliente"
                  isClearable
                  unstyled={true}
                  className="w-full"
                  classNames={{
                    control: () =>
                      "bg-gray-800 text-white border border-gray-600 rounded-md px-4 py-3 h-[70px] text-base",
                    input: () => "text-white",
                    singleValue: () => "text-white",
                    placeholder: () => "text-gray-400",
                    menu: () => "bg-gray-800 text-white z-50",
                    option: () => "hover:bg-gray-700 px-2 py-1",
                  }}
                  menuPortalTarget={
                    typeof window !== "undefined" ? document.body : undefined
                  }
                />
              </div>
              <input
                type="text"
                value={agent}
                readOnly
                className="bg-gray-800 p-2 rounded-md w-full border border-gray-600 cursor-not-allowed text-white"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
              <div className="flex items-center justify-center sm:justify-start">
                <input
                  type="file"
                  accept=".wav"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="flex items-center gap-2 bg-gray-800 border border-gray-600 px-4 py-2 rounded-md text-white hover:bg-gray-700 transition"
                >
                  <FileText size={20} />
                  File
                </button>
              </div>
            </div>

            {file && (
              <p className="text-gray-400 text-sm mt-2">
                Selected: {file.name}
              </p>
            )}

            <button
              onClick={handleUpload}
              className="w-full sm:w-auto px-6 py-2 mt-4 rounded-full text-white transition bg-[#635169] border border-[#E5E8EB] hover:opacity-90"
            >
              Upload
            </button>

            {isUploading && (
              <div className="mt-6">
                <p className="text-gray-400 mb-2">
                  Transcribing and creating report...
                </p>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </>
        )}
        {/* POPUP DE TETRIS */}
        <TetrisPopup />

        <div className="mb-6"></div>
        <CallTable
          refresh={refreshTrigger}
          role={role}
          id_team={id_team}
          agentName={name}
        />
      </div>
    </div>
  );
};

export default UploadClient;
