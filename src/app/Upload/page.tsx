"use client";
import React, { useState } from "react";
import Navigation from "../components/Navigation";
const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);

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

    console.log("Uploading file:", file.name);
    // Aquí iría la lógica para subir el archivo a un servidor
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Upload New Call</h1>
        <p className="text-gray-400 mb-4">
          Fill in the fields and select the file you wish to upload to generate
          a transcript and report.
        </p>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Client"
            className="bg-gray-800 p-2 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Topic"
            className="bg-gray-800 p-2 rounded-md w-full"
          />
          <input type="date" className="bg-gray-800 p-2 rounded-md w-full" />
          <input type="time" className="bg-gray-800 p-2 rounded-md w-full" />
        </div>

        <div className="flex gap-4 items-center mb-4">
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileChange}
            className="text-gray-400"
          />
        </div>

        <button
          onClick={handleUpload}
          className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
