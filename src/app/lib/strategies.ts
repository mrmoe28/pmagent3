import { StrategyOption } from "../types/project.types";

export const strategies: StrategyOption[] = [
  {
    id: "agile",
    name: "Agile",
    description: "An iterative approach that delivers value through small, incremental changes and adapts to evolving requirements.",
    bestFor: [
      "Projects with evolving requirements",
      "Software development",
      "Projects requiring frequent stakeholder feedback",
      "Teams that need flexibility",
    ],
    notRecommendedFor: [
      "Projects with fixed requirements and deadlines",
      "Large teams with complex coordination needs",
      "Projects requiring extensive documentation upfront",
    ],
  },
  {
    id: "waterfall",
    name: "Waterfall",
    description: "A linear, sequential approach where each phase must be completed before the next begins.",
    bestFor: [
      "Projects with well-defined requirements",
      "Projects with fixed scope and timeline",
      "Regulatory or compliance-heavy projects",
      "Projects requiring extensive documentation",
    ],
    notRecommendedFor: [
      "Projects with changing requirements",
      "Projects needing quick delivery",
      "Innovative or exploratory projects",
    ],
  },
  {
    id: "lean",
    name: "Lean",
    description: "Focuses on maximizing value while minimizing waste through continuous improvement.",
    bestFor: [
      "Manufacturing processes",
      "Process improvement initiatives",
      "Projects with resource constraints",
      "Organizations seeking efficiency",
    ],
    notRecommendedFor: [
      "Projects requiring extensive planning upfront",
      "Projects with high regulatory requirements",
      "Projects where quality is prioritized over efficiency",
    ],
  },
  {
    id: "sixSigma",
    name: "Six Sigma",
    description: "A data-driven methodology focused on eliminating defects and reducing variation in processes.",
    bestFor: [
      "Quality improvement initiatives",
      "Manufacturing processes",
      "Process standardization",
      "Organizations with established data collection",
    ],
    notRecommendedFor: [
      "Creative or innovative projects",
      "Projects with limited data available",
      "Small-scale projects",
    ],
  },
  {
    id: "kanban",
    name: "Kanban",
    description: "A visual workflow management method that helps teams visualize work, limit work-in-progress, and maximize efficiency.",
    bestFor: [
      "Support and maintenance work",
      "Teams with varying priorities",
      "Projects requiring continuous delivery",
      "Teams transitioning from traditional to agile methods",
    ],
    notRecommendedFor: [
      "Projects with fixed deadlines and deliverables",
      "Complex projects requiring detailed planning",
      "Projects with many dependencies",
    ],
  },
  {
    id: "scrum",
    name: "Scrum",
    description: "An agile framework that emphasizes teamwork, accountability, and iterative progress toward well-defined goals.",
    bestFor: [
      "Software development",
      "Product development",
      "Teams with dedicated resources",
      "Projects requiring regular stakeholder feedback",
    ],
    notRecommendedFor: [
      "Projects with frequently changing team members",
      "Projects requiring extensive documentation",
      "Teams unable to commit to regular meetings",
    ],
  },
  {
    id: "prince2",
    name: "PRINCE2",
    description: "A structured project management method focusing on organization, management, and control.",
    bestFor: [
      "Large-scale projects",
      "Government and public sector projects",
      "Projects requiring strict governance",
      "Multi-stakeholder projects",
    ],
    notRecommendedFor: [
      "Small projects with simple requirements",
      "Projects needing agility and quick adaptation",
      "Teams with limited project management experience",
    ],
  },
  {
    id: "pmi",
    name: "PMI/PMBOK",
    description: "A comprehensive set of best practices, standards, and guidelines for project management.",
    bestFor: [
      "Complex, large-scale projects",
      "Projects requiring standardized processes",
      "Organizations with mature project management practices",
      "Projects with significant risk management needs",
    ],
    notRecommendedFor: [
      "Small, simple projects",
      "Projects with tight timelines",
      "Teams new to formal project management",
    ],
  },
  {
    id: "custom",
    name: "Custom Approach",
    description: "A tailored approach combining elements from different methodologies to meet specific project needs.",
    bestFor: [
      "Unique or innovative projects",
      "Organizations with specific requirements",
      "Teams with experienced project managers",
      "Projects that don't fit traditional methodologies",
    ],
    notRecommendedFor: [
      "Teams lacking project management experience",
      "Projects requiring standardized processes",
      "Organizations with strict methodology requirements",
    ],
  },
];

export function getStrategyById(id: string): StrategyOption | undefined {
  return strategies.find(strategy => strategy.id === id);
}

export function getRecommendedStrategies(projectDescription: string): StrategyOption[] {
  // This is a simple implementation that could be enhanced with AI
  // For now, we'll just return a few strategies based on keywords
  
  const keywords = {
    agile: ["software", "flexible", "iterative", "adapt", "evolving"],
    waterfall: ["sequential", "regulated", "compliance", "documentation", "fixed"],
    lean: ["efficiency", "waste", "streamline", "optimize", "continuous improvement"],
    sixSigma: ["quality", "defect", "variation", "data", "measure"],
    kanban: ["workflow", "visualize", "continuous", "flow", "support"],
    scrum: ["sprint", "product owner", "backlog", "team", "incremental"],
    prince2: ["governance", "stage", "board", "business case", "government"],
    pmi: ["standard", "knowledge area", "process group", "portfolio", "program"],
  };
  
  const projectDescLower = projectDescription.toLowerCase();
  
  // Calculate a simple score for each strategy based on keyword matches
  const scores = strategies.map(strategy => {
    if (strategy.id === "custom") return { strategy, score: 0 }; // Custom is a fallback
    
    const relevantKeywords = keywords[strategy.id as keyof typeof keywords] || [];
    const score = relevantKeywords.reduce((total, keyword) => {
      return total + (projectDescLower.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
    
    return { strategy, score };
  });
  
  // Sort by score (descending) and take top 3
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.strategy);
} 