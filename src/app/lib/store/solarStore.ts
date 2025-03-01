import { create } from 'zustand';
import { SolarProject, SolarTask, PlanSetImage, DailyUpdate, DocumentFile } from '@/app/types/solar.types';
import { v4 as uuidv4 } from 'uuid';

interface SolarProjectStore {
  projects: SolarProject[];
  currentProject: SolarProject | null;
  isLoading: boolean;
  error: string | null;
  
  // Project actions
  setProjects: (projects: SolarProject[]) => void;
  setCurrentProject: (projectId: string) => void;
  addProject: (project: Omit<SolarProject, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, data: Partial<SolarProject>) => void;
  deleteProject: (id: string) => void;
  
  // Task actions
  addTask: (projectId: string, task: Omit<SolarTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (projectId: string, taskId: string, data: Partial<SolarTask>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  
  // Plan set image actions
  addPlanSetImage: (projectId: string, image: Omit<PlanSetImage, 'id' | 'uploadDate'>) => void;
  updatePlanSetImage: (projectId: string, imageId: string, updates: Partial<PlanSetImage>) => void;
  deletePlanSetImage: (projectId: string, imageId: string) => void;
  
  // Document actions
  addDocument: (projectId: string, document: Omit<DocumentFile, 'id' | 'uploadDate'>) => void;
  updateDocument: (projectId: string, documentId: string, updates: Partial<DocumentFile>) => void;
  deleteDocument: (projectId: string, documentId: string) => void;
  
  // Daily update actions
  addDailyUpdate: (projectId: string, update: Omit<DailyUpdate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDailyUpdate: (projectId: string, updateId: string, updates: Partial<DailyUpdate>) => void;
  deleteDailyUpdate: (projectId: string, updateId: string) => void;
}

// Mock data for demonstration
const mockProjects: SolarProject[] = [
  {
    id: '1',
    title: 'Residential Solar Installation - Johnson Family',
    description: 'Installation of a 10kW solar system for the Johnson family residence',
    type: 'residential',
    systemSize: 10,
    startDate: new Date('2023-06-01'),
    estimatedCompletion: new Date('2023-06-15'),
    status: 'in-progress',
    client: {
      name: 'Johnson Family',
      email: 'john.johnson@example.com',
      phone: '(555) 123-4567',
      address: {
        street: '123 Sunshine Ave',
        city: 'Solar City',
        state: 'CA',
        zipCode: '94000',
      },
    },
    tasks: [],
    planSetImages: [],
    dailyUpdates: [],
    documents: [],
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15'),
  },
];

export const useSolarProjectStore = create<SolarProjectStore>((set, get) => ({
  projects: mockProjects,
  currentProject: null,
  isLoading: false,
  error: null,
  
  setProjects: (projects) => set({ projects }),
  
  setCurrentProject: (projectId) => {
    const project = get().projects.find(p => p.id === projectId) || null;
    set({ currentProject: project });
  },
  
  addProject: (project) => set((state) => {
    const now = new Date();
    const newProject: SolarProject = {
      ...project,
      id: uuidv4(),
      tasks: [],
      planSetImages: [],
      dailyUpdates: [],
      documents: [],
      createdAt: now,
      updatedAt: now,
    };
    
    return { projects: [...state.projects, newProject] };
  }),
  
  updateProject: (id, data) => set((state) => ({
    projects: state.projects.map((project) => 
      project.id === id 
        ? { ...project, ...data, updatedAt: new Date() } 
        : project
    ),
    currentProject: state.currentProject?.id === id ? { ...state.currentProject, ...data, updatedAt: new Date() } : state.currentProject,
  })),
  
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((project) => project.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject,
  })),
  
  addTask: (projectId, task) => set((state) => {
    const now = new Date();
    const newTask: SolarTask = {
      ...task,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    return {
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { 
              ...project, 
              tasks: [...project.tasks, newTask],
              updatedAt: now,
            } 
          : project
      ),
      currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, tasks: [...state.currentProject.tasks, newTask], updatedAt: now } : state.currentProject,
    };
  }),
  
  updateTask: (projectId, taskId, data) => set((state) => {
    const now = new Date();
    
    return {
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { 
              ...project, 
              tasks: project.tasks.map((task) => 
                task.id === taskId 
                  ? { ...task, ...data, updatedAt: now } 
                  : task
              ),
              updatedAt: now,
            } 
          : project
      ),
      currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, tasks: state.currentProject.tasks.map((task) => task.id === taskId ? { ...task, ...data, updatedAt: now } : task), updatedAt: now } : state.currentProject,
    };
  }),
  
  deleteTask: (projectId, taskId) => set((state) => {
    const now = new Date();
    
    return {
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { 
              ...project, 
              tasks: project.tasks.filter((task) => task.id !== taskId),
              updatedAt: now,
            } 
          : project
      ),
      currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, tasks: state.currentProject.tasks.filter((task) => task.id !== taskId), updatedAt: now } : state.currentProject,
    };
  }),
  
  addPlanSetImage: (projectId, image) => set((state) => {
    const now = new Date();
    const newImage: PlanSetImage = {
      ...image,
      id: uuidv4(),
      uploadDate: now,
    };
    
    return {
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { 
              ...project, 
              planSetImages: [...project.planSetImages, newImage],
              updatedAt: now,
            } 
          : project
      ),
      currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, planSetImages: [...state.currentProject.planSetImages, newImage], updatedAt: now } : state.currentProject,
    };
  }),
  
  updatePlanSetImage: (projectId, imageId, updates) => set((state) => ({
    projects: state.projects.map((project) => 
      project.id === projectId 
        ? { 
            ...project, 
            planSetImages: project.planSetImages.map((image) => 
              image.id === imageId 
                ? { ...image, ...updates } 
                : image
            ),
            updatedAt: new Date(),
          } 
        : project
    ),
    currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, planSetImages: state.currentProject.planSetImages.map((image) => image.id === imageId ? { ...image, ...updates } : image), updatedAt: new Date() } : state.currentProject,
  })),
  
  deletePlanSetImage: (projectId, imageId) => set((state) => {
    const now = new Date();
    
    return {
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { 
              ...project, 
              planSetImages: project.planSetImages.filter((image) => image.id !== imageId),
              updatedAt: now,
            } 
          : project
      ),
      currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, planSetImages: state.currentProject.planSetImages.filter((image) => image.id !== imageId), updatedAt: now } : state.currentProject,
    };
  }),
  
  addDocument: (projectId, document) => set((state) => {
    const now = new Date();
    const newDocument: DocumentFile = {
      ...document,
      id: uuidv4(),
      uploadDate: now,
    };
    
    return {
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { 
              ...project, 
              documents: [...project.documents, newDocument],
              updatedAt: now,
            } 
          : project
      ),
      currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, documents: [...state.currentProject.documents, newDocument], updatedAt: now } : state.currentProject,
    };
  }),
  
  updateDocument: (projectId, documentId, updates) => set((state) => ({
    projects: state.projects.map((project) => 
      project.id === projectId 
        ? { 
            ...project, 
            documents: project.documents.map((document) => 
              document.id === documentId 
                ? { ...document, ...updates } 
                : document
            ),
            updatedAt: new Date(),
          } 
        : project
    ),
    currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, documents: state.currentProject.documents.map((document) => document.id === documentId ? { ...document, ...updates } : document), updatedAt: new Date() } : state.currentProject,
  })),
  
  deleteDocument: (projectId, documentId) => set((state) => {
    const now = new Date();
    
    return {
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { 
              ...project, 
              documents: project.documents.filter((document) => document.id !== documentId),
              updatedAt: now,
            } 
          : project
      ),
      currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, documents: state.currentProject.documents.filter((document) => document.id !== documentId), updatedAt: now } : state.currentProject,
    };
  }),
  
  addDailyUpdate: (projectId, update) => set((state) => {
    const now = new Date();
    const newUpdate: DailyUpdate = {
      ...update,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    let updatedTasks: SolarTask[] = [];
    
    const projects = state.projects.map((project) => {
      if (project.id === projectId) {
        updatedTasks = project.tasks.map((task) => {
          if (update.completedTasks.includes(task.id)) {
            return { ...task, status: 'completed', updatedAt: now };
          }
          return task;
        });
        
        return { 
          ...project, 
          tasks: updatedTasks,
          dailyUpdates: [...project.dailyUpdates, newUpdate],
          updatedAt: now,
        };
      }
      return project;
    });
    
    return { projects };
  }),
  
  updateDailyUpdate: (projectId, updateId, updates) => set((state) => ({
    projects: state.projects.map((project) => 
      project.id === projectId 
        ? { 
            ...project, 
            dailyUpdates: project.dailyUpdates.map((update) => 
              update.id === updateId 
                ? { ...update, ...updates, updatedAt: new Date() } 
                : update
            ),
            updatedAt: new Date(),
          } 
        : project
    ),
    currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, dailyUpdates: state.currentProject.dailyUpdates.map((update) => update.id === updateId ? { ...update, ...updates, updatedAt: new Date() } : update), updatedAt: new Date() } : state.currentProject,
  })),
  
  deleteDailyUpdate: (projectId, updateId) => set((state) => {
    const now = new Date();
    
    return {
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { 
              ...project, 
              dailyUpdates: project.dailyUpdates.filter((update) => update.id !== updateId),
              updatedAt: now,
            } 
          : project
      ),
      currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, dailyUpdates: state.currentProject.dailyUpdates.filter((update) => update.id !== updateId), updatedAt: now } : state.currentProject,
    };
  }),
})); 