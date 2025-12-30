import { NextResponse } from 'next/server';
import { model } from "@/lib/gemini";



async function fetchUrlContent(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) return `[Failed to fetch ${url}]`;
        const text = await response.text();
        // Basic text extraction
        return text.replace(/<[^>]*>?/gm, ' ').substring(0, 8000);
    } catch (e) {
        return `[Error fetching ${url}]`;
    }
}

export async function POST(req: Request) {
    try {
        const { urls, focus } = await req.json();

        if (!urls || urls.length === 0) {
            return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
        }

        const contents = await Promise.all(urls.map((url: string) => fetchUrlContent(url)));
        const context = contents.map((c, i) => `SOURCE ${i + 1} (${urls[i]}):\n${c}`).join('\n\n---\n\n');

        const prompt = `
      You are a Semantic Knowledge Architect. 
      Analyze the following content from multiple documentation sources and create a Semantic Map.

      GOALS:
      1. Identify the core concepts across all sources.
      2. Find how these sources are connected or overlap.
      3. Generate a Mermaid.js diagram (use "mindmap" or "graph TD") representing this knowledge structure.
      4. Provide a 2-sentence summary of the overall knowledge landscape.

      ${focus ? `FOCUS AREA: ${focus}` : ''}

      CONTEXT FROM SOURCES:
      ${context}

      RESPONSE FORMAT:
      Output exactly:
      - A Mermaid diagram in \`\`\`mermaid\`\`\` block.
      - A "SUMMARY:" section.
      - A list of "KEY CONCEPTS:".
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const mermaidMatch = text.match(/```mermaid\n([\s\S]*?)\n```/);
        const summaryMatch = text.match(/SUMMARY:\n([\s\S]*?)(?=\nKEY CONCEPTS:|$)/);
        const conceptsMatch = text.match(/KEY CONCEPTS:\n([\s\S]*?)$/);

        return NextResponse.json({
            mermaidCode: mermaidMatch ? mermaidMatch[1].trim() : "graph TD\n  A[No graph generated]",
            summary: summaryMatch ? summaryMatch[1].trim() : "",
            concepts: conceptsMatch ? conceptsMatch[1].trim().split('\n').map(c => c.replace(/^- /, '')) : []
        });
    } catch (error) {
        console.error("Semantic Map Error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate semantic map" }, { status: 500 });
    }
}
