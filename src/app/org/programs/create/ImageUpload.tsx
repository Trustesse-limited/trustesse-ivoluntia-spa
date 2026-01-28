"use client";
import Image from "next/image";

import React, { useState } from "react";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }
    // Replace with API call or backend upload logic
    console.log("Uploading:", selectedFile);
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      {/* Upload Box */}
      <label
        htmlFor="fileInput"
        className="w-full md:w-64 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 10.5L12 6m0 0L7.5 10.5M12 6v12"
              />
            </svg>
            <p className="text-sm font-medium">Click or drag to upload</p>
            <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
          </div>
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className={`px-5 py-2 rounded-md font-semibold transition ${
          selectedFile
            ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring focus:ring-blue-300"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        {selectedFile ? "Upload" : "Select a file first"}
      </button>
    </div>
  );
};

export default ImageUpload;
