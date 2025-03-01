"use client";

import { useState } from "react";
import { ProjectForm } from "@/app/components/projects/ProjectForm";
import { ProjectPlanDisplay } from "@/app/components/projects/ProjectPlanDisplay";
import { ProjectInput, ProjectPlan, ResearchResult } from "@/app/types/project.types";
import { conductResearch } from "@/app/lib/api/perplexity";
import { generateProjectPlan } from "@/app/lib/api/claude";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (projectInput: ProjectInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Step 1: Conduct research using Perplexity API
      const researchPrompt = `${projectInput.title}: ${projectInput.description} with the goal of ${projectInput.outcome} using ${projectInput.selectedStrategy} methodology`;
      const researchResult: ResearchResult = await conductResearch(researchPrompt);
      
      // Step 2: Generate project plan using Claude API
      const plan = await generateProjectPlan(projectInput, researchResult);
      
      setProjectPlan(plan);
    } catch (err) {
      console.error("Error generating project plan:", err);
      setError("An error occurred while generating your project plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <motion.div 
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <motion.h1 
            className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Project Management Planner
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Generate comprehensive project plans, standard operating procedures, and strategies tailored to your specific needs.
          </motion.p>
        </div>
        
        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8" 
            role="alert"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </motion.div>
        )}
        
        {!projectPlan ? (
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="h-2 bg-orange-500"></div>
            <div className="p-8">
              <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProjectPlanDisplay projectPlan={projectPlan} />
            
            <div className="flex justify-center mt-8">
              <motion.button
                onClick={() => setProjectPlan(null)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Another Plan
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 