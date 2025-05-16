"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ComputerAutomationService } from '../../services/computer-automation';

interface PlatformConfig {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  accountId?: string;
  websiteUrl?: string;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  type: 'social' | 'website' | 'analytics';
}

const automationService = new ComputerAutomationService();

interface PlatformConfigModalProps {
  platform: Platform;
  onClose: () => void;
  onConnect: (platformId: string, config: PlatformConfig) => Promise<void>;
}

export const PlatformConfigModal: React.FC<PlatformConfigModalProps> = ({ 
  platform, 
  onClose, 
  onConnect 
}) => {
  const [isAutomating, setIsAutomating] = useState(false);
  const [automationLogs, setAutomationLogs] = useState<string[]>([]);
  const [monitoringData, setMonitoringData] = useState<any>(null);

  const handleAutoConnect = async () => {
    setIsAutomating(true);
    try {
      const result = await automationService.executeComputerTask({
        platformId: platform.id,
        action: 'connect'
      });

      if (result.success && result.credentials) {
        // Start monitoring
        const monitoring = await automationService.monitorPlatform(
          platform.id,
          ['performance', 'errors', 'usage']
        );

        setMonitoringData(monitoring);

        if (result.marketingStrategy) {
          setAutomationLogs(prev => [
            ...prev,
            '🎯 Generated Marketing Strategy:',
            ...(result.marketingStrategy as string).split('\n')
          ]);
        }

        await onConnect(platform.id, result.credentials as PlatformConfig);
        onClose();
      } else {
        setAutomationLogs(result.logs || ['Automation failed']);
        
        // Attempt recovery
        const recovery = await automationService.recoverFromError(
          result.error,
          { platform: platform.id }
        );

        if (recovery.recommendations) {
          setAutomationLogs(prev => [
            ...prev,
            '🔄 Recovery Recommendations:',
            ...recovery.recommendations
          ]);
        }
      }
    } catch (error) {
      console.error('Automation failed:', error);
      setAutomationLogs(['Automation failed with error']);
    } finally {
      setIsAutomating(false);
    }
  };

  return (
    <div className="platform-config-modal">
      <Card className="config-container">
        <CardHeader>
          <CardTitle>Configure {platform.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="automation-section">
            <Button
              onClick={handleAutoConnect}
              disabled={isAutomating}
              className="auto-connect-button"
            >
              {isAutomating ? 'Automating...' : '🤖 Auto-Connect Platform'}
            </Button>

            {automationLogs.length > 0 && (
              <div className="automation-logs">
                <h4>Automation Progress</h4>
                <div className="log-container">
                  {automationLogs.map((log, index) => (
                    <div key={index} className="log-entry">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {monitoringData && (
              <div className="monitoring-data">
                <h4>Platform Monitoring</h4>
                <div className="metrics-grid">
                  {Object.entries(monitoringData.data).map(([metric, value]) => (
                    <div key={metric} className="metric-card">
                      <h5>{metric}</h5>
                      <p>{String(value)}</p>
                    </div>
                  ))}
                </div>
                {monitoringData.recommendations && (
                  <div className="recommendations">
                    <h5>Optimization Recommendations</h5>
                    <ul>
                      {monitoringData.recommendations.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="manual-section">
            <h4>Manual Configuration</h4>
            {/* Manual configuration form */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 