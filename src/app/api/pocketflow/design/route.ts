import { NextResponse } from 'next/server';
import { model } from "@/lib/gemini";

const SYSTEM_PROMPT = `
You are the "PocketFlow Architect". 
Your goal is to generate a comprehensive **Architecture Design Document** for an AI Agent based on the user's description.

CRITICAL OUTPUT FORMAT:
The output must be a Markdown document following this exact structure:

# Design Doc: [Agent Name]

## 1. Requirements
[Concrete user stories and constraints]

## 2. Flow Design
[Concise description of the workflow]

\`\`\`mermaid
flowchart TD
   %% ... valid mermaid flowchart ...
\`\`\`

## 3. Shared Memory Contract
[Define the structure of the shared memory for this specific agent]
\`\`\`json
{
  "context": { ... },
  "state": { ... },
  "steps": { ... },
  "artifacts": { ... }
}
\`\`\`

## 4. Node Breakdown
[List of Nodes required]
- **Node 1 Name** (Type: Regular/Batch/Loop)
  - **Prep**: [What it reads from shared]
  - **Exec**: [What actions it performs]
  - **Post**: [What it writes to shared]

RULES:
- Use the "PocketFlow" patterns: Shared Memory, distinct Nodes, loop-free interactions where possible.
- The Mermaid diagram must be valid and use correct direction (TD or LR).
- Be professional, technical, and precise.
`;

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description) {
      return NextResponse.json({ error: "No description provided" }, { status: 400 });
    }

    const prompt = `
        ${SYSTEM_PROMPT}

        USER AGENT DESCRIPTION:
        ${description}
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ markdown: text });

  } catch (error) {
    console.error("PocketFlow Design Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Generation failed" }, { status: 500 });
  }
}
