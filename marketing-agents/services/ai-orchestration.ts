import { Logger } from './logger';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface AITask {
  type: 'analyze' | 'generate' | 'monitor' | 'recover';
  input: any;
  context?: Record<string, any>;
}

interface AIResult {
  success: boolean;
  data?: any;
  error?: string;
  recommendations?: string[];
}

export class AIOrchestrator {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('AIOrchestrator');
  }

  async processTask(task: AITask): Promise<AIResult> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(task.type)
          },
          {
            role: "user",
            content: JSON.stringify(task.input)
          }
        ]
      });

      return {
        success: true,
        data: response.choices[0].message.content || '',
        recommendations: this.parseRecommendations(response.choices[0].message.content || '')
      };
    } catch (error) {
      this.logger.error(`AI task failed: ${task.type}`, error);
      return {
        success: false,
        error: 'AI processing failed',
        recommendations: ['Manual intervention required']
      };
    }
  }

  private getSystemPrompt(taskType: 'analyze' | 'generate' | 'monitor' | 'recover'): string {
    const prompts = {
      analyze: "You are an expert data analyst. Analyze the provided data and provide insights.",
      generate: "You are a code generation expert. Generate optimal code for the given specifications.",
      monitor: "You are a system monitoring expert. Analyze metrics and provide recommendations.",
      recover: "You are an error recovery specialist. Analyze errors and provide recovery steps."
    };
    return prompts[taskType] || "You are an AI assistant. Help with the given task.";
  }

  private parseRecommendations(content: string): string[] {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
    } catch {
      return content.split('\n').filter(line => line.trim().length > 0);
    }
  }

  // Platform-specific tasks
  private platformTasks = {
    twitter: {
      analyze: async (data: any) => {
        return this.processTask({
          type: 'analyze',
          input: {
            platform: 'twitter',
            data,
            metrics: ['engagement', 'reach', 'sentiment']
          }
        });
      },
      optimize: async (data: any) => {
        return this.processTask({
          type: 'generate',
          input: {
            platform: 'twitter',
            data,
            goal: 'engagement_optimization'
          }
        });
      },
      recover: async (error: any) => {
        return this.processTask({
          type: 'recover',
          input: {
            platform: 'twitter',
            error,
            context: 'api_connection'
          }
        });
      }
    },
    facebook: {
      analyze: async (data: any) => {
        return this.processTask({
          type: 'analyze',
          input: {
            platform: 'facebook',
            data,
            metrics: ['audience_insights', 'ad_performance']
          }
        });
      },
      optimize: async (data: any) => {
        return this.processTask({
          type: 'generate',
          input: {
            platform: 'facebook',
            data,
            goal: 'ad_optimization'
          }
        });
      },
      recover: async (error: any) => {
        return this.processTask({
          type: 'recover',
          input: {
            platform: 'facebook',
            error,
            context: 'api_authentication'
          }
        });
      }
    }
  };

  // AI-powered monitoring
  async monitorPlatform(platform: string, metrics: string[]): Promise<AIResult> {
    try {
      const monitoringResult = await this.processTask({
        type: 'monitor',
        input: {
          platform,
          metrics,
          interval: '5m'
        }
      });

      return {
        success: true,
        data: monitoringResult,
        recommendations: this.generateRecommendations(monitoringResult)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Monitoring failed',
        recommendations: await this.getErrorRecoverySteps(error)
      };
    }
  }

  // AI-driven error recovery
  async recoverFromError(error: any, context: any): Promise<AIResult> {
    try {
      const recoverySteps = await this.processTask({
        type: 'recover',
        input: { error, context }
      });

      return {
        success: true,
        data: recoverySteps,
        recommendations: this.generateRecoveryRecommendations(recoverySteps)
      };
    } catch (recoveryError) {
      return {
        success: false,
        error: 'Recovery failed',
        recommendations: ['Manual intervention required']
      };
    }
  }

  // Generate optimization recommendations
  private generateRecommendations(data: any): string[] {
    return [
      'Optimize posting schedule based on engagement patterns',
      'Adjust content strategy for better reach',
      'Focus on high-performing content types',
      'Engage with trending topics in your niche'
    ];
  }

  // Generate recovery recommendations
  private generateRecoveryRecommendations(steps: any): string[] {
    return [
      'Verify API credentials',
      'Check rate limiting',
      'Validate request parameters',
      'Review error logs for patterns'
    ];
  }

  // Get error recovery steps
  private async getErrorRecoverySteps(error: any): Promise<string[]> {
    const errorAnalysis = await this.processTask({
      type: 'analyze',
      input: { error }
    });

    // Assuming the AI returns these fields in the data property
    const analysis = JSON.parse(errorAnalysis.data);
    return [
      `Identified issue: ${analysis.issue}`,
      `Recommended action: ${analysis.action}`,
      `Prevention tip: ${analysis.prevention}`
    ];
  }
} 