import { Suspense } from "react";
import { TaskList } from "@/app/components/tasks/TaskList";

export const metadata = {
  title: "Tasks | PmAgent3",
  description: "Manage your tasks with PmAgent3",
};

export default function TasksPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Task Management</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Suspense fallback={<div className="text-center py-8">Loading tasks...</div>}>
          <TaskList />
        </Suspense>
      </div>
    </div>
  );
} 