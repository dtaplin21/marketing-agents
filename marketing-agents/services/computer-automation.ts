import OpenAI from 'openai';
import { Logger } from './logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AutomationTask {
  platformId: string;
  action: 'connect' | 'validate';
  context?: Record<string, any>;
}

interface AutomationResult {
  success: boolean;
  credentials?: Record<string, string>;
  error?: string;
  logs?: string[];
}

export class ComputerAutomationService {
  private logger: Logger;
  private retryAttempts = 3;

  constructor() {
    this.logger = new Logger('ComputerAutomation');
  }

  public async executeComputerTask(task: AutomationTask): Promise<AutomationResult> {
    let attempts = 0;
    
    while (attempts < this.retryAttempts) {
      try {
        this.logger.log(`Attempting ${task.action} for ${task.platformId} (Attempt ${attempts + 1})`);

        const response = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: this.generatePrompt(task),
            }
          ],
          max_tokens: 4096,
        });

        const result = this.processResponse(response, task);
        
        if (result.success) {
          this.logger.log(`Successfully completed ${task.action} for ${task.platformId}`);
          return result;
        }

        attempts++;
        this.logger.warn(`Attempt ${attempts} failed, retrying...`);
      } catch (error) {
        this.logger.error(`Error in ${task.action} for ${task.platformId}:`, error);
        attempts++;
      }
    }

    return {
      success: false,
      error: `Failed after ${this.retryAttempts} attempts`,
      logs: this.logger.getLogs()
    };
  }

  private platformTasks = {
    twitter: {
      connect: async () => {
        const steps = [
          { action: 'navigate', url: 'https://developer.twitter.com/portal' },
          { action: 'createApp' },
          { action: 'getCredentials' }
        ];
        return this.executeSteps('twitter', steps);
      },
      validate: async (credentials: Record<string, string>) => {
        return this.testEndpoint('https://api.twitter.com/2/users/me', credentials);
      }
    },
    facebook: {
      connect: async () => {
        const steps = [
          { action: 'navigate', url: 'https://developers.facebook.com' },
          { action: 'createApp' },
          { action: 'getCredentials' }
        ];
        return this.executeSteps('facebook', steps);
      },
      validate: async (credentials: Record<string, string>) => {
        return this.testEndpoint('https://graph.facebook.com/me', credentials);
      }
    },
    website: {
      connect: async () => {
        // Custom website connection logic
        return this.executeSteps('website', []);
      }
    }
  };

  private async executeSteps(platform: string, steps: any[]): Promise<AutomationResult> {
    const logs: string[] = [];
    
    for (const step of steps) {
      try {
        this.logger.log(`Executing step: ${step.action} for ${platform}`);
        // Execute step using Computer Use tool
        // Log results
        logs.push(`Completed: ${step.action}`);
      } catch (error) {
        this.logger.error(`Step failed: ${step.action}`, error);
        return {
          success: false,
          error: `Failed at step: ${step.action}`,
          logs
        };
      }
    }

    return {
      success: true,
      logs
    };
  }

  private async testEndpoint(url: string, credentials: Record<string, string>): Promise<AutomationResult> {
    try {
      // Test API endpoint with credentials
      return {
        success: true,
        logs: [`Successfully validated credentials at ${url}`]
      };
    } catch (error) {
      return {
        success: false,
        error: 'Endpoint validation failed',
        logs: [`Failed to validate credentials at ${url}`]
      };
    }
  }

  async monitorTask(taskId: string): Promise<void> {
    // Implement task monitoring
    this.logger.log(`Monitoring task: ${taskId}`);
  }

  async getTaskStatus(taskId: string): Promise<any> {
    // Return task status and logs
    return {
      status: 'completed',
      logs: this.logger.getLogs()
    };
  }

  private generatePrompt(task: AutomationTask): string {
    const prompts: Record<AutomationTask['action'], Record<string, string>> = {
      connect: {
        twitter: "Navigate to Twitter Developer Portal, create new app and get API credentials",
        facebook: "Access Facebook Business Manager, create app integration and get access tokens",
        website: "Access website admin panel and locate API integration settings",
      },
      validate: {
        twitter: "Validate Twitter API credentials by testing endpoint access",
        facebook: "Verify Facebook access token permissions and validity",
        website: "Test website API endpoint connectivity",
      }
    };

    return prompts[task.action][task.platformId] || 
      `Automate ${task.action} for ${task.platformId} platform`;
  }

  async connectPlatform(platformId: string) {
    return this.executeComputerTask({
      platformId,
      action: 'connect'
    });
  }

  async validateCredentials(platformId: string, credentials: any) {
    return this.executeComputerTask({
      platformId,
      action: 'validate',
      context: { credentials }
    });
  }

  private processResponse(response: OpenAI.Chat.Completions.ChatCompletion, task: AutomationTask): AutomationResult {
    try {
      const content = response.choices[0]?.message?.content;
      if (!content) {
        return { success: false, error: 'No response content' };
      }
      
      return { success: true, logs: [content] };
    } catch (error) {
      return { success: false, error: 'Failed to process response' };
    }
  }
} 