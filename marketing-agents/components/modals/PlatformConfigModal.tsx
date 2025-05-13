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

export const PlatformConfigModal = ({ 
  platform, 
  onClose, 
  onConnect 
}: { 
  platform: Platform;
  onClose: () => void;
  onConnect: (platformId: string, config: PlatformConfig) => Promise<void>;
}) => {
  const [isAutomating, setIsAutomating] = useState(false);
  const [automationLogs, setAutomationLogs] = useState<string[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentTaskId) {
      interval = setInterval(async () => {
        const status = await automationService.getTaskStatus(currentTaskId);
        setAutomationLogs(status.logs);
        
        if (status.status === 'completed') {
          clearInterval(interval);
          setCurrentTaskId(null);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentTaskId]);

  const handleAutoConnect = async () => {
    setIsAutomating(true);
    try {
      const result = await automationService.executeComputerTask({
        platformId: platform.id,
        action: 'connect'
      });

      if (result.success && result.credentials) {
        await onConnect(platform.id, result.credentials);
        onClose();
      } else {
        setAutomationLogs(result.logs || ['Automation failed']);
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