import { NextResponse } from 'next/server';
import { model } from "@/lib/gemini";

const SYSTEM_PROMPT = `
You are an expert Frontend Architect and System Designer.
The user will provide an image (screenshot, sketch, or design).

YOUR TASKS:
1. Analyze the structure and layout.
2. Generate a Mermaid.js diagram representing the architecture or component hierarchy.
3. Generate a React/Tailwind code snippet for a premium-looking skeleton that mimics the layout.
4. Provide a brief architectural explanation.

RESPONSE FORMAT:
Your response must be a valid JSON-like structure (or just markdown with specific blocks):
- Mermaid code in \`\`\`mermaid\`\`\` block.
- React code in \`\`\`tsx\`\`\` block.
- Explanation in plain text.
`;

export async function POST(req: Request) {
    try {
        const { image, prompt } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Extract base64 data
        const base64Data = image.split(',')[1] || image;

        const result = await model.generateContent([
            SYSTEM_PROMPT,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/png" // Assuming PNG/JPEG, Gemini handles most
                }
            },
            prompt || "Analyze this image and provide the architecture and UI skeleton."
        ]);

        const response = await result.response;
        const text = response.text();

        // Parse blocks
        const mermaidMatch = text.match(/```mermaid\n([\s\S]*?)\n```/);
        const tsxMatch = text.match(/```tsx\n([\s\S]*?)\n```/);

        // Remove code blocks from explanation text
        const explanation = text
            .replace(/```mermaid[\s\S]*?```/g, '')
            .replace(/```tsx[\s\S]*?```/g, '')
            .trim();

        return NextResponse.json({
            mermaidCode: mermaidMatch ? mermaidMatch[1].trim() : undefined,
            uiCode: tsxMatch ? tsxMatch[1].trim() : undefined,
            explanation
        });
    } catch (error) {
        console.error("Blueprint Error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Analysis failed" }, { status: 500 });
    }
}
