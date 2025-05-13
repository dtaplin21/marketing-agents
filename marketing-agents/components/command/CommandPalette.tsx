"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  capabilities: string[];
}

const agents: Agent[] = [
  {
    id: 'order_aggregation',
    name: 'Order Aggregation Agent',
    description: 'Processes and aggregates order data from multiple sources',
    icon: '📊',
    type: 'Data Processing',
    capabilities: [
      'Aggregate orders from multiple sources',
      'Process order data',
      'Generate order summaries',
      'Track order patterns'
    ]
  },
  {
    id: 'market_analysis',
    name: 'Market Analysis Agent',
    description: 'Analyzes market trends and customer behavior',
    icon: '📈',
    type: 'Analysis',
    capabilities: [
      'Market trend analysis',
      'Customer behavior tracking',
      'Competitive analysis',
      'Market opportunity detection'
    ]
  },
  {
    id: 'trend_detection',
    name: 'Trend Detection Agent',
    description: 'Identifies emerging trends and patterns in data',
    icon: '🔍',
    type: 'Analysis',
    capabilities: [
      'Pattern recognition',
      'Trend identification',
      'Anomaly detection',
      'Predictive analytics'
    ]
  }
];

export const CommandPalette = () => {
  const [selectedAgent, setSelectedAgent] = useState(agents[0].id);
  const [query, setQuery] = useState('');
  const [updates, setUpdates] = useState<Array<{ agent: string; message: string; timestamp: Date }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setUpdates(prev => [{
      agent: selectedAgent,
      message: query,
      timestamp: new Date()
    }, ...prev]);
    
    setQuery('');
  };

  return (
    <div className="agent-dashboard">
      <div className="agent-grid">
        {agents.map((agent) => (
          <Card 
            key={agent.id} 
            className="agent-card"
            onClick={() => setSelectedAgent(agent.id)}
          >
            <CardHeader className="agent-header">
              <div className="agent-header-content">
                <span className="agent-icon">{agent.icon}</span>
                <CardTitle className="agent-name">{agent.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="agent-content">
              <div className="agent-type">{agent.type}</div>
              <p className="agent-description">{agent.description}</p>
              <div className="agent-capabilities">
                <h4>Capabilities:</h4>
                <ul>
                  {agent.capabilities.map((capability, index) => (
                    <li key={index}>{capability}</li>
                  ))}
                </ul>
              </div>
              <div className="agent-status">
                <span>Status:</span>
                <span className="status-active">Ready</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="command-interface">
        <CardContent>
          <form onSubmit={handleSubmit} className="command-form">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Send command to ${agents.find(a => a.id === selectedAgent)?.name}...`}
              className="command-input"
            />
            <Button type="submit" className="command-button">
              Execute Command
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="activity-log">
        <CardHeader>
          <CardTitle>Agent Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          {updates.length === 0 ? (
            <div className="empty-log">
              <div className="empty-icon">🤖</div>
              <p>No agent activity yet. Send a command to get started.</p>
            </div>
          ) : (
            <div className="activity-list">
              {updates.map((update, index) => {
                const agent = agents.find(a => a.id === update.agent);
                return (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">{agent?.icon}</div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <h4 className="activity-agent">{agent?.name}</h4>
                        <span className="activity-time">
                          {update.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="activity-message">{update.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
