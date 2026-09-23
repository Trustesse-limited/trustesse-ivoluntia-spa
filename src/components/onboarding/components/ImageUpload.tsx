"use client";
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  label?: string;
  onChange: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label = "Upload Image",
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onChange(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    
    // Validate file type
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      // Validate file size (10MB max)
      if (file.size <= 10 * 1024 * 1024) {
        setSelectedFile(file);
        onChange(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        alert('File size exceeds 10MB limit');
      }
    } else if (file) {
      alert('Only PNG and JPEG files are allowed');
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="photo" className="text-[#424242] font-semibold text-sm">
        {label}
      </Label>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full border-2 border-dashed border-[#818181] rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition hover:border-[#2C6EA3] ${
          isDragging ? styles.imageupload : ''
        }`}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Selected"
              height={100}
              width={100}
              className="w-24 h-24 object-contain mb-2"
            />
          ) : (
            <Image
              src="/placeholder.svg"
              alt="Placeholder"
              height={100}
              width={100}
              className="w-24 h-24 object-contain mb-2"
            />
          )}

          {selectedFile && (
            <p className="text-sm text-[#424242] mb-1">
              Selected: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}

          <p className="text-sm mb-1">Click to upload or drag and drop</p>
          <p className="text-sm font-medium text-[#AEA9B1]">
            Max 10MB file size. Only PNG and JPEG files.
          </p>
        </div>
      </div>

      <Input
        id="photo"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
