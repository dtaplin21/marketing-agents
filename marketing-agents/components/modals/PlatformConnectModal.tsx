"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface Platform {
  id: string;
  name: string;
  icon: string;
  isConnected: boolean;
  type: 'social' | 'website' | 'analytics';
}

interface AIResponse {
  recommendation: string;
  actions: string[];
  platforms: string[];
  timeline: string;
}

interface PlatformConnectModalProps {
  onClose: () => void;
}

export function PlatformConnectModal({ onClose }: PlatformConnectModalProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      isConnected: false,
      type: 'social'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      isConnected: false,
      type: 'social'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      isConnected: false,
      type: 'social'
    },
    {
      id: 'website',
      name: 'Website Analytics',
      icon: '📊',
      isConnected: false,
      type: 'analytics'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Platform',
      icon: '🛍️',
      isConnected: false,
      type: 'website'
    }
  ]);

  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConnect = async (platformId: string) => {
    // Here you would implement actual platform connection logic
    setPlatforms(platforms.map(p => 
      p.id === platformId ? { ...p, isConnected: !p.isConnected } : p
    ));
  };

  const handleAIQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);
    try {
      const connectedPlatforms = platforms.filter(p => p.isConnected);
      const response = await fetch('/api/ai-coordinator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          platforms: connectedPlatforms.map(p => p.id)
        }),
      });

      const data = await response.json();
      setAiResponse(data);
    } catch (error) {
      console.error('Error processing AI query:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="platform-modal">
      <Card className="platform-container">
        <CardHeader>
          <CardTitle>Platform Integration Hub</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="platform-grid">
            {platforms.map((platform) => (
              <div key={platform.id} className="platform-item">
                <div className="platform-icon">{platform.icon}</div>
                <div className="platform-info">
                  <h3>{platform.name}</h3>
                  <p>{platform.type}</p>
                </div>
                <Button
                  onClick={() => handleConnect(platform.id)}
                  className={`platform-button ${platform.isConnected ? 'connected' : ''}`}
                >
                  {platform.isConnected ? 'Connected' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>

          <div className="ai-interface">
            <form onSubmit={handleAIQuery} className="ai-form">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What would you like the AI to analyze across your platforms?"
                className="ai-input"
              />
              <Button 
                type="submit" 
                disabled={isProcessing || platforms.filter(p => p.isConnected).length === 0}
                className="ai-button"
              >
                {isProcessing ? 'Processing...' : 'Analyze'}
              </Button>
            </form>
          </div>

          {aiResponse && (
            <div className="ai-response">
              <h3>AI Recommendation</h3>
              <p className="recommendation">{aiResponse.recommendation}</p>
              
              <h4>Suggested Actions</h4>
              <ul className="actions-list">
                {aiResponse.actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>

              <h4>Platforms Involved</h4>
              <div className="platforms-involved">
                {aiResponse.platforms.map((platform, index) => (
                  <span key={index} className="platform-tag">{platform}</span>
                ))}
              </div>

              <h4>Timeline</h4>
              <p className="timeline">{aiResponse.timeline}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 