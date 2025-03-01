"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { strategies } from "@/app/lib/strategies";
import { ProjectInput, StrategyType } from "@/app/types/project.types";
import { StrategySelector } from "./StrategySelector";
import { motion } from "framer-motion";

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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
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
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
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
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StrategySelector
            selectedStrategy={selectedStrategy}
            onStrategyChange={setSelectedStrategy}
            recommendedStrategies={outcome.length > 10 ? strategies.slice(0, 3) : []}
          />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="pt-4"
      >
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
      </motion.div>
    </form>
  );
} 