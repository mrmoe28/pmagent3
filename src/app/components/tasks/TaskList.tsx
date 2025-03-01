"use client";

import { useTaskStore } from "@/app/lib/store";
import { TaskCard } from "./TaskCard";
import { useEffect } from "react";
import { Task } from "@/app/types/index.types";

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project setup",
    description: "Set up the Next.js project with TypeScript and Tailwind CSS",
    status: "completed",
    priority: "high",
    projectId: "project-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Create UI components",
    description: "Build reusable UI components using shadcn/ui",
    status: "in-progress",
    priority: "medium",
    projectId: "project-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Implement state management",
    description: "Set up Zustand for global state management",
    status: "todo",
    priority: "medium",
    projectId: "project-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function TaskList() {
  const { tasks, setTasks, isLoading, error } = useTaskStore();
  
  // Load mock data on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    setTasks(mockTasks);
  }, [setTasks]);
  
  if (isLoading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  
  if (tasks.length === 0) {
    return <div className="text-center py-8">No tasks found.</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Tasks</h2>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
} 