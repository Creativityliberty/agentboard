import { NextResponse } from 'next/server';
import { model } from "@/lib/gemini";

const SYSTEM_PROMPT = `
You are a Senior System Architect and Expert in Software Visualization.
Your goal is to analyze a raw repository dump (text content of multiple files) and produce a "Hyper-Detailed" Mermaid.js Architecture Diagram.

CRITICAL RULES:
1. **Ignore Implementation Details**: Do not chart every single function. Focus on Modules, Classes, Data Models, Services, and their relationships.
2. **Hyper-Detailed**: The diagram must be comprehensive. Users want to see the "Big Picture" and the "Deep Dive" at the same time. Use subgraphs to organize components.
3. **Valid Mermaid**: Output ONLY valid Mermaid.js code. 
   - Use 'graph TD' (or 'flowchart TD') for general architecture.
   - Use 'classDiagram' if the code is highly object-oriented and data-model heavy.
   - Use 'erDiagram' if it's database schema focused.
   - PREFER 'graph TD' with nested 'subgraph' blocks for most general repo dumps.
4. **Style**: Use vibrant styling instructions (style A fill:#...,stroke:#...) to make it look professional and readable. Group related nodes in subgraphs.

INPUT:
A raw text dump of a codebase.

OUTPUT:
JSON format:
{
  "mermaidCode": "graph TD ...",
  "summary": "A high-level summary of the architecture...",
  "modules": ["Module A", "Module B"]
}
`;

export async function POST(req: Request) {
    try {
        const { repoContent } = await req.json();

        if (!repoContent) {
            return NextResponse.json({ error: "No repo content provided" }, { status: 400 });
        }

        // Truncate if too massive (Gemini 1.5 Pro has 1M context, so we have room, but let's be safe for latency)
        // A simple char limit for now, e.g. 500k chars
        const truncatedContent = repoContent.substring(0, 500000);

        const prompt = `
        ${SYSTEM_PROMPT}

        REPO DUMP:
        ${truncatedContent}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON
        let jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        // Sometimes models wrap json in other markdown, simple heuristic cleanup
        const firstBrace = jsonString.indexOf('{');
        const lastBrace = jsonString.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonString = jsonString.substring(firstBrace, lastBrace + 1);
        }

        return NextResponse.json(JSON.parse(jsonString));

    } catch (error) {
        console.error("Explorer Analysis Error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Analysis failed" }, { status: 500 });
    }
}
