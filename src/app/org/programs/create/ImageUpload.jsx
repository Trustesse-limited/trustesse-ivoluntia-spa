"use client";

import React, { useState } from "react";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // show image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return alert("Please select a file first");
    // Here you can handle uploading to a backend or API
    console.log("Uploading:", selectedFile);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Upload Box */}
      <label
        htmlFor="fileInput"
        className="w-64 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 10.5L12 6m0 0L7.5 10.5M12 6v12"
              />
            </svg>
            <p className="text-sm">Click to upload</p>
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
        className="px-4 py-2 bg-sky-300 hover:bg-sky-400 text-black font-medium rounded-md transition"
      >
        Upload
      </button>
    </div>
  );
};

export default ImageUpload;
