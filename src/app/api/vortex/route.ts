import { NextResponse } from 'next/server';
import { SchemaType } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPT_TEMPLATE, ASCII_TEMPLATE, JSON_TEMPLATE } from '@/lib/vortex-prompt';

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// On utilise le modèle qui a été vérifié comme fonctionnel
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        markdown: { type: SchemaType.STRING },
        ascii: { type: SchemaType.STRING },
        json: { type: SchemaType.STRING },
      },
      required: ["markdown", "ascii", "json"],
    },
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    
    const userPrompt = `
      Based on the user's specifications below, generate a complete Vortex agent.
      Fill in the placeholders in the provided templates. Be creative and infer logical details where needed to make the prompt robust and coherent.
      For example, for Self_HL, derive 3 core values from the user's specified risk level and red lines. For Self_LL, synthesize the persona and expertise into a clear role.

      USER SPECIFICATIONS:
      - Agent Name: ${formData.agentName}
      - Main Objective: ${formData.objective}
      - Usage Context: ${formData.context}
      - Desired Persona: ${formData.persona}
      - Core Expertise: ${formData.expertise}
      - Critical Capabilities: ${formData.capabilities}
      - Expected Output: ${formData.outputFormat}
      - Red Lines: ${formData.redLines}
      - Risk Tolerance: ${formData.riskLevel}

      TEMPLATES TO FILL:
      
      Markdown Template:
      ${PROMPT_TEMPLATE}

      ASCII Template:
      ${ASCII_TEMPLATE}

      JSON Template:
      ${JSON_TEMPLATE}
    `;

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 });
  }
}
