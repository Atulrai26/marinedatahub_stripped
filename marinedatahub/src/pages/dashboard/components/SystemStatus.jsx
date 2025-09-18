import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemStatus = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const systemMetrics = {
    storage: {
      used: 2.4,
      total: 10.0,
      unit: 'TB'
    },
    processing: {
      active: 3,
      queued: 7,
      completed: 156
    },
    aiModels: {
      speciesId: { status: 'online', accuracy: 94.2, version: 'v2.1.3' },
      dataValidation: { status: 'online', accuracy: 98.7, version: 'v1.8.2' },
      correlationEngine: { status: 'maintenance', accuracy: 91.5, version: 'v3.0.1' }
    },
    dataQuality: {
      score: 96.8,
      issues: 12,
      resolved: 234
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-success';
      case 'maintenance':
        return 'text-warning';
      case 'offline':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return 'CheckCircle';
      case 'maintenance':
        return 'AlertTriangle';
      case 'offline':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const storagePercentage = (systemMetrics?.storage?.used / systemMetrics?.storage?.total) * 100;

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">System Status</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Storage Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Storage Usage</span>
            <span className="text-sm text-muted-foreground">
              {systemMetrics?.storage?.used}{systemMetrics?.storage?.unit} / {systemMetrics?.storage?.total}{systemMetrics?.storage?.unit}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                storagePercentage > 80 ? 'bg-error' : storagePercentage > 60 ? 'bg-warning' : 'bg-primary'
              }`}
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Processing Queue */}
        <div>
          <span className="text-sm font-medium text-foreground mb-3 block">Processing Queue</span>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{systemMetrics?.processing?.active}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">{systemMetrics?.processing?.queued}</div>
              <div className="text-xs text-muted-foreground">Queued</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">{systemMetrics?.processing?.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <>
            {/* AI Models Status */}
            <div>
              <span className="text-sm font-medium text-foreground mb-3 block">AI Models</span>
              <div className="space-y-3">
                {Object.entries(systemMetrics?.aiModels)?.map(([key, model]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={getStatusIcon(model?.status)} 
                        size={16} 
                        className={getStatusColor(model?.status)}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground capitalize">
                          {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                        </p>
                        <p className="text-xs text-muted-foreground">{model?.version}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{model?.accuracy}%</p>
                      <p className="text-xs text-muted-foreground capitalize">{model?.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Quality */}
            <div>
              <span className="text-sm font-medium text-foreground mb-3 block">Data Quality</span>
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overall Score</span>
                  <span className="text-lg font-bold text-success">{systemMetrics?.dataQuality?.score}%</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="text-center">
                    <div className="text-sm font-medium text-warning">{systemMetrics?.dataQuality?.issues}</div>
                    <div className="text-xs text-muted-foreground">Active Issues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-success">{systemMetrics?.dataQuality?.resolved}</div>
                    <div className="text-xs text-muted-foreground">Resolved</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SystemStatus;