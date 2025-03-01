"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjectStore } from "@/app/lib/store/projectStore";
import { ProjectForm } from "@/app/components/projects/ProjectForm";
import { ProjectPlanDisplay } from "@/app/components/projects/ProjectPlanDisplay";
import { ProjectInput, ProjectPlan, ResearchResult } from "@/app/types/project.types";
import { conductResearch } from "@/app/lib/api/perplexity";
import { generateProjectPlan } from "@/app/lib/api/claude";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { PlusIcon, FileIcon } from "lucide-react";
import { analyzePdf } from "@/app/lib/services/pdfAnalyzer";

export default function ProjectsPage() {
  const { projects, addProject, addAttachment, markAttachmentAnalyzed, addEquipment, generateBillOfMaterials } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("existing");
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  
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
      
      // Step 3: Save the project with the generated plan
      if (plan) {
        const newProject = addProject({
          title: projectInput.title,
          description: projectInput.description,
          desiredOutcome: projectInput.outcome,
          strategy: projectInput.selectedStrategy,
        });
        
        setCreatedProjectId(newProject.id);
        
        // Step 4: Process plan set files if any
        if (projectInput.planSetFiles && projectInput.planSetFiles.length > 0) {
          for (const file of projectInput.planSetFiles) {
            // Create a file URL
            const reader = new FileReader();
            const filePromise = new Promise<string>((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            
            const fileUrl = await filePromise;
            
            // Add the attachment to the project
            const attachment = addAttachment(newProject.id, {
              name: file.name,
              url: fileUrl,
              type: 'pdf',
              size: file.size,
            });
            
            // Analyze the PDF to extract equipment data
            try {
              const equipment = await analyzePdf(fileUrl);
              
              // Update the attachment with the extracted equipment
              markAttachmentAnalyzed(newProject.id, attachment.id, equipment);
              
              // Add each equipment item to the project
              equipment.forEach(item => {
                addEquipment(newProject.id, {
                  name: item.name,
                  manufacturer: item.manufacturer,
                  model: item.model,
                  quantity: item.quantity,
                  specifications: item.specifications,
                  installationUrl: item.installationUrl,
                });
              });
            } catch (err) {
              console.error("Error analyzing PDF:", err);
            }
          }
          
          // Generate a bill of materials
          generateBillOfMaterials(newProject.id);
        }
      }
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
          <div>
            <Tabs defaultValue="existing" onValueChange={setActiveTab} className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Existing Projects</TabsTrigger>
                <TabsTrigger value="new">Create New Project</TabsTrigger>
              </TabsList>
              
              <TabsContent value="existing" className="mt-6">
                {projects.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                    <h3 className="text-xl font-medium mb-4">No Projects Yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You haven&apos;t created any projects yet. Click the button below to get started.
                    </p>
                    <Button onClick={() => setActiveTab("new")}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create Your First Project
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <Link href={`/projects/${project.id}`} key={project.id}>
                        <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle>{project.title}</CardTitle>
                            <CardDescription>
                              {new Date(project.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-orange-900 dark:text-orange-300">
                                {project.strategy}
                              </span>
                              <div className="flex items-center text-sm text-gray-500">
                                <FileIcon className="h-4 w-4 mr-1" />
                                {project.attachments.length} files
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="new" className="mt-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                  <div className="h-2 bg-orange-500"></div>
                  <div className="p-8">
                    <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-8">
            <ProjectPlanDisplay projectPlan={projectPlan} />
            
            <div className="flex justify-center mt-8 gap-4">
              {createdProjectId && (
                <Link href={`/projects/${createdProjectId}`}>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all">
                    View Project Details
                  </Button>
                </Link>
              )}
              <button
                onClick={() => {
                  setProjectPlan(null);
                  setCreatedProjectId(null);
                }}
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