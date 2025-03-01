"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/app/lib/store/projectStore";
import { ProjectPlanDisplay } from "@/app/components/projects/ProjectPlanDisplay";
import { ProjectAttachments } from "@/app/components/projects/ProjectAttachments";
import { PlanSetUploader } from "@/app/components/projects/PlanSetUploader";
import { BillOfMaterials } from "@/app/components/projects/BillOfMaterials";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { selectedProject, selectProject } = useProjectStore();
  
  useEffect(() => {
    if (projectId) {
      selectProject(projectId);
    }
  }, [projectId, selectProject]);
  
  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Link href="/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/projects">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">{selectedProject.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedProject.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-orange-900 dark:text-orange-300">
              {selectedProject.strategy}
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              Created: {selectedProject.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="plan">Project Plan</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="plansets">Plan Sets</TabsTrigger>
            <TabsTrigger value="bom">Bill of Materials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plan" className="mt-6">
            {selectedProject.plan ? (
              <ProjectPlanDisplay projectPlan={selectedProject.plan} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
                <h3 className="text-xl font-medium mb-4">No Project Plan Available</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  This project doesn&apos;t have a detailed plan yet. Return to the projects page to generate one.
                </p>
                <Link href="/projects">
                  <Button>
                    Go to Projects
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <ProjectAttachments project={selectedProject} />
          </TabsContent>
          
          <TabsContent value="plansets" className="mt-6">
            <PlanSetUploader project={selectedProject} />
          </TabsContent>
          
          <TabsContent value="bom" className="mt-6">
            <BillOfMaterials project={selectedProject} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 