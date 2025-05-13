"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

interface OrderAnalysis {
  summary: string;
  patterns: string[];
  recommendations: string[];
  timestamp: Date;
}

export default function OrderAggregation() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analyses, setAnalyses] = useState<OrderAnalysis[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/order-aggregation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      setAnalyses(prev => [{
        summary: data.summary,
        patterns: data.patterns,
        recommendations: data.recommendations,
        timestamp: new Date()
      }, ...prev]);
    } catch (error) {
      console.error('Error processing order data:', error);
    } finally {
      setIsProcessing(false);
      setQuery('');
    }
  };

  return (
    <div className="order-aggregation-page">
      <header className="page-header">
        <h1>Order Aggregation Agent</h1>
        <p>Analyze and process order data with AI assistance</p>
      </header>

      <div className="agent-interface">
        <Card className="command-card">
          <CardHeader>
            <CardTitle>Command Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="command-form">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about order patterns, request analysis, or generate summaries..."
                className="command-input"
              />
              <Button 
                type="submit" 
                disabled={isProcessing}
                className="command-button"
              >
                {isProcessing ? 'Processing...' : 'Analyze Orders'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="capabilities-grid">
          <Card className="capability-card">
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="source-list">
                <li>E-commerce Platform</li>
                <li>POS Systems</li>
                <li>Mobile Orders</li>
                <li>Web Orders</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="capability-card">
            <CardHeader>
              <CardTitle>Processing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="status-indicators">
                <div className="status-item">
                  <span className="status-label">Data Aggregation:</span>
                  <span className="status-value active">Active</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Pattern Analysis:</span>
                  <span className="status-value active">Active</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Summary Generation:</span>
                  <span className="status-value active">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="analysis-results">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {analyses.length === 0 ? (
              <div className="empty-state">
                <p>No analyses yet. Start by sending a command to the agent.</p>
              </div>
            ) : (
              <div className="analyses-list">
                {analyses.map((analysis, index) => (
                  <div key={index} className="analysis-item">
                    <div className="analysis-header">
                      <h3>Order Analysis</h3>
                      <span className="analysis-time">
                        {analysis.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <div className="analysis-content">
                      <div className="summary-section">
                        <h4>Summary</h4>
                        <p>{analysis.summary}</p>
                      </div>
                      <div className="patterns-section">
                        <h4>Detected Patterns</h4>
                        <ul>
                          {analysis.patterns.map((pattern, i) => (
                            <li key={i}>{pattern}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="recommendations-section">
                        <h4>Recommendations</h4>
                        <ul>
                          {analysis.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 