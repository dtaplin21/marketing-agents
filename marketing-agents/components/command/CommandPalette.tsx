"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface Agent {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  description: string;
  icon: string;
}

const agents: Agent[] = [
  {
    id: 'analyst',
    name: 'Data Analyst',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    description: 'Analyzes customer segments and provides insights',
    icon: '📊'
  },
  {
    id: 'social',
    name: 'Social Media',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    description: 'Generates and manages social media content',
    icon: '🌐'
  },
  {
    id: 'health',
    name: 'System Health',
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    description: 'Monitors system performance and health',
    icon: '🏥'
  }
];

export const CommandPalette = () => {
  const [selectedAgent, setSelectedAgent] = useState(agents[0].id);
  const [query, setQuery] = useState('');
  const [updates, setUpdates] = useState<Array<{ agent: string, message: string, timestamp: Date }>>([]);

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
    <div className="space-y-6">
      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className={`${agent.bgColor} text-white rounded-t-lg`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{agent.icon}</span>
                <CardTitle>{agent.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">{agent.description}</p>
              <div className="text-sm text-gray-500">Waiting for data...</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Query Input */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask any AI agent a question..."
              className="flex-1"
            />
            <Button type="submit">Send Query</Button>
          </form>
        </CardContent>
      </Card>

      {/* Updates Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {updates.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No updates yet. Start by asking a question.
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update, index) => {
                const agent = agents.find(a => a.id === update.agent);
                return (
                  <div key={index} className="flex gap-3 pb-4 border-b last:border-0">
                    <div className={`h-10 w-10 rounded-full ${agent?.bgColor} flex items-center justify-center text-white flex-shrink-0`}>
                      {agent?.icon}
                    </div>
                    <div>
                      <p className="font-medium">{agent?.name}</p>
                      <p className="text-sm text-gray-600">{update.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {update.timestamp.toLocaleString()}
                      </p>
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
