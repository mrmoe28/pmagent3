"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { useSolarProjectStore } from "@/app/lib/store/solarStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ProjectOverview } from "@/app/components/solar/ProjectOverview";
import { PlanSetViewer } from "@/app/components/solar/PlanSetViewer";
import { TaskManager } from "@/app/components/solar/TaskManager";
import { DailyUpdates } from "@/app/components/solar/DailyUpdates";
import { Documents } from "@/app/components/solar/Documents";

export default function SolarProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const { setCurrentProject, currentProject } = useSolarProjectStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
      setIsLoading(false);
    }
  }, [projectId, setCurrentProject]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Project not found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The project you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
            <Link href="/solar">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/solar" className="text-orange-500 hover:text-orange-600 mb-2 inline-block">
              ← Back to Projects
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentProject.title}
            </h1>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">Edit Project</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Add Daily Update
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Plan Sets & Diagrams</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="updates">Daily Updates</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <ProjectOverview project={currentProject} />
          </TabsContent>
          
          <TabsContent value="plans">
            <PlanSetViewer project={currentProject} />
          </TabsContent>
          
          <TabsContent value="tasks">
            <TaskManager project={currentProject} />
          </TabsContent>
          
          <TabsContent value="updates">
            <DailyUpdates project={currentProject} />
          </TabsContent>
          
          <TabsContent value="documents">
            <Documents project={currentProject} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 