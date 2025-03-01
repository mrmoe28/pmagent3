"use client";

import { useState } from "react";
import { SolarProject, SolarTask } from "@/app/types/solar.types";
import { Button } from "@/app/components/ui/button";
import { useSolarProjectStore } from "@/app/lib/store/solarStore";

interface TaskManagerProps {
  project: SolarProject;
}

export function TaskManager({ project }: TaskManagerProps) {
  const { addTask, updateTask, deleteTask } = useSolarProjectStore();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    section: "rail-installation" as const,
  });
  const [filter, setFilter] = useState<{
    section: string | null;
    status: string | null;
  }>({
    section: null,
    status: null,
  });

  const handleAddTask = () => {
    const task: Omit<SolarTask, "id" | "createdAt" | "updatedAt"> = {
      title: newTaskData.title,
      description: newTaskData.description,
      section: newTaskData.section,
      status: "not-started",
    };

    addTask(project.id, task);
    
    // Reset form
    setIsAddingTask(false);
    setNewTaskData({
      title: "",
      description: "",
      section: "rail-installation",
    });
  };

  const handleTaskStatusChange = (taskId: string, status: SolarTask["status"]) => {
    updateTask(project.id, taskId, { status });
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(project.id, taskId);
    }
  };

  const filteredTasks = project.tasks.filter((task) => {
    if (filter.section && task.section !== filter.section) {
      return false;
    }
    if (filter.status && task.status !== filter.status) {
      return false;
    }
    return true;
  });

  const sectionCounts = {
    "rail-installation": project.tasks.filter(
      (task) => task.section === "rail-installation"
    ).length,
    "wire-management": project.tasks.filter(
      (task) => task.section === "wire-management"
    ).length,
    "panel-installation": project.tasks.filter(
      (task) => task.section === "panel-installation"
    ).length,
  };

  const statusCounts = {
    "not-started": project.tasks.filter(
      (task) => task.status === "not-started"
    ).length,
    "in-progress": project.tasks.filter(
      (task) => task.status === "in-progress"
    ).length,
    "completed": project.tasks.filter(
      (task) => task.status === "completed"
    ).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tasks
        </h2>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => setIsAddingTask(!isAddingTask)}
        >
          {isAddingTask ? "Cancel" : "Add Task"}
        </Button>
      </div>

      {isAddingTask && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Add New Task
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Task Title
              </label>
              <input
                id="task-title"
                type="text"
                value={newTaskData.title}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label
                htmlFor="task-section"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Section
              </label>
              <select
                id="task-section"
                value={newTaskData.section}
                onChange={(e) =>
                  setNewTaskData({
                    ...newTaskData,
                    section: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                aria-label="Select task section"
              >
                <option value="rail-installation">Rail Installation</option>
                <option value="wire-management">Wire Management</option>
                <option value="panel-installation">Panel Installation</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="task-description"
              value={newTaskData.description}
              onChange={(e) =>
                setNewTaskData({
                  ...newTaskData,
                  description: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter task description"
              rows={3}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleAddTask}
              disabled={!newTaskData.title}
            >
              Add Task
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label
              htmlFor="filter-section"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Filter by Section
            </label>
            <select
              id="filter-section"
              value={filter.section || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  section: e.target.value || null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
              aria-label="Filter tasks by section"
            >
              <option value="">All Sections</option>
              <option value="rail-installation">
                Rail Installation ({sectionCounts["rail-installation"]})
              </option>
              <option value="wire-management">
                Wire Management ({sectionCounts["wire-management"]})
              </option>
              <option value="panel-installation">
                Panel Installation ({sectionCounts["panel-installation"]})
              </option>
            </select>
          </div>
          <div>
            <label
              htmlFor="filter-status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Filter by Status
            </label>
            <select
              id="filter-status"
              value={filter.status || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  status: e.target.value || null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
              aria-label="Filter tasks by status"
            >
              <option value="">All Statuses</option>
              <option value="not-started">
                Not Started ({statusCounts["not-started"]})
              </option>
              <option value="in-progress">
                In Progress ({statusCounts["in-progress"]})
              </option>
              <option value="completed">
                Completed ({statusCounts["completed"]})
              </option>
            </select>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No tasks found matching the selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Task
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Section
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white capitalize">
                        {task.section.replace("-", " ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : task.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {task.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-3">
                        <select
                          id={`task-status-${task.id}`}
                          value={task.status}
                          onChange={(e) =>
                            handleTaskStatusChange(
                              task.id,
                              e.target.value as SolarTask["status"]
                            )
                          }
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                          aria-label={`Change status for task: ${task.title}`}
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          aria-label={`Delete task: ${task.title}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 