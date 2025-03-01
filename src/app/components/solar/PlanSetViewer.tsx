"use client";

import { useState } from "react";
import { SolarProject, PlanSetImage, SolarTask } from "@/app/types/solar.types";
import { Button } from "@/app/components/ui/button";
import { useSolarProjectStore } from "@/app/lib/store/solarStore";

interface PlanSetViewerProps {
  project: SolarProject;
}

export function PlanSetViewer({ project }: PlanSetViewerProps) {
  const { addPlanSetImage, updateTask } = useSolarProjectStore();
  const [selectedImage, setSelectedImage] = useState<PlanSetImage | null>(
    project.planSetImages.length > 0 ? project.planSetImages[0] : null
  );
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskPosition, setTaskPosition] = useState<{ x: number; y: number } | null>(null);
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    section: "rail-installation" as "rail-installation" | "wire-management" | "panel-installation",
  });

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingTask || !selectedImage) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTaskPosition({ x, y });
  };

  const handleAddTask = () => {
    if (!taskPosition || !selectedImage) return;

    const task: Omit<SolarTask, "id" | "createdAt" | "updatedAt"> = {
      title: newTaskData.title,
      description: newTaskData.description,
      section: newTaskData.section,
      status: "not-started",
      position: taskPosition,
    };

    useSolarProjectStore.getState().addTask(project.id, task);
    
    // Reset form
    setIsAddingTask(false);
    setTaskPosition(null);
    setNewTaskData({
      title: "",
      description: "",
      section: "rail-installation",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload the file to a server
    // For now, we'll create a data URL
    const reader = new FileReader();
    reader.onload = () => {
      const newImage: Omit<PlanSetImage, "id" | "uploadDate"> = {
        url: reader.result as string,
        name: file.name,
        type: file.name.includes("blueprint") ? "blueprint" : "diagram",
        description: `Uploaded ${file.name}`,
      };

      addPlanSetImage(project.id, newImage);
    };
    reader.readAsDataURL(file);
  };

  const handleTaskStatusChange = (taskId: string, status: SolarTask["status"]) => {
    updateTask(project.id, taskId, { status });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Plan Sets & Diagrams
        </h2>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsAddingTask(!isAddingTask)}
            className={isAddingTask ? "bg-orange-100 text-orange-700 border-orange-300" : ""}
          >
            {isAddingTask ? "Cancel" : "Add Task to Plan"}
          </Button>
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="sr-only"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md inline-flex items-center"
            >
              Upload Plan
            </label>
          </div>
        </div>
      </div>

      {project.planSetImages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No plan sets uploaded yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload blueprints or diagrams to track progress on specific areas of the installation.
          </p>
          <div className="relative">
            <input
              type="file"
              id="file-upload-empty"
              className="sr-only"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-upload-empty"
              className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md inline-flex items-center"
            >
              Upload First Plan
            </label>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-fit">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              Available Plans
            </h3>
            <div className="space-y-3">
              {project.planSetImages.map((image) => (
                <div
                  key={image.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedImage?.id === image.id
                      ? "bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {image.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {image.type}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(image.uploadDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            {selectedImage ? (
              <div className="relative">
                <div
                  className="relative w-full h-[600px] bg-gray-100 dark:bg-gray-900 cursor-crosshair"
                  onClick={handleImageClick}
                >
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Task markers */}
                  {project.tasks
                    .filter((task) => task.position)
                    .map((task) => (
                      <div
                        key={task.id}
                        className={`absolute w-6 h-6 rounded-full -ml-3 -mt-3 border-2 border-white ${
                          task.status === "completed"
                            ? "bg-green-500"
                            : task.status === "in-progress"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          left: `${task.position?.x}%`,
                          top: `${task.position?.y}%`,
                        }}
                        title={task.title}
                      ></div>
                    ))}
                  
                  {/* New task marker */}
                  {isAddingTask && taskPosition && (
                    <div
                      className="absolute w-6 h-6 rounded-full -ml-3 -mt-3 border-2 border-white bg-blue-500 animate-pulse"
                      style={{
                        left: `${taskPosition.x}%`,
                        top: `${taskPosition.y}%`,
                      }}
                    ></div>
                  )}
                </div>

                {/* Task form */}
                {isAddingTask && taskPosition && (
                  <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Task Title
                        </label>
                        <input
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="task-section">
                          Section
                        </label>
                        <select
                          id="task-section"
                          value={newTaskData.section}
                          onChange={(e) =>
                            setNewTaskData({
                              ...newTaskData,
                              section: e.target.value as "rail-installation" | "wire-management" | "panel-installation",
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
                      <div className="flex items-end">
                        <Button
                          className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                          onClick={handleAddTask}
                          disabled={!newTaskData.title}
                        >
                          Add Task
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description (Optional)
                      </label>
                      <textarea
                        value={newTaskData.description}
                        onChange={(e) =>
                          setNewTaskData({
                            ...newTaskData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter task description"
                        rows={2}
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a plan to view
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task list for the selected plan */}
      {selectedImage && project.tasks.filter((task) => task.position).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Tasks on this Plan
          </h3>
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
                {project.tasks
                  .filter((task) => task.position)
                  .map((task) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
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
                        <select
                          id={`task-status-${task.id}`}
                          value={task.status}
                          onChange={(e) =>
                            handleTaskStatusChange(
                              task.id,
                              e.target.value as SolarTask["status"]
                            )
                          }
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                          aria-label={`Change status for task: ${task.title}`}
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 