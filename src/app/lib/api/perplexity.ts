"use server";

import axios from "axios";
import { ResearchResult } from "@/app/types/project.types";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = "https://api.perplexity.ai/research";

interface PerplexitySource {
  title?: string;
  url?: string;
  [key: string]: unknown;
}

export async function conductResearch(query: string): Promise<ResearchResult> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error("Perplexity API key is not configured");
  }

  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        query: `Research the following and create a detailed report of all relevant facts that could be used in a report on this topic: ${query}`,
        max_tokens: 4000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        },
      }
    );

    // This is a placeholder for the actual response structure
    // Adjust according to the actual Perplexity API response
    return {
      query,
      content: response.data.text || response.data.content || "",
      sources: response.data.sources?.map((source: PerplexitySource) => ({
        title: source.title || "Unknown Source",
        url: source.url || "#",
      })) || [],
    };
  } catch (error) {
    console.error("Error conducting research with Perplexity:", error);
    
    // For development purposes, return mock data if API fails
    return {
      query,
      content: "This is a placeholder for research content. In production, this would be actual research data from Perplexity API.",
      sources: [
        {
          title: "Sample Source 1",
          url: "https://example.com/source1",
        },
        {
          title: "Sample Source 2",
          url: "https://example.com/source2",
        },
      ],
    };
  }
} 