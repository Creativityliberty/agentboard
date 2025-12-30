import { NextResponse } from 'next/server';
import { model } from "@/lib/gemini";
import { HarmCategory, HarmBlockThreshold, SchemaType } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are the "Blueprint Forge Architect". 
Your goal is to generate a COMPLETE project scaffold based on a user description, optimized for the BUN stack.

REQUIRED OUTPUT (STRICT JSON):
{
  "projectName": "...",
  "description": "...",
  "stack": ["Bun", "Next.js", "TypeScript", "Tailwind", "Lucide React"],
  "installCommand": "bun install",
  "recommendedDependencies": ["...", "..."],
  "designDoc": "# Design Doc: [Project Name]... (Markdown with Mermaid)",
  "tree": "ascii_tree_representation",
  "files": [
    { "path": "package.json", "content": "..." },
    { "path": "src/app/page.tsx", "content": "..." }
    // ...
  ]
}

DESIGN DOC REQUIREMENTS:
- Section 1: Requirements (User Stories & Constraints).
- Section 2: Flow Design (Mermaid flowchart).
- Section 3: Shared Memory Contract (JSON schema).
- Section 4: Node Breakdown (Prep/Exec/Post logic for each agent node).

BUN STACK RULES:
- Use Bun scripts in package.json (e.g., "dev": "bun --hot next dev").
- Ensure all imports follow the @/ alias convention.
- Provide a clean, premium README.
- The generated code MUST be high-quality, typed, and visually stunning.
- IMPORTANT: Ensure all newlines in code strings are escaped as \\n and quotes as \\". 
- Do NOT truncate the response. Produce the complete JSON structure.
`;

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description) {
      return NextResponse.json({ error: "No description provided" }, { status: 400 });
    }

    const prompt = `
        ${SYSTEM_PROMPT}

        USER PROJECT DESCRIPTION:
        ${description}
        `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
        // @ts-ignore - responseSchema is supported in @google/generative-ai 0.24.1
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            projectName: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
            stack: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            installCommand: { type: SchemaType.STRING },
            recommendedDependencies: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            designDoc: { type: SchemaType.STRING },
            tree: { type: SchemaType.STRING },
            files: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  path: { type: SchemaType.STRING },
                  content: { type: SchemaType.STRING }
                },
                required: ["path", "content"]
              }
            }
          },
          required: ["projectName", "description", "stack", "installCommand", "designDoc", "tree", "files"]
        }
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const response = await result.response;

    if (!response.text()) {
      throw new Error("Gemini returned an empty response. It might have been blocked by safety filters.");
    }

    const text = response.text();
    console.log("--- RAW FORGE RESPONSE ---");
    console.log(text);
    console.log("--------------------------");

    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error("Blueprint Forge Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Project Generation Failed" }, { status: 500 });
  }
}
