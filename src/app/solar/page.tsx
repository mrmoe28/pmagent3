"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSolarProjectStore } from "@/app/lib/store/solarStore";
import { SolarProject, SolarProjectType, SolarProjectStatus, ClientInfo } from "@/app/types/solar.types";
import { Button } from "@/app/components/ui/button";

export default function SolarProjectsPage() {
  const router = useRouter();
  const { projects, addProject } = useSolarProjectStore();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProject, setNewProject] = useState<{
    title: string;
    description: string;
    type: SolarProjectType;
    systemSize: number;
    startDate: string;
    estimatedCompletion: string;
    status: SolarProjectStatus;
    client: ClientInfo;
  }>({
    title: "",
    description: "",
    type: "residential",
    systemSize: 5,
    startDate: new Date().toISOString().split("T")[0],
    estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "planning",
    client: {
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
  });

  const handleCreateProject = () => {
    addProject({
      ...newProject,
      startDate: new Date(newProject.startDate),
      estimatedCompletion: new Date(newProject.estimatedCompletion),
      id: Date.now().toString(),
      tasks: [],
      planSetImages: [],
      dailyUpdates: []
    });
    setIsCreatingProject(false);
    setNewProject({
      title: "",
      description: "",
      type: "residential",
      systemSize: 5,
      startDate: new Date().toISOString().split("T")[0],
      estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "planning",
      client: {
        name: "",
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
      },
    });
  };

  const getStatusColor = (status: SolarProjectStatus) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "on-hold":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Solar Projects
        </h1>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => setIsCreatingProject(!isCreatingProject)}
        >
          {isCreatingProject ? "Cancel" : "Create New Project"}
        </Button>
      </div>

      {isCreatingProject && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Create New Project
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="project-title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Project Title
                </label>
                <input
                  id="project-title"
                  type="text"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <label
                  htmlFor="project-description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter project description"
                  rows={3}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="project-type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Project Type
                  </label>
                  <select
                    id="project-type"
                    value={newProject.type}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        type: e.target.value as SolarProjectType,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    aria-label="Select project type"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="utility-scale">Utility Scale</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="system-size"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    System Size (kW)
                  </label>
                  <input
                    id="system-size"
                    type="number"
                    min="1"
                    step="0.1"
                    value={newProject.systemSize}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        systemSize: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="start-date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="estimated-completion"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Estimated Completion
                  </label>
                  <input
                    id="estimated-completion"
                    type="date"
                    value={newProject.estimatedCompletion}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        estimatedCompletion: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="project-status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Status
                </label>
                <select
                  id="project-status"
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      status: e.target.value as SolarProjectStatus,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  aria-label="Select project status"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Client Information
              </h3>
              <div>
                <label
                  htmlFor="client-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Client Name
                </label>
                <input
                  id="client-name"
                  type="text"
                  value={newProject.client.name}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      client: {
                        ...newProject.client,
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter client name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="client-email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    value={newProject.client.email}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        client: {
                          ...newProject.client,
                          email: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter client email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="client-phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    id="client-phone"
                    type="tel"
                    value={newProject.client.phone}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        client: {
                          ...newProject.client,
                          phone: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter client phone"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="client-street"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Street Address
                </label>
                <input
                  id="client-street"
                  type="text"
                  value={newProject.client.address.street}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      client: {
                        ...newProject.client,
                        address: {
                          ...newProject.client.address,
                          street: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter street address"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="client-city"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    City
                  </label>
                  <input
                    id="client-city"
                    type="text"
                    value={newProject.client.address.city}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        client: {
                          ...newProject.client,
                          address: {
                            ...newProject.client.address,
                            city: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label
                    htmlFor="client-state"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    State
                  </label>
                  <input
                    id="client-state"
                    type="text"
                    value={newProject.client.address.state}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        client: {
                          ...newProject.client,
                          address: {
                            ...newProject.client.address,
                            state: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label
                    htmlFor="client-zip"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Zip Code
                  </label>
                  <input
                    id="client-zip"
                    type="text"
                    value={newProject.client.address.zipCode}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        client: {
                          ...newProject.client,
                          address: {
                            ...newProject.client.address,
                            zipCode: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Zip Code"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleCreateProject}
                  disabled={!newProject.title || !newProject.client.name}
                >
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No projects yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first solar project to get started.
          </p>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setIsCreatingProject(true)}
          >
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                    {project.title}
                  </h2>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status.replace("-", " ")}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Type:
                    </span>{" "}
                    <span className="text-gray-900 dark:text-white capitalize">
                      {project.type.replace("-", " ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Size:
                    </span>{" "}
                    <span className="text-gray-900 dark:text-white">
                      {project.systemSize} kW
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Client:
                    </span>{" "}
                    <span className="text-gray-900 dark:text-white">
                      {project.client.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Start:
                    </span>{" "}
                    <span className="text-gray-900 dark:text-white">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {project.tasks.length} tasks
                  </div>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => router.push(`/solar/${project.id}`)}
                  >
                    View Project
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 