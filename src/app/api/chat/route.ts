import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
