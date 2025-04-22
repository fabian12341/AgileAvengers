"use client";
import React, { useState, useRef, useEffect } from "react";
import Navigation from "../components/Navigation";
import { FileText } from "lucide-react";
import CallTable from "../components/Data/calltable";
import dynamic from "next/dynamic";

const ClientOnlyCreatableSelect = dynamic(() => import("react-select/creatable"), { ssr: false });

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [clients, setClients] = useState<{ label: string; value: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState<{ label: string; value: string } | null>(null);
  const [agent, setAgent] = useState("");
  const [project, setProject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [language, setLanguage] = useState("es");
  const [isUploading, setIsUploading] = useState(false);
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
          value: c.name,
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-call`, {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Call uploaded and processed successfully!");
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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Upload New Call</h1>
        <p className="text-gray-400 mb-4">
          Fill in the fields and select a <strong>.wav</strong> file to upload and generate
          a transcript and report.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <div className="col-span-1">
            <ClientOnlyCreatableSelect
              options={clients}
              value={selectedClient}
              onChange={(newValue: unknown) =>
                setSelectedClient(newValue as { label: string; value: string } | null)
              }
              placeholder="Search or select client"
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "38px",
                  backgroundColor: "#1f2937",
                  borderColor: "#4b5563",
                  color: "white",
                  width: "100%",
                  fontSize: "0.875rem"
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1f2937",
                  color: "white",
                  fontSize: "0.875rem",
                  border: "1px solid #4b5563",
                  zIndex: 9999
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? "#374151" : "#1f2937",
                  color: "white",
                  padding: "8px 12px",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#9ca3af"
                }),
              }}              
              menuPortalTarget={typeof window !== "undefined" ? document.body : undefined}
            />
          </div>

          <input
            type="text"
            placeholder="Agent"
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
          />
          <input
            type="text"
            placeholder="Project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
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
          <p className="text-gray-400 text-sm mt-2">Selected: {file.name}</p>
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

        <div className="mb-6"></div>
        <CallTable refresh={false} />
      </div>
    </div>
  );
};

export default UploadPage;
