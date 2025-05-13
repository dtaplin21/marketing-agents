export class Logger {
  private logs: string[] = [];
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  log(message: string, ...args: any[]) {
    this.logs.push(`[${this.context}] ${message}`);
    console.log(`[${this.context}] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.logs.push(`[${this.context}] WARN: ${message}`);
    console.warn(`[${this.context}] ${message}`, ...args);
  }

  error(message: string, ...args: any[]) {
    this.logs.push(`[${this.context}] ERROR: ${message}`);
    console.error(`[${this.context}] ${message}`, ...args);
  }

  getLogs(): string[] {
    return this.logs;
  }
} 