import { NextResponse } from 'next/server';
import { model } from "@/lib/gemini";

const SYSTEM_INSTRUCTION = `
You are an expert Software Architect and Mermaid.js specialist.
Your goal is to help the user build, debug, and optimize diagrams.

RULES:
1. Always respond with helpful architectural advice.
2. If you suggest a diagram change, PROVIDE THE FULL MERMAID CODE inside a triple backtick block tagged with "mermaid".
3. Keep the Mermaid code clean and valid.
4. If there's an error in the current code, explain why and fix it.
5. In sequenceDiagrams: 
   - Use "break" ONLY as a block (e.g., "break [cond] ... end"). NEVER use it as a single-line command.
   - Always enclose messages with parentheses or special characters in double quotes (e.g., A -> B: "Message (text)").
   - Ensure "alt", "loop", and "opt" blocks are properly closed with "end".
`;

export async function POST(req: Request) {
    try {
        const { messages, currentCode, prompt } = await req.json();

        const history = messages.map((m: { role: string; text: string }) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
                { role: 'model', parts: [{ text: "Understood. I'm ready to help you architect your diagrams." }] },
                ...history
            ]
        });

        const fullPrompt = `
      CURRENT MERMAID CODE:
      \`\`\`mermaid
      ${currentCode}
      \`\`\`

      USER REQUEST:
      ${prompt}
    `;

        const result = await chat.sendMessage(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Extract mermaid code block if present
        const mermaidMatch = text.match(/```mermaid\n([\s\S]*?)\n```/);
        const codeBlock = mermaidMatch ? mermaidMatch[1].trim() : undefined;

        return NextResponse.json({ text, codeBlock });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate diagram advice' }, { status: 500 });
    }
}
