import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { encrypt } from '../../../utils/encryption';
import { platformValidation } from '../../../utils/validation';
import prisma from '@/lib/prisma';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Add this to your .env file
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Example marketing task using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo" for a more cost-effective option
      messages: [
        {
          role: "system",
          content: "You are a marketing expert assistant."
        },
        {
          role: "user",
          content: `Generate marketing content for: ${data.prompt}`
        }
      ]
    });

    return NextResponse.json({ 
      content: completion.choices[0].message.content 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function POST_platform_config(request: Request) {
  try {
    const { platformId, config } = await request.json();

    // Validate the configuration
    const validationRules = platformValidation[platformId as keyof typeof platformValidation];
    if (!validationRules) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    // Check all validation rules
    for (const [field, validator] of Object.entries(validationRules)) {
      if (!validator(config[field])) {
        return NextResponse.json({ 
          error: `Invalid ${field} for ${platformId}` 
        }, { status: 400 });
      }
    }

    // Encrypt sensitive data
    const encryptedConfig = Object.entries(config).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: encrypt(value as string)
    }), {});

    // Store in database
    await prisma.platformConfig.upsert({
      where: {
        platformId_userId: {
          platformId,
          userId: 'current-user-id' // Replace with actual user ID
        }
      },
      update: {
        config: encryptedConfig
      },
      create: {
        platformId,
        userId: 'current-user-id', // Replace with actual user ID
        config: encryptedConfig
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to store platform configuration:', error);
    return NextResponse.json({ 
      error: 'Failed to store platform configuration' 
    }, { status: 500 });
  }
} 