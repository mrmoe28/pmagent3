export type SolarInstallationSection = 
  | 'rail-installation'
  | 'wire-management'
  | 'panel-installation';

export type SolarTaskStatus = 'not-started' | 'in-progress' | 'completed';

export interface SolarTask {
  id: string;
  title: string;
  description?: string;
  section: SolarInstallationSection;
  status: SolarTaskStatus;
  position?: {
    x: number;
    y: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanSetImage {
  id: string;
  url: string;
  name: string;
  uploadDate: Date;
  type: 'blueprint' | 'diagram' | 'photo' | 'pdf';
  description?: string;
}

export interface DocumentFile {
  id: string;
  url: string;
  name: string;
  uploadDate: Date;
  type: 'pdf' | 'doc' | 'xls' | 'other';
  size: number; // in bytes
  description?: string;
  category?: 'permit' | 'contract' | 'invoice' | 'report' | 'other';
}

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export type SolarProjectStatus = 
  | 'planning' 
  | 'in-progress' 
  | 'on-hold' 
  | 'completed';

export type SolarProjectType = 
  | 'residential' 
  | 'commercial' 
  | 'industrial' 
  | 'utility-scale';
export interface SolarProject {
  id: string;
  title: string;
  description: string;
  type: SolarProjectType;
  systemSize: number; // in kW
  startDate: Date;
  estimatedCompletion: Date;
  status: SolarProjectStatus;
  client: ClientInfo;
  tasks: SolarTask[];
  planSetImages: PlanSetImage[];
  dailyUpdates: DailyUpdate[];
  documents: DocumentFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyUpdate {
  id: string;
  date: Date;
  notes: string;
  hoursWorked: number;
  weatherConditions?: string;
  completedTasks: string[]; // Array of task IDs
  progressImageUrl?: string;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

// Store Actions
export type SolarProjectAction = 
  | { type: "ADD_PROJECT"; payload: SolarProject }
  | { type: "UPDATE_PROJECT"; payload: { id: string; data: Partial<SolarProject> } }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "ADD_TASK"; payload: { projectId: string; task: SolarTask } }
  | { type: "UPDATE_TASK"; payload: { projectId: string; taskId: string; data: Partial<SolarTask> } }
  | { type: "DELETE_TASK"; payload: { projectId: string; taskId: string } }
  | { type: "ADD_PLAN_SET_IMAGE"; payload: { projectId: string; image: PlanSetImage } }
  | { type: "DELETE_PLAN_SET_IMAGE"; payload: { projectId: string; imageId: string } }
  | { type: "ADD_DAILY_UPDATE"; payload: { projectId: string; update: DailyUpdate } }
  | { type: "DELETE_DAILY_UPDATE"; payload: { projectId: string; updateId: string } }; 