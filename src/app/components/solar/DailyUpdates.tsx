"use client";

import { useState } from "react";
import { SolarProject, DailyUpdate } from "@/app/types/solar.types";
import { Button } from "@/app/components/ui/button";
import { useSolarProjectStore } from "@/app/lib/store/solarStore";

interface DailyUpdatesProps {
  project: SolarProject;
}

export function DailyUpdates({ project }: DailyUpdatesProps) {
  const { addDailyUpdate } = useSolarProjectStore();
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [newUpdateData, setNewUpdateData] = useState({
    notes: "",
    hoursWorked: 8,
    weatherConditions: "",
    completedTasks: [] as string[],
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTaskToggle = (taskId: string) => {
    setNewUpdateData((prev) => {
      const isSelected = prev.completedTasks.includes(taskId);
      return {
        ...prev,
        completedTasks: isSelected
          ? prev.completedTasks.filter((id) => id !== taskId)
          : [...prev.completedTasks, taskId],
      };
    });
  };

  const handleSubmit = () => {
    // In a real app, you would upload the image to a server
    // For now, we'll use the preview URL
    const update: Omit<DailyUpdate, "id" | "createdAt" | "updatedAt"> = {
      date: new Date(),
      notes: newUpdateData.notes,
      hoursWorked: newUpdateData.hoursWorked,
      weatherConditions: newUpdateData.weatherConditions,
      completedTasks: newUpdateData.completedTasks,
      progressImageUrl: previewUrl || undefined,
      createdBy: "current-user", // In a real app, this would be the current user's ID
    };

    addDailyUpdate(project.id, update);
    
    // Reset form
    setIsAddingUpdate(false);
    setNewUpdateData({
      notes: "",
      hoursWorked: 8,
      weatherConditions: "",
      completedTasks: [],
    });
    setPreviewUrl(null);
  };

  // Sort updates by date (newest first)
  const sortedUpdates = [...project.dailyUpdates].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Daily Updates
        </h2>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => setIsAddingUpdate(!isAddingUpdate)}
        >
          {isAddingUpdate ? "Cancel" : "Add Daily Update"}
        </Button>
      </div>

      {isAddingUpdate && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Add Daily Update
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="update-notes"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Notes
                </label>
                <textarea
                  id="update-notes"
                  value={newUpdateData.notes}
                  onChange={(e) =>
                    setNewUpdateData({ ...newUpdateData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter notes about today's progress"
                  rows={4}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="hours-worked"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Hours Worked
                  </label>
                  <input
                    id="hours-worked"
                    type="number"
                    min="0"
                    max="24"
                    value={newUpdateData.hoursWorked}
                    onChange={(e) =>
                      setNewUpdateData({
                        ...newUpdateData,
                        hoursWorked: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="weather-conditions"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Weather Conditions
                  </label>
                  <input
                    id="weather-conditions"
                    type="text"
                    value={newUpdateData.weatherConditions}
                    onChange={(e) =>
                      setNewUpdateData({
                        ...newUpdateData,
                        weatherConditions: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Sunny, Cloudy, Rainy"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Completed Tasks
                </label>
                {project.tasks.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No tasks available.
                  </p>
                ) : (
                  <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-2">
                    {project.tasks
                      .filter((task) => task.status !== "completed")
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start space-x-2 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                        >
                          <input
                            type="checkbox"
                            id={`task-${task.id}`}
                            checked={newUpdateData.completedTasks.includes(task.id)}
                            onChange={() => handleTaskToggle(task.id)}
                            className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`task-${task.id}`}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            <span className="font-medium">{task.title}</span>
                            {task.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {task.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">
                              Section: {task.section.replace("-", " ")}
                            </p>
                          </label>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Progress Photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  {previewUrl ? (
                    <div className="space-y-2 text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto h-40 object-cover"
                      />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 focus-within:outline-none"
                        >
                          <span>Change photo</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 focus-within:outline-none"
                        >
                          <span>Upload a photo</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleSubmit}
                  disabled={!newUpdateData.notes}
                >
                  Submit Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {sortedUpdates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No daily updates yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start tracking your daily progress by adding your first update.
          </p>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setIsAddingUpdate(true)}
          >
            Add First Update
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedUpdates.map((update) => (
            <div
              key={update.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Update: {new Date(update.date).toLocaleDateString()}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(update.date).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Notes
                      </h4>
                      <p className="text-gray-900 dark:text-white whitespace-pre-line">
                        {update.notes}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Hours Worked
                        </h4>
                        <p className="text-gray-900 dark:text-white">
                          {update.hoursWorked}
                        </p>
                      </div>
                      
                      {update.weatherConditions && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Weather
                          </h4>
                          <p className="text-gray-900 dark:text-white">
                            {update.weatherConditions}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {update.completedTasks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Completed Tasks
                        </h4>
                        <ul className="space-y-1 list-disc list-inside text-gray-900 dark:text-white">
                          {update.completedTasks.map((taskId) => {
                            const task = project.tasks.find((t) => t.id === taskId);
                            return (
                              <li key={taskId}>
                                {task ? task.title : "Unknown task"}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {update.progressImageUrl && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Progress Photo
                      </h4>
                      <img
                        src={update.progressImageUrl}
                        alt={`Progress on ${new Date(update.date).toLocaleDateString()}`}
                        className="w-full h-auto rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 