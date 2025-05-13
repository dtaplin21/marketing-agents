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
}

const agents: Agent[] = [
  {
    id: 'analyst',
    name: 'Quantum Analysis Engine',
    description: 'Neural processing for advanced data analysis',
    icon: '🧠',
    type: 'Cognitive Analysis'
  },
  {
    id: 'social',
    name: 'Social Intelligence Matrix',
    description: 'Advanced social pattern recognition',
    icon: '🌐',
    type: 'Social Cognition'
  },
  {
    id: 'health',
    name: 'System Synapse Monitor',
    description: 'Real-time neural network monitoring',
    icon: '⚡',
    type: 'System Intelligence'
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
    <div className="command-container">
      <div className="agent-grid">
        {agents.map((agent) => (
          <Card key={agent.id} className="agent-card" onClick={() => setSelectedAgent(agent.id)}>
            <div className="agent-header">
              <div className="agent-header-content">
                <span className="agent-icon">{agent.icon}</span>
                <h3 className="agent-name">{agent.name}</h3>
              </div>
            </div>
            <div className="agent-body">
              <div className="agent-type">{agent.type}</div>
              <p className="agent-description">{agent.description}</p>
              <div className="agent-status">
                <span className="status-label">Neural Status:</span>
                <span className="status-value">ACTIVE</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="query-card">
        <div className="query-container">
          <form onSubmit={handleSubmit} className="query-form">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Interface with ${agents.find(a => a.id === selectedAgent)?.name}...`}
              className="query-input"
            />
            <Button type="submit" className="query-button">Execute</Button>
          </form>
        </div>
      </Card>

      <Card className="updates-card">
        <div className="updates-header">
          <h3 className="updates-title">Neural Activity Log</h3>
        </div>
        <div className="updates-body">
          {updates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🧠</div>
              <p className="empty-text">Neural network awaiting input signals...</p>
            </div>
          ) : (
            <div className="updates-list">
              {updates.map((update, index) => {
                const agent = agents.find(a => a.id === update.agent);
                return (
                  <div key={index} className="update-item">
                    <div className="update-icon">{agent?.icon}</div>
                    <div className="update-content">
                      <div className="update-header">
                        <h4 className="update-agent">{agent?.name}</h4>
                        <span className="update-time">
                          {update.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="update-message">{update.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
