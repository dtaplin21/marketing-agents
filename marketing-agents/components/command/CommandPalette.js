import React, { useState } from 'react';

const agents = [
  {
    id: 'analyst',
    name: 'Data Analyst',
    color: 'blue',
    description: 'Analyzes customer segments and provides insights'
  },
  {
    id: 'social',
    name: 'Social Media',
    color: 'purple',
    description: 'Generates and manages social media content'
  },
  {
    id: 'health',
    name: 'System Health',
    color: 'green',
    description: 'Monitors system performance and health'
  }
];

export function CommandPalette() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0].id);
  const [query, setQuery] = useState('');
  const [updates, setUpdates] = useState([]);

  const handleSubmit = (e) => {
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
    <div className="command-palette">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>AI Agents</h2>
        <div className="agent-buttons">
          {agents.map((agent) => (
            <button
              key={agent.id}
              className={`agent-button ${selectedAgent === agent.id ? 'selected' : ''} ${agent.color}`}
              onClick={() => setSelectedAgent(agent.id)}
            >
              {agent.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="agent-tabs">
          {agents.map((agent) => (
            <button
              key={agent.id}
              className={`tab-button ${selectedAgent === agent.id ? 'active' : ''} ${agent.color}`}
              onClick={() => setSelectedAgent(agent.id)}
            >
              {agent.name}
            </button>
          ))}
        </div>

        {agents.map((agent) => (
          agent.id === selectedAgent && (
            <div key={agent.id} className="agent-content">
              <div className="command-card">
                <h3>{agent.description}</h3>
                <form onSubmit={handleSubmit} className="command-form">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Ask ${agent.name} a question...`}
                    className="command-input"
                  />
                  <button type="submit" className="send-button">Send</button>
                </form>
              </div>
            </div>
          )
        ))}

        {/* Updates Dashboard */}
        <div className="updates-dashboard">
          <h2>Recent Updates</h2>
          <div className="updates-list">
            {updates.map((update, index) => (
              <div key={index} className="update-card">
                <div className="update-header">
                  <span className="agent-name">
                    {agents.find(a => a.id === update.agent)?.name}
                  </span>
                  <span className="timestamp">
                    {update.timestamp.toLocaleString()}
                  </span>
                </div>
                <p className="update-message">{update.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 