export interface Segment {
  id: string;
  name: string;
  criteria: Record<string, any>;
  customerCount: number;
  churnRisk: number;
  valueScore: number;
  createdAt: string;
}

export interface AutomatedResponse {
  id: string;
  channel: 'email' | 'chat' | 'social';
  content: string;
  sentiment: number;
  timestamp: string;
  customerSegment: string;
}

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  trend: 'up' | 'down' | 'stable';
  timestamp: string;
}

export interface CodeIssue {
  id: string;
  type: 'test' | 'lint' | 'error';
  message: string;
  file: string;
  line: number;
  prUrl?: string;
  status: 'open' | 'fixing' | 'resolved';
} 