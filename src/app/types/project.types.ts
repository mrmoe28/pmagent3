export type StrategyType = 
  | 'agile'
  | 'waterfall'
  | 'lean'
  | 'sixSigma'
  | 'kanban'
  | 'scrum'
  | 'prince2'
  | 'pmi'
  | 'custom';

export interface ProjectInput {
  title: string;
  description: string;
  outcome: string;
  selectedStrategy: StrategyType;
  planSetFiles?: File[];
}

export interface ResearchResult {
  query: string;
  content: string;
  sources: Array<{
    title: string;
    url: string;
  }>;
}

export interface StrategyOption {
  id: StrategyType;
  name: string;
  description: string;
  bestFor: string[];
  notRecommendedFor: string[];
}

export interface EquipmentItem {
  id: string;
  name: string;
  manufacturer: string;
  model?: string;
  quantity: number;
  specifications?: Record<string, string>;
  installationUrl?: string;
}

export interface BillOfMaterials {
  id: string;
  items: EquipmentItem[];
  totalCost?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectPlan {
  title: string;
  description: string;
  strategy: StrategyType;
  overview: string;
  objectives: string[];
  keyMilestones: Array<{
    title: string;
    description: string;
    estimatedDuration: string;
  }>;
  resources: string[];
  risks: Array<{
    description: string;
    mitigation: string;
    impact: 'low' | 'medium' | 'high';
    probability: 'low' | 'medium' | 'high';
  }>;
  standardOperatingProcedures: Array<{
    title: string;
    steps: string[];
  }>;
  recommendations: string[];
  equipment?: EquipmentItem[];
  billOfMaterials?: BillOfMaterials;
}

export interface ProjectAttachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'other';
  size: number;
  createdAt: Date;
  analyzed?: boolean;
  extractedEquipment?: EquipmentItem[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  desiredOutcome: string;
  strategy: StrategyType;
  createdAt: Date;
  updatedAt: Date;
  plan?: ProjectPlan;
  attachments: ProjectAttachment[];
  equipment?: EquipmentItem[];
  billOfMaterials?: BillOfMaterials;
} 