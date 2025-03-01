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
} 