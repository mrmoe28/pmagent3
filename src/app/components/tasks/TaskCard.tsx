"use client";

import { Task } from "@/app/types/index.types";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { useTaskStore } from "@/app/lib/store";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateTask, removeTask } = useTaskStore();
  
  const statusColors = {
    "todo": "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    "completed": "bg-green-100 text-green-800",
  };
  
  const priorityColors = {
    "low": "bg-gray-100 text-gray-800",
    "medium": "bg-orange-100 text-orange-800",
    "high": "bg-red-100 text-red-800",
  };
  
  const toggleStatus = () => {
    const statusMap: Record<Task["status"], Task["status"]> = {
      "todo": "in-progress",
      "in-progress": "completed",
      "completed": "todo",
    };
    
    updateTask(task.id, { status: statusMap[task.status] });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
            {task.status}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </div>
      
      {isExpanded && task.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {task.description}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleStatus}
          >
            Change Status
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => removeTask(task.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
} 