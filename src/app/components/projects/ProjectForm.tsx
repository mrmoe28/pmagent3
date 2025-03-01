"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { strategies } from "@/app/lib/strategies";
import { ProjectInput, StrategyType } from "@/app/types/project.types";
import { StrategySelector } from "./StrategySelector";

interface ProjectFormProps {
  onSubmit: (projectInput: ProjectInput) => void;
  isLoading: boolean;
}

export function ProjectForm({ onSubmit, isLoading }: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [outcome, setOutcome] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>("agile");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectInput: ProjectInput = {
      title,
      description,
      outcome,
      selectedStrategy,
    };
    
    onSubmit(projectInput);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter project title"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
            placeholder="Describe your project"
          />
        </div>
        
        <div>
          <label htmlFor="outcome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Desired Outcome
          </label>
          <textarea
            id="outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
            placeholder="What outcome are you trying to achieve?"
          />
        </div>
        
        <StrategySelector
          selectedStrategy={selectedStrategy}
          onStrategyChange={setSelectedStrategy}
          recommendedStrategies={outcome.length > 10 ? strategies.slice(0, 3) : []}
        />
      </div>
      
      <Button
        type="submit"
        disabled={isLoading || !title || !description || !outcome}
        className="w-full"
      >
        {isLoading ? "Generating Plan..." : "Generate Project Plan"}
      </Button>
    </form>
  );
} 