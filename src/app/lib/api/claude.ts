"use server";

import Anthropic from "@anthropic-ai/sdk";
import { ProjectInput, ProjectPlan, ResearchResult } from "@/app/types/project.types";

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

export async function generateProjectPlan(
  projectInput: ProjectInput,
  researchResult: ResearchResult
): Promise<ProjectPlan> {
  if (!CLAUDE_API_KEY) {
    throw new Error("Claude API key is not configured");
  }

  try {
    const anthropic = new Anthropic({
      apiKey: CLAUDE_API_KEY,
    });

    const prompt = `
    You are an expert project manager and strategic planner. Your task is to create a detailed project plan based on the following input and research.
    
    PROJECT INFORMATION:
    Title: ${projectInput.title}
    Description: ${projectInput.description}
    Desired Outcome: ${projectInput.outcome}
    Selected Strategy: ${projectInput.selectedStrategy}
    
    RESEARCH INFORMATION:
    ${researchResult.content}
    
    Based on this information, create a comprehensive project plan that includes:
    1. A clear overview of the project
    2. Specific objectives
    3. Key milestones with estimated durations
    4. Required resources
    5. Potential risks and mitigation strategies
    6. Standard operating procedures with step-by-step instructions
    7. Recommendations for successful implementation
    
    Format the response as a structured JSON object matching the ProjectPlan type with the following fields:
    - title: string
    - description: string
    - strategy: string (one of: 'agile', 'waterfall', 'lean', 'sixSigma', 'kanban', 'scrum', 'prince2', 'pmi', 'custom')
    - overview: string
    - objectives: string[]
    - keyMilestones: Array of {title: string, description: string, estimatedDuration: string}
    - resources: string[]
    - risks: Array of {description: string, mitigation: string, impact: 'low' | 'medium' | 'high', probability: 'low' | 'medium' | 'high'}
    - standardOperatingProcedures: Array of {title: string, steps: string[]}
    - recommendations: string[]
    
    Ensure the plan is practical, actionable, and tailored to the specific project and strategy.
    `;

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract and parse the JSON response
    const content = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';
      
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/{[\s\S]*?}/);
                      
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Claude response");
    }
    
    const jsonString = jsonMatch[0].startsWith('{') ? jsonMatch[0] : jsonMatch[1];
    const projectPlan = JSON.parse(jsonString) as ProjectPlan;
    
    return projectPlan;
  } catch (error) {
    console.error("Error generating project plan with Claude:", error);
    
    // For development purposes, return mock data if API fails
    return {
      title: projectInput.title,
      description: projectInput.description,
      strategy: projectInput.selectedStrategy,
      overview: "This is a placeholder for the project overview. In production, this would be generated by Claude API.",
      objectives: [
        "Objective 1: Complete project planning",
        "Objective 2: Implement core features",
        "Objective 3: Test and validate",
      ],
      keyMilestones: [
        {
          title: "Project Kickoff",
          description: "Initial meeting to align on project goals and approach",
          estimatedDuration: "1 week",
        },
        {
          title: "MVP Development",
          description: "Development of minimum viable product",
          estimatedDuration: "4 weeks",
        },
      ],
      resources: [
        "Project Manager",
        "Development Team",
        "QA Engineer",
      ],
      risks: [
        {
          description: "Scope creep",
          mitigation: "Regular scope reviews and change management process",
          impact: "high",
          probability: "medium",
        },
      ],
      standardOperatingProcedures: [
        {
          title: "Daily Stand-up",
          steps: [
            "Team meets for 15 minutes each morning",
            "Each member shares progress, plans, and blockers",
            "Project manager notes any issues requiring follow-up",
          ],
        },
      ],
      recommendations: [
        "Implement regular stakeholder reviews",
        "Maintain detailed documentation",
      ],
    };
  }
} 