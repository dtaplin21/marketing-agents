import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Path to your Python agent
    const agentPath = path.join(process.cwd(), 'agents', 'order_aggregation_agent.py');

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [agentPath, query]);
      
      let result = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(NextResponse.json({ error: error || 'Process failed' }, { status: 500 }));
          return;
        }

        try {
          const parsedResult = JSON.parse(result);
          resolve(NextResponse.json(parsedResult));
        } catch (e) {
          reject(NextResponse.json({ error: 'Failed to parse result' }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 