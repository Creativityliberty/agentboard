import { NextResponse } from 'next/server';
import { model } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { field, context } = await req.json();

    const prompt = `
      As an expert in AI Agent Architecture and the Vortex Intelligence Architecture, 
      provide a short, creative, and professional suggestion for the following field: "${field}".
      
      CONTEXT (Current form values):
      ${JSON.stringify(context, null, 2)}
      
      Requirements:
      - Return ONLY the suggested text for that field.
      - Keep it concise (1-2 sentences max).
      - Make it highly relevant to the other fields already filled.
      - If most fields are empty, provide a generic but high-quality example.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Remove any quotes Gemini might add
    const cleanText = text.replace(/^"|"$/g, '');

    return NextResponse.json({ suggestion: cleanText });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 });
  }
}
