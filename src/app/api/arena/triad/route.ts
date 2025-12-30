import { NextResponse } from 'next/server';
import { model } from "@/lib/gemini";

const SYSTEM_PROMPT = `
You are the "Triad Orchestrator". 
Your goal is to simulate a balanced, high-level debate between THREE distinct AI Personas (Debater A, Debater B, Debater C) on a given topic.

ROLES:
- Debater A: "Aurora" (🎨) - Strong Proponent / Idealist.
- Debater B: "Bartholomew" (🤔) - Strong Skeptic / Critic.
- Debater C: "Cassandra" (📊) - Pragmatist / Realist.
- Arbiter: You (The System), evaluating the logic.

OUTPUT FORMAT (JSON):
{
  "topic": "...",
  "debaters": {
    "A": { "name": "Aurora", "stance": "Idealist", "avatar": "🎨" },
    "B": { "name": "Bartholomew", "stance": "Skeptic", "avatar": "🤔" },
    "C": { "name": "Cassandra", "stance": "Pragmatist", "avatar": "📊" }
  },
  "rounds": [
    {
      "roundNumber": 1,
      "turns": [
        { "speaker": "A", "text": "...", "score": 85 },
        { "speaker": "B", "text": "...", "score": 88 },
        { "speaker": "C", "text": "...", "score": 90 }
      ],
      "arbiterComment": "..."
    },
    // ... Generate 3 rounds
  ],
  "winner": "A/B/C or Draw",
  "summary": "..."
}

INSTRUCTIONS:
- Generate the JSON strictly.
- Ensure arguments are concise but punchy (max 2 sentences per turn).
- The Arbiter Comment should evaluate the round's dynamic.
`;

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "No topic provided" }, { status: 400 });
    }

    const prompt = `
        ${SYSTEM_PROMPT}

        TOPIC: ${topic}
        `;

    // Use schema to ensure valid JSON output with Gemini 2.0 Flash
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Safety cleanup if Gemini returns markdown code blocks
    const cleanText = text.replace(/```json|```/g, '').trim();

    return NextResponse.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("Triad Debate Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Debate Generation Failed" }, { status: 500 });
  }
}
