import { NextResponse } from 'next/server';
import { ComputerAutomationService } from '../../../services/computer-automation';

const automationService = new ComputerAutomationService();

export async function POST(request: Request) {
  try {
    const { platformId, action, context } = await request.json();

    let result;
    switch (action) {
      case 'connect':
        result = await automationService.connectPlatform(platformId);
        break;
      case 'validate':
        result = await automationService.validateCredentials(platformId, context.credentials);
        break;
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Platform automation error:', error);
    return NextResponse.json({ error: 'Automation failed' }, { status: 500 });
  }
} 