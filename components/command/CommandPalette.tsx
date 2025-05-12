import React, { FC, useState, FormEvent } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Agent {
  id: string;
  name: string;
  color: string;
  description: string;
}

const agents: Agent[] = [
  {
    id: 'analyst',
    name: 'Data Analyst',
    color: 'bg-blue-500',
    description: 'Analyzes customer segments and provides insights'
  },
  {
    id: 'social',
    name: 'Social Media',
    color: 'bg-purple-500',
    description: 'Generates and manages social media content'
  },
  {
    id: 'health',
    name: 'System Health',
    color: 'bg-green-500',
    description: 'Monitors system performance and health'
  }
];

export const CommandPalette: FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0].id);
  const [query, setQuery] = useState<string>('');
  const [updates, setUpdates] = useState<Array<{ agent: string, message: string, timestamp: Date }>>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add to updates (this is a placeholder - you'll want to integrate with your actual AI system)
    setUpdates(prev => [{
      agent: selectedAgent,
      message: query,
      timestamp: new Date()
    }, ...prev]);
    
    setQuery('');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">AI Agents</h2>
        <div className="space-y-2">
          {agents.map((agent) => (
            <Button
              key={agent.id}
              className={`w-full justify-start ${agent.color} text-white`}
              onClick={() => setSelectedAgent(agent.id)}
            >
              {agent.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Tabs value={selectedAgent} onValueChange={setSelectedAgent}>
          <TabsList className="mb-4">
            {agents.map((agent) => (
              <TabsTrigger
                key={agent.id}
                value={agent.id}
                className={`${agent.color} text-white`}
              >
                {agent.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {agents.map((agent) => (
            <TabsContent key={agent.id} value={agent.id}>
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{agent.description}</h3>
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={`Ask ${agent.name} a question...`}
                      className="flex-1"
                    />
                    <Button type="submit">Send</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          ))}

          {/* Updates Dashboard */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Recent Updates</h2>
            <div className="space-y-4">
              {updates.map((update, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {agents.find(a => a.id === update.agent)?.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {update.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2">{update.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}; 