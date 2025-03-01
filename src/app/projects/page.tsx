"use client";

import { useState } from "react";
import { ProjectForm } from "@/app/components/projects/ProjectForm";
import { ProjectPlanDisplay } from "@/app/components/projects/ProjectPlanDisplay";
import { ProjectInput, ProjectPlan, ResearchResult } from "@/app/types/project.types";
import { conductResearch } from "@/app/lib/api/perplexity";
import { generateProjectPlan } from "@/app/lib/api/claude";

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
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
            Project Management Planner
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate comprehensive project plans, standard operating procedures, and strategies tailored to your specific needs.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8" role="alert">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {!projectPlan ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="h-2 bg-orange-500"></div>
            <div className="p-8">
              <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <ProjectPlanDisplay projectPlan={projectPlan} />
            
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setProjectPlan(null)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Create Another Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 