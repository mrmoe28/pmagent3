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
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Project Management Planner</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Generate comprehensive project plans, standard operating procedures, and strategies tailored to your specific needs.
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {!projectPlan ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-6">
            <ProjectPlanDisplay projectPlan={projectPlan} />
            
            <div className="flex justify-center">
              <button
                onClick={() => setProjectPlan(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
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