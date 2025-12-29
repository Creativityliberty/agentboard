import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPT_TEMPLATE, ASCII_TEMPLATE, JSON_TEMPLATE } from '@/lib/vortex-prompt';

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export async function POST(req: Request) {
    try {
        const { promptA, promptB, query } = await req.json();

        if (!query || !promptA || !promptB) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Run parallel calls for A and B
        const [resA, resB] = await Promise.all([
            model.generateContent([
                { text: `SYSTEM: ${promptA} \n\nUSER QUESTION: ${query} ` }
            ]),
            model.generateContent([
                { text: `SYSTEM: ${promptB} \n\nUSER QUESTION: ${query} ` }
            ])
        ]);

        const answerA = resA.response.text();
        const answerB = resB.response.text();

        // The Vortex Judge Analysis
        const judgePrompt = `
      You are the VORTEX SUPREME AUDITOR. 
      Two AI agents(ALPHA and OMEGA) responded to the same query.
      You must evaluate them based on the VORTEX ARCHITECTURE standards.

      VORTEX STANDARDS:
- Self_HL(High - Level Values) & Self_LL(Operational Role) compliance.
      - RRLA Pipeline(Reasoning quality).
      - GoR(Graph of Reason) inclusion.
      - 🛡️ Anti - Hallucination labels([VERIFIED FACT], etc.).
      - Mandatory format: STATE, ACTION_NOW, NEXT_STEP, WHY, KEY_RISK, CERTAINTY.

    QUERY: "${query}"
      
      AGENT ALPHA SYSTEM PROMPT: "${promptA}"
      AGENT ALPHA ANSWER: "${answerA}"

      AGENT OMEGA SYSTEM PROMPT: "${promptB}"
      AGENT OMEGA ANSWER: "${answerB}"

      YOUR TASKS:
1. Rate based on "Vortex Alignment"(0 to 100).
      2. Identify 2 strong points for each(Vortex modules used, consistency, safety).
      3. Decide the winner('A', 'B', or 'Draw').
      4. Suggest a "FUSED VORTEX PROMPT".This MUST be a valid Vortex agent structure using this template:
      ${PROMPT_TEMPLATE}

      RESPONSE FORMAT(STRICT):
WINNER: [A / B / Draw]
      SCORE A: [number]
      SCORE B: [number]
      POSITIVES A: [point 1], [point 2]
      POSITIVES B: [point 1], [point 2]
ANALYSIS: [short critique based on HL / LL alignment]
FUSED: [new system prompt text in Markdown Vortex format]
    `;

        const judgeRes = await model.generateContent(judgePrompt);
        const judgeText = judgeRes.response.text();

        // Parsing Judge response
        const winner = judgeText.match(/WINNER: (A|B|Draw)/)?.[1] || 'Draw';
        const scoreA = parseInt(judgeText.match(/SCORE A: (\d+)/)?.[1] || '0');
        const scoreB = parseInt(judgeText.match(/SCORE B: (\d+)/)?.[1] || '0');
        const posAMatch = judgeText.match(/POSITIVES A: (.*)/)?.[1] || '';
        const posBMatch = judgeText.match(/POSITIVES B: (.*)/)?.[1] || '';
        const analysis = judgeText.match(/ANALYSIS: ([\s\S]*?)(?=FUSED:|$)/)?.[1]?.trim() || '';
        const fused = judgeText.match(/FUSED: ([\s\S]*?)$/)?.[1]?.trim() || '';

        return NextResponse.json({
            participantA: {
                answer: answerA,
                score: scoreA,
                positives: posAMatch.split(',').map(s => s.trim())
            },
            participantB: {
                answer: answerB,
                score: scoreB,
                positives: posBMatch.split(',').map(s => s.trim())
            },
            winner,
            judgeAnalysis: analysis,
            suggestedFusedPrompt: fused
        });

    } catch (error: any) {
        console.error("Battle Error:", error);
        return NextResponse.json({ error: error.message || "Battle failed" }, { status: 500 });
    }
}
