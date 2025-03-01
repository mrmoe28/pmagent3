"use client";

import { useState, useRef } from "react";
import { Button } from "./button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  buttonText?: string;
  className?: string;
  allowedFileTypes?: string[];
}

export function FileUpload({
  onFileSelect,
  accept = ".pdf,application/pdf",
  maxSizeMB = 10,
  label = "Upload Document",
  buttonText = "Select File",
  className = "",
  allowedFileTypes = ["application/pdf"]
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    // Check file type
    if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.type)) {
      setError(`File type not supported. Please upload ${allowedFileTypes.join(", ")}`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setFileName(file.name);
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setFileName(file.name);
        onFileSelect(file);
      }
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div 
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
          dragActive 
            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" 
            : "border-gray-300 dark:border-gray-600"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 48 48" 
            aria-hidden="true"
          >
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth={2} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          
          <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
            <Button 
              type="button"
              variant="ghost" 
              className="relative text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 font-medium"
              onClick={handleButtonClick}
            >
              {buttonText}
            </Button>
            <input
              ref={inputRef}
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept={accept}
              onChange={handleChange}
              aria-label={label || "File upload"}
            />
            <p className="pl-1 self-center">or drag and drop</p>
          </div>
          
          {fileName ? (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Selected: <span className="font-medium">{fileName}</span>
            </p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF documents up to {maxSizeMB}MB
            </p>
          )}
          
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 