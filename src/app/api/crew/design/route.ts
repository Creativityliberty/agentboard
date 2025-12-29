import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const SYSTEM_PROMPT = `
You are a Multi-Agent Systems Architect (inspired by CrewAI).
Your goal is to design a collaborative "Crew" of agents for a specific objective.

FOR EACH AGENT, DEFINE:
1. Name (ex: Researcher, Writer, Analyst).
2. Role/Goal (Self_LL in Vortex terms).
3. Backstory (Persona and Expertise).

FOR EACH TASK:
1. Description of what needs to be done.
2. Expected Output.
3. Assigned Agent.

ORCHESTRATION:
- Create a Mermaid sequence diagram or flowchart showing how they interact.

RESPONSE FORMAT (STRICT):
Output JSON:
{
  "agents": [{"name": "", "role": "", "goal": "", "backstory": ""}],
  "tasks": [{"agentName": "", "description": "", "expectedOutput": ""}],
  "mermaidFlow": "mermaid code here",
  "explanation": "Expert analysis of the flow"
}
`;

export async function POST(req: Request) {
    try {
        const { objective, complexity } = await req.json();

        if (!objective) {
            return NextResponse.json({ error: "Objective is required" }, { status: 400 });
        }

        const prompt = `
      ${SYSTEM_PROMPT}
      
      OBJECTIVE: ${objective}
      COMPLEXITY LEVEL: ${complexity || 'Complex'}
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean JSON (in case model adds markdown blocks)
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return NextResponse.json(JSON.parse(jsonString));
    } catch (error: any) {
        console.error("Crew Design Error:", error);
        return NextResponse.json({ error: error.message || "Failed to design crew" }, { status: 500 });
    }
}
