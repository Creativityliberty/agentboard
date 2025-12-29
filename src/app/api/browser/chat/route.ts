import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) return `[Failed to fetch ${url}]`;
    const text = await response.text();
    // Simple HTML to text extraction (very basic RAG-lite)
    return text.replace(/<[^>]*>?/gm, ' ').substring(0, 10000); // Limit to 10k chars per URL
  } catch (e) {
    return `[Error fetching ${url}]`;
  }
}

export async function POST(req: Request) {
  try {
    const { query, urls } = await req.json();
    
    // Fetch content from all URLs
    const contents = await Promise.all(urls.map((url: string) => fetchUrlContent(url)));
    const context = contents.join('\n\n---\n\n');

    const prompt = `
      You are a Documentation Assistant. Use the following context retrieved from various URLs to answer the user's question accurately. 
      If the information is not in the context, tell the user, but try to be as helpful as possible based on the provided material.

      CONTEXT:
      ${context}

      USER QUESTION:
      ${query}

      Provide a concise and well-structured answer in Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process chat with context' }, { status: 500 });
  }
}
