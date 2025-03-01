import { SolarProject } from "@/app/types/solar.types";

interface ProjectOverviewProps {
  project: SolarProject;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Project Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description
                </h3>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {project.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Project Type
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white capitalize">
                    {project.type}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    System Size
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {project.systemSize} kW
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Start Date
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {project.startDate.toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Estimated Completion
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {project.estimatedCompletion.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </h3>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'planning' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                      : project.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Client Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Client Name
                </h3>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {project.client.name}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Contact Information
                </h3>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {project.client.email} | {project.client.phone}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Installation Address
                </h3>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {project.client.address.street}, {project.client.address.city}, {project.client.address.state} {project.client.address.zipCode}
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Project Progress
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Overall Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getProgressPercentage(project)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-orange-500 h-2.5 rounded-full"
                      style={{ width: `${getProgressPercentage(project)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <SectionProgress 
                    section="rail-installation" 
                    tasks={project.tasks} 
                  />
                  <SectionProgress 
                    section="wire-management" 
                    tasks={project.tasks} 
                  />
                  <SectionProgress 
                    section="panel-installation" 
                    tasks={project.tasks} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getProgressPercentage(project: SolarProject) {
  const completedTasks = project.tasks.filter(
    (task) => task.status === "completed"
  ).length;
  return project.tasks.length > 0
    ? Math.round((completedTasks / project.tasks.length) * 100)
    : 0;
}

interface SectionProgressProps {
  section: 'rail-installation' | 'wire-management' | 'panel-installation';
  tasks: SolarProject['tasks'];
}

function SectionProgress({ section, tasks }: SectionProgressProps) {
  const sectionTasks = tasks.filter(task => task.section === section);
  const completedTasks = sectionTasks.filter(task => task.status === 'completed').length;
  const percentage = sectionTasks.length > 0 
    ? Math.round((completedTasks / sectionTasks.length) * 100) 
    : 0;
  
  const sectionNames = {
    'rail-installation': 'Rail Installation',
    'wire-management': 'Wire Management',
    'panel-installation': 'Panel Installation'
  };
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-500 dark:text-gray-400">{sectionNames[section]}</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-orange-500 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {completedTasks} of {sectionTasks.length} tasks
      </div>
    </div>
  );
} 