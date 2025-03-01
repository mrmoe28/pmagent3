import { create } from 'zustand';
import { Project, ProjectPlan, ProjectAttachment, EquipmentItem, BillOfMaterials } from '@/app/types/project.types';
import { v4 as uuidv4 } from 'uuid';

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'attachments' | 'equipment' | 'billOfMaterials'>) => Project;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string) => void;
  addProjectPlan: (projectId: string, plan: Omit<ProjectPlan, 'id'>) => void;
  updateProjectPlan: (projectId: string, plan: Partial<ProjectPlan>) => void;
  addAttachment: (projectId: string, file: { name: string, url: string, type: 'pdf' | 'image' | 'other', size: number }) => ProjectAttachment;
  deleteAttachment: (projectId: string, attachmentId: string) => void;
  markAttachmentAnalyzed: (projectId: string, attachmentId: string, extractedEquipment?: EquipmentItem[]) => void;
  addEquipment: (projectId: string, equipment: Omit<EquipmentItem, 'id'>) => EquipmentItem;
  updateEquipment: (projectId: string, equipmentId: string, updates: Partial<EquipmentItem>) => void;
  deleteEquipment: (projectId: string, equipmentId: string) => void;
  generateBillOfMaterials: (projectId: string) => void;
  updateBillOfMaterials: (projectId: string, updates: Partial<BillOfMaterials>) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [
    {
      id: '1',
      title: 'Market Expansion Strategy',
      description: 'Develop a comprehensive strategy to expand our market presence in the APAC region.',
      desiredOutcome: 'Increase market share by 15% within 12 months',
      strategy: 'agile',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-20'),
      attachments: [],
    },
    {
      id: '2',
      title: 'Product Launch Campaign',
      description: 'Create a marketing campaign for our new product line launching in Q3.',
      desiredOutcome: 'Achieve 10,000 sales in the first month post-launch',
      strategy: 'kanban',
      createdAt: new Date('2023-02-10'),
      updatedAt: new Date('2023-02-15'),
      attachments: [],
    },
  ],
  selectedProject: null,
  
  addProject: (project) => {
    const now = new Date();
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      attachments: [],
    };
    
    set((state) => ({
      projects: [...state.projects, newProject]
    }));
    
    return newProject;
  },
  
  updateProject: (id, project) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === id 
        ? { ...p, ...project, updatedAt: new Date() } 
        : p
    ),
    selectedProject: state.selectedProject?.id === id 
      ? { ...state.selectedProject, ...project, updatedAt: new Date() } 
      : state.selectedProject
  })),
  
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
    selectedProject: state.selectedProject?.id === id ? null : state.selectedProject
  })),
  
  selectProject: (id) => set((state) => ({
    selectedProject: state.projects.find((p) => p.id === id) || null
  })),
  
  addProjectPlan: (projectId, plan) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === projectId 
        ? { ...p, plan: { ...plan, id: uuidv4() }, updatedAt: new Date() } 
        : p
    ),
    selectedProject: state.selectedProject?.id === projectId 
      ? { ...state.selectedProject, plan: { ...plan, id: uuidv4() }, updatedAt: new Date() } 
      : state.selectedProject
  })),
  
  updateProjectPlan: (projectId, plan) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === projectId && p.plan 
        ? { ...p, plan: { ...p.plan, ...plan }, updatedAt: new Date() } 
        : p
    ),
    selectedProject: state.selectedProject?.id === projectId && state.selectedProject.plan
      ? { ...state.selectedProject, plan: { ...state.selectedProject.plan, ...plan }, updatedAt: new Date() } 
      : state.selectedProject
  })),
  
  addAttachment: (projectId, file) => {
    const attachment: ProjectAttachment = {
      id: uuidv4(),
      name: file.name,
      url: file.url,
      type: file.type,
      size: file.size,
      createdAt: new Date(),
      analyzed: false,
    };
    
    set((state) => ({
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { ...project, attachments: [...project.attachments, attachment], updatedAt: new Date() }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? { ...state.selectedProject, attachments: [...state.selectedProject.attachments, attachment], updatedAt: new Date() }
        : state.selectedProject
    }));
    
    return attachment;
  },
  
  deleteAttachment: (projectId, attachmentId) => set((state) => {
    return {
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { ...project, attachments: project.attachments.filter(a => a.id !== attachmentId), updatedAt: new Date() }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? { ...state.selectedProject, attachments: state.selectedProject.attachments.filter(a => a.id !== attachmentId), updatedAt: new Date() }
        : state.selectedProject
    };
  }),

  markAttachmentAnalyzed: (projectId, attachmentId, extractedEquipment) => set((state) => {
    return {
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { 
              ...project, 
              attachments: project.attachments.map(a => 
                a.id === attachmentId 
                  ? { ...a, analyzed: true, extractedEquipment: extractedEquipment || [] }
                  : a
              ),
              updatedAt: new Date() 
            }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? { 
            ...state.selectedProject, 
            attachments: state.selectedProject.attachments.map(a => 
              a.id === attachmentId 
                ? { ...a, analyzed: true, extractedEquipment: extractedEquipment || [] }
                : a
            ),
            updatedAt: new Date() 
          }
        : state.selectedProject
    };
  }),

  addEquipment: (projectId, equipment) => {
    const newEquipment: EquipmentItem = {
      ...equipment,
      id: uuidv4(),
    };

    set((state) => ({
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { 
              ...project, 
              equipment: [...(project.equipment || []), newEquipment],
              updatedAt: new Date() 
            }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? { 
            ...state.selectedProject, 
            equipment: [...(state.selectedProject.equipment || []), newEquipment],
            updatedAt: new Date() 
          }
        : state.selectedProject
    }));
    
    return newEquipment;
  },

  updateEquipment: (projectId, equipmentId, updates) => set((state) => {
    return {
      projects: state.projects.map((project) => 
        project.id === projectId && project.equipment
          ? { 
              ...project, 
              equipment: project.equipment.map(e => 
                e.id === equipmentId 
                  ? { ...e, ...updates }
                  : e
              ),
              updatedAt: new Date() 
            }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId && state.selectedProject.equipment
        ? { 
            ...state.selectedProject, 
            equipment: state.selectedProject.equipment.map(e => 
              e.id === equipmentId 
                ? { ...e, ...updates }
                : e
            ),
            updatedAt: new Date() 
          }
        : state.selectedProject
    };
  }),

  deleteEquipment: (projectId, equipmentId) => set((state) => {
    return {
      projects: state.projects.map((project) => 
        project.id === projectId && project.equipment
          ? { 
              ...project, 
              equipment: project.equipment.filter(e => e.id !== equipmentId),
              updatedAt: new Date() 
            }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId && state.selectedProject.equipment
        ? { 
            ...state.selectedProject, 
            equipment: state.selectedProject.equipment.filter(e => e.id !== equipmentId),
            updatedAt: new Date() 
          }
        : state.selectedProject
    };
  }),

  generateBillOfMaterials: (projectId) => set((state) => {
    const project = state.projects.find(p => p.id === projectId);
    if (!project || !project.equipment || project.equipment.length === 0) {
      return state;
    }

    const now = new Date();
    const billOfMaterials: BillOfMaterials = {
      id: uuidv4(),
      items: [...project.equipment],
      createdAt: now,
      updatedAt: now,
    };

    return {
      projects: state.projects.map((p) => 
        p.id === projectId 
          ? { ...p, billOfMaterials, updatedAt: now }
          : p
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? { ...state.selectedProject, billOfMaterials, updatedAt: now }
        : state.selectedProject
    };
  }),

  updateBillOfMaterials: (projectId, updates) => set((state) => {
    return {
      projects: state.projects.map((project) => 
        project.id === projectId && project.billOfMaterials
          ? { 
              ...project, 
              billOfMaterials: { ...project.billOfMaterials, ...updates, updatedAt: new Date() },
              updatedAt: new Date() 
            }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId && state.selectedProject.billOfMaterials
        ? { 
            ...state.selectedProject, 
            billOfMaterials: { ...state.selectedProject.billOfMaterials, ...updates, updatedAt: new Date() },
            updatedAt: new Date() 
          }
        : state.selectedProject
    };
  }),
})); 