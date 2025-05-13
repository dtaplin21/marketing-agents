import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { platformId, currentStep, config } = await request.json();

    const prompt = `
      Help user connect their ${platformId} platform.
      Current step: ${currentStep}
      Current configuration: ${JSON.stringify(config)}
      
      Provide:
      1. Next steps for configuration
      2. Tips for finding required information
      3. Security best practices
      4. Validation suggestions
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const suggestions = completion.choices[0].message?.content?.split('\n').filter(Boolean) || [];

    return NextResponse.json({ 
      suggestions,
      nextStep: currentStep + 1
    });
  } catch (error) {
    console.error('AI assistance error:', error);
    return NextResponse.json({ error: 'Failed to get AI assistance' }, { status: 500 });
  }
} 