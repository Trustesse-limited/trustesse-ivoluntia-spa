"use client";

import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SmartImage } from "@/components/SmartImage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { uploadFileAction } from "@/app/actions/auth";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  label?: string;
  onChange: (url: string | null) => void;
  initialUrl?: string;
}

/** Format a file size in bytes to a human readable string. */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  label = "Upload Image",
  onChange,
  initialUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Keep the name + size of the file while it is being uploaded
  const [pendingFile, setPendingFile] = useState<{ name: string; size: number } | null>(null);

  const handleFileUpload = async (file: File) => {
    if (isUploading) return;

    // Validate file type (some browsers report an empty MIME type for HEIC/HEIF,
    // so fall back to the file extension in that case)
    const isAllowedType =
      file.type === 'image/png' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/heic' ||
      file.type === 'image/heif';
    const hasAllowedExtension = /\.(png|jpe?g|heic|heif)$/i.test(file.name);
    if (!isAllowedType && !(file.type === '' && hasAllowedExtension)) {
      setError('Only PNG, JPEG, and HEIC files are allowed');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }

    setError(null);
    setPendingFile({ name: file.name, size: file.size });
    setIsUploading(true);

    try {
      const result = await uploadFileAction(file);
      if (result.success && result.data) {
        setPreviewUrl(result.data);
        onChange(result.data);
      } else {
        setPendingFile(null);
        setError(result.error || 'Failed to upload file');
      }
    } catch {
      setPendingFile(null);
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    // Reset the input so selecting the same file again re-triggers the upload
    e.target.value = '';
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleCancel = () => {
    // Remove the selected image and clear the file input so the same file
    // can be picked again
    setPreviewUrl(null);
    setError(null);
    setPendingFile(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    // Block file selection while an image is already set
    if (isUploading || previewUrl) return;
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (previewUrl) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (previewUrl) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (previewUrl) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      handleFileUpload(file);
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
          isDragging || isUploading ? styles.imageupload : ''
        } ${previewUrl ? 'cursor-not-allowed' : ''}`}
      >
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
          {/* Image preview (or uploading spinner) - always centered in the box */}
          <div className="relative flex h-40 w-full max-w-[200px] shrink-0 items-center justify-center">
          {isUploading ? (
            <LoadingSpinner size="lg" opacity={0.8} />
          ) : previewUrl ? (
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              <SmartImage
                src={previewUrl}
                alt={pendingFile?.name || "Selected image"}
                fill
                sizes="200px"
                objectFit="contain"
                fallbackSrc="/placeholder.svg"
              />
              {/* X cancel button - top right of the image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="absolute top-0 right-0 z-10 flex items-center justify-center w-5 h-5 rounded-full bg-black/60 text-white hover:bg-black/85 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  className="w-3 h-3"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <Image
              src="/placeholder.svg"
              alt="Placeholder"
              width={100}
              height={100}
              className="w-24 h-24 object-contain"
            />
          )}
        </div>
        {/* Image name + size (shown while uploading and after success) */}
        {pendingFile && (
          <div className="min-h-[22px] flex items-center justify-center gap-2 text-sm">
            <span
              className="text-[#424242] truncate max-w-[180px]"
              title={pendingFile.name}
            >
              {pendingFile.name}
            </span>
            <span className="text-[#666666]">({formatFileSize(pendingFile.size)})</span>
          </div>
        )}

        {/* Error message */}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {/* Action hint - only in the empty state (no preview) */}
        {!previewUrl && !isUploading && (
          <p className="text-sm text-center text-[#424242]">
            Click to upload or drag and drop
          </p>
        )}

        {/* Max file size note - always at the bottom */}
        <p className="text-sm font-medium text-[#AEA9B1] text-center">
          Max 10MB file size. PNG, JPEG, and HEIC files.
        </p>
        </div>
      </div>

      <Input
        id="photo"
        type="file"
        accept="image/png, image/jpeg, image/heic, image/heif"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
