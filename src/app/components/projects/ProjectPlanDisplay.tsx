"use client";

import { ProjectPlan } from "@/app/types/project.types";
import { getStrategyById } from "@/app/lib/strategies";

interface ProjectPlanDisplayProps {
  projectPlan: ProjectPlan;
}

export function ProjectPlanDisplay({ projectPlan }: ProjectPlanDisplayProps) {
  const strategy = getStrategyById(projectPlan.strategy);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-indigo-600 p-6">
        <h2 className="text-2xl font-bold text-white">{projectPlan.title}</h2>
        <p className="text-indigo-100 mt-2">{projectPlan.description}</p>
        {strategy && (
          <div className="mt-4 inline-block bg-indigo-700 px-3 py-1 rounded-full text-sm text-white">
            {strategy.name}
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Overview</h3>
          <p className="text-gray-700 dark:text-gray-300">{projectPlan.overview}</p>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Objectives</h3>
          <ul className="list-disc pl-5 space-y-2">
            {projectPlan.objectives.map((objective, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{objective}</li>
            ))}
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Milestones</h3>
          <div className="space-y-4">
            {projectPlan.keyMilestones.map((milestone, index) => (
              <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{milestone.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{milestone.description}</p>
                <div className="text-indigo-600 dark:text-indigo-400 text-sm mt-2">
                  Estimated Duration: {milestone.estimatedDuration}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
          <ul className="list-disc pl-5 space-y-2">
            {projectPlan.resources.map((resource, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{resource}</li>
            ))}
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Risks & Mitigation</h3>
          <div className="space-y-4">
            {projectPlan.risks.map((risk, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900 dark:text-white">{risk.description}</h4>
                  <div className="flex space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      risk.impact === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                        : risk.impact === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      Impact: {risk.impact}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      risk.probability === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                        : risk.probability === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      Probability: {risk.probability}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  <span className="font-medium">Mitigation:</span> {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Standard Operating Procedures</h3>
          <div className="space-y-6">
            {projectPlan.standardOperatingProcedures.map((procedure, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">{procedure.title}</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  {procedure.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-gray-700 dark:text-gray-300">{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
          <ul className="list-disc pl-5 space-y-2">
            {projectPlan.recommendations.map((recommendation, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{recommendation}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
} 