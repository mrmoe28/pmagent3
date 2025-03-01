import { z } from "zod";

export const strategyTypeSchema = z.enum([
  'agile',
  'waterfall',
  'lean',
  'sixSigma',
  'kanban',
  'scrum',
  'prince2',
  'pmi',
  'custom'
]);

export const projectInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  outcome: z.string().min(10, "Outcome must be at least 10 characters").max(1000),
  selectedStrategy: strategyTypeSchema
});

export const researchResultSchema = z.object({
  query: z.string(),
  content: z.string(),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string().url()
    })
  )
});

export const projectPlanSchema = z.object({
  title: z.string(),
  description: z.string(),
  strategy: strategyTypeSchema,
  overview: z.string(),
  objectives: z.array(z.string()),
  keyMilestones: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      estimatedDuration: z.string()
    })
  ),
  resources: z.array(z.string()),
  risks: z.array(
    z.object({
      description: z.string(),
      mitigation: z.string(),
      impact: z.enum(['low', 'medium', 'high']),
      probability: z.enum(['low', 'medium', 'high'])
    })
  ),
  standardOperatingProcedures: z.array(
    z.object({
      title: z.string(),
      steps: z.array(z.string())
    })
  ),
  recommendations: z.array(z.string())
}); 