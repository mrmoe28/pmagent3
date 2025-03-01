"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { strategies } from "@/app/lib/strategies";
import { ProjectInput, StrategyType } from "@/app/types/project.types";
import { StrategySelector } from "@/app/components/projects/StrategySelector";
import { FileUpload } from "@/app/components/ui/file-upload";
import { FileText, X } from "lucide-react";

interface ProjectFormProps {
  onSubmit: (projectInput: ProjectInput) => void;
  isLoading: boolean;
}

export function ProjectForm({ onSubmit, isLoading }: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [outcome, setOutcome] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>("agile");
  const [planSetFiles, setPlanSetFiles] = useState<File[]>([]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectInput: ProjectInput = {
      title,
      description,
      outcome,
      selectedStrategy,
      planSetFiles,
    };
    
    onSubmit(projectInput);
  };
  
  const handleFileSelect = (file: File) => {
    setPlanSetFiles(prev => [...prev, file]);
  };
  
  const handleRemoveFile = (index: number) => {
    setPlanSetFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white transition-colors"
            placeholder="Enter project title"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white transition-colors"
            placeholder="Describe your project in detail"
          />
        </div>
        
        <div>
          <label htmlFor="outcome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Desired Outcome
          </label>
          <textarea
            id="outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white transition-colors"
            placeholder="What specific outcomes are you trying to achieve with this project?"
          />
        </div>
        
        <div>
          <StrategySelector
            selectedStrategy={selectedStrategy}
            onStrategyChange={setSelectedStrategy}
            recommendedStrategies={outcome.length > 10 ? strategies.slice(0, 3) : []}
          />
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Upload Plan Sets (Optional)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Upload PDF plan sets to analyze equipment and generate a bill of materials
          </p>
          
          <FileUpload
            onFileSelect={handleFileSelect}
            accept=".pdf,application/pdf"
            label="Upload Plan Set PDF"
            buttonText="Select PDF"
            maxSizeMB={20}
            allowedFileTypes={["application/pdf"]}
          />
          
          {planSetFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Selected Files ({planSetFiles.length})
              </h4>
              {planSetFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading || !title || !description || !outcome}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Plan...
            </div>
          ) : (
            "Generate Project Plan"
          )}
        </Button>
      </div>
    </form>
  );
} 