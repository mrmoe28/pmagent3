"use client";

import { ProjectPlan } from "@/app/types/project.types";
import { getStrategyById } from "@/app/lib/strategies";

interface ProjectPlanDisplayProps {
  projectPlan: ProjectPlan;
}

export function ProjectPlanDisplay({ projectPlan }: ProjectPlanDisplayProps) {
  const strategy = getStrategyById(projectPlan.strategy);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8">
        <h2 className="text-3xl font-bold text-white mb-3">{projectPlan.title}</h2>
        <p className="text-orange-100 text-lg">{projectPlan.description}</p>
        {strategy && (
          <div className="mt-6 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
            <span className="font-medium">{strategy.name}</span> Methodology
          </div>
        )}
      </div>
      
      <div className="p-8 space-y-10">
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Overview
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{projectPlan.overview}</p>
          </div>
        </section>
        
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Objectives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectPlan.objectives.map((objective, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-5 flex"
              >
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex-shrink-0 flex items-center justify-center mr-4">
                  <span className="text-orange-600 dark:text-orange-400 font-medium">{index + 1}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{objective}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            Key Milestones
          </h3>
          <div className="space-y-4">
            {projectPlan.keyMilestones.map((milestone, index) => (
              <div 
                key={index} 
                className="border-l-4 border-orange-500 pl-6 py-4 relative"
              >
                <div className="absolute -left-3 top-4 w-6 h-6 bg-orange-500 rounded-full"></div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{milestone.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{milestone.description}</p>
                <div className="text-orange-600 dark:text-orange-400 text-sm font-medium mt-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {milestone.estimatedDuration}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            Resources
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projectPlan.resources.map((resource, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 flex items-center"
              >
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex-shrink-0 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{resource}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            Risks & Mitigation
          </h3>
          <div className="space-y-4">
            {projectPlan.risks.map((risk, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-700/30 rounded-lg overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900 dark:text-white text-lg">{risk.description}</h4>
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
                  <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">Mitigation:</span> {risk.mitigation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Standard Operating Procedures
          </h3>
          <div className="space-y-8">
            {projectPlan.standardOperatingProcedures.map((procedure, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-700/30 rounded-lg overflow-hidden"
              >
                <div className="bg-orange-500 px-5 py-3">
                  <h4 className="font-medium text-white">{procedure.title}</h4>
                </div>
                <div className="p-5">
                  <ol className="list-none space-y-3">
                    {procedure.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex">
                        <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-orange-600 dark:text-orange-400 text-xs font-medium">{stepIndex + 1}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Recommendations
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
            <ul className="space-y-4">
              {projectPlan.recommendations.map((recommendation, index) => (
                <li 
                  key={index} 
                  className="flex"
                >
                  <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
} 