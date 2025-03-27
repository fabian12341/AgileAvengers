"use client";
import React, { useState, useRef } from "react";
import Navigation from "../components/Navigation";
import { FileText } from "lucide-react";
import CallTable from "../components/ui/calltable";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      alert("File uploaded successfully!");
    }, 4000);
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
        {/* Upload Section */}
        <h1 className="text-2xl font-bold mb-4">Upload New Call</h1>
        <p className="text-gray-400 mb-4">
          Fill in the fields and select the file you wish to upload to generate
          a transcript and report. Supported format is mp3.
        </p>

        {/* Contenedor responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <input
            type="text"
            placeholder="Client"
            className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
          />
          <input
            type="text"
            placeholder="Agent"
            className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
          />
          <input
            type="text"
            placeholder="Project"
            className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
          />
          <input
            type="date"
            className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
          />
          <input
            type="time"
            className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
          />

          {/* Botón de archivo */}
          <div className="flex items-center justify-center sm:justify-start">
            <input
              type="file"
              accept="audio/*,video/*"
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

        {/* Progreso de subida */}
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

        {/* Search Section */}
        <h2 className="text-xl font-bold mt-10">
          Search for transcript or report
        </h2>
        <p className="text-gray-400 mb-4">
          Fill in the necessary fields to find a specific call.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Call ID"
            className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
          />
          <input
            type="text"
            placeholder="Client"
            className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
          />
          <input
            type="date"
            className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
          />
          <input
            type="time"
            className="bg-gray-800 p-2 rounded-md w-full border border-gray-600"
          />
        </div>

        <button className="w-full sm:w-auto px-6 py-2 rounded-full text-white transition bg-[#635169] border border-[#E5E8EB] hover:opacity-90">
          Search
        </button>
        <CallTable />
      </div>
    </div>
  );
};

export default UploadPage;
