import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProcessingPanel = ({ processingStats, pipelineStages, onViewDetails }) => {
  const getStageIcon = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'validation':
        return 'Shield';
      case 'standardization':
        return 'Settings';
      case 'metadata tagging':
        return 'Tag';
      case 'quality check':
        return 'CheckCircle2';
      case 'indexing':
        return 'Database';
      default:
        return 'Cog';
    }
  };

  const getStageStatus = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'var(--color-success)', icon: 'CheckCircle' };
      case 'processing':
        return { color: 'var(--color-primary)', icon: 'Loader2' };
      case 'pending':
        return { color: 'var(--color-muted-foreground)', icon: 'Clock' };
      case 'error':
        return { color: 'var(--color-error)', icon: 'XCircle' };
      default:
        return { color: 'var(--color-muted-foreground)', icon: 'Circle' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Processing Statistics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Processing Overview</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">{processingStats?.active}</div>
            <div className="text-sm text-muted-foreground">Active Jobs</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-success mb-1">{processingStats?.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-warning mb-1">{processingStats?.queued}</div>
            <div className="text-sm text-muted-foreground">Queued</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-error mb-1">{processingStats?.failed}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>
      </div>
      {/* Pipeline Stages */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Processing Pipeline</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewDetails}
            iconName="ExternalLink"
            iconPosition="right"
          >
            View Details
          </Button>
        </div>

        <div className="space-y-4">
          {pipelineStages?.map((stage, index) => {
            const statusInfo = getStageStatus(stage?.status);
            return (
              <div key={stage?.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Icon name={getStageIcon(stage?.name)} size={16} color="var(--color-muted-foreground)" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{stage?.name}</span>
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={statusInfo?.icon} 
                        size={16} 
                        color={statusInfo?.color}
                        className={stage?.status === 'processing' ? 'animate-spin' : ''}
                      />
                      <span className="text-xs text-muted-foreground capitalize">{stage?.status}</span>
                    </div>
                  </div>
                  
                  {stage?.status === 'processing' && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stage?.progress || 0}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {stage?.description && (
                    <p className="text-xs text-muted-foreground mt-1">{stage?.description}</p>
                  )}
                </div>
                {index < pipelineStages?.length - 1 && (
                  <div className="absolute left-4 top-12 w-px h-6 bg-border"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" className="mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground">Pacific_Temperature_2024.csv processed successfully</p>
              <p className="text-xs text-muted-foreground">2 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
            <Icon name="Upload" size={16} color="var(--color-primary)" className="mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground">Batch upload started: 15 files</p>
              <p className="text-xs text-muted-foreground">5 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground">DNA_Sequence_001.fasta requires manual review</p>
              <p className="text-xs text-muted-foreground">8 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingPanel;