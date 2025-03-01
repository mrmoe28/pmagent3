"use client";

import { useState } from "react";
import { SolarProject, DocumentFile } from "@/app/types/solar.types";
import { useSolarProjectStore } from "@/app/lib/store/solarStore";
import { Button } from "@/app/components/ui/button";
import { FileUpload } from "@/app/components/ui/file-upload";

interface DocumentsProps {
  project: SolarProject;
}

export function Documents({ project }: DocumentsProps) {
  const { addDocument, deleteDocument } = useSolarProjectStore();
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentCategory, setDocumentCategory] = useState<DocumentFile["category"]>("other");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleAddDocument = () => {
    if (!selectedFile) return;

    // In a real app, you would upload the file to a server
    // For now, we'll create a data URL
    const reader = new FileReader();
    reader.onload = () => {
      const newDocument: Omit<DocumentFile, "id" | "uploadDate"> = {
        url: reader.result as string,
        name: selectedFile.name,
        type: selectedFile.name.endsWith(".pdf") ? "pdf" : "other",
        size: selectedFile.size,
        description: documentDescription,
        category: documentCategory,
      };

      addDocument(project.id, newDocument);
      
      // Reset form
      setIsAddingDocument(false);
      setDocumentDescription("");
      setDocumentCategory("other");
      setSelectedFile(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(project.id, documentId);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getCategoryLabel = (category: DocumentFile["category"]): string => {
    switch (category) {
      case "permit": return "Permit";
      case "contract": return "Contract";
      case "invoice": return "Invoice";
      case "report": return "Report";
      default: return "Other";
    }
  };

  const getCategoryColor = (category: DocumentFile["category"]): string => {
    switch (category) {
      case "permit": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "contract": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "invoice": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "report": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Documents
        </h2>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => setIsAddingDocument(!isAddingDocument)}
        >
          {isAddingDocument ? "Cancel" : "Add Document"}
        </Button>
      </div>

      {isAddingDocument && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Add New Document
          </h3>
          <div className="space-y-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              label="Upload PDF Document"
              buttonText="Select PDF"
              accept=".pdf,application/pdf"
              allowedFileTypes={["application/pdf"]}
            />

            <div>
              <label
                htmlFor="document-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <input
                id="document-description"
                type="text"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter document description"
              />
            </div>

            <div>
              <label
                htmlFor="document-category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Category
              </label>
              <select
                id="document-category"
                value={documentCategory || "other"}
                onChange={(e) => setDocumentCategory(e.target.value as DocumentFile["category"])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                aria-label="Select document category"
              >
                <option value="permit">Permit</option>
                <option value="contract">Contract</option>
                <option value="invoice">Invoice</option>
                <option value="report">Report</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleAddDocument}
                disabled={!selectedFile}
              >
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      )}

      {project.documents.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No documents uploaded yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload PDF documents such as permits, contracts, and reports.
          </p>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setIsAddingDocument(true)}
          >
            Upload First Document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.documents.map((document) => (
            <div
              key={document.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                        document.category || "other"
                      )}`}
                    >
                      {getCategoryLabel(document.category || "other")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteDocument(document.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete document"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center mb-2">
                  <svg
                    className="h-8 w-8 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {document.name}
                  </h3>
                </div>

                {document.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {document.description}
                  </p>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {new Date(document.uploadDate).toLocaleDateString()}
                  </span>
                  <span>{formatFileSize(document.size)}</span>
                </div>

                <div className="mt-4">
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none"
                  >
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Document
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 