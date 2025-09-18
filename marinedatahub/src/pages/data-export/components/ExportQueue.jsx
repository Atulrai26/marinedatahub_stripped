import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportQueue = () => {
  const [exports, setExports] = useState([
    {
      id: 'exp_001',
      name: 'Species_Analysis_Complete.xlsx',
      status: 'completed',
      progress: 100,
      size: '2.4 MB',
      format: 'XLSX',
      createdAt: new Date(Date.now() - 120000),
      completedAt: new Date(Date.now() - 60000),
      downloadUrl: '#',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'exp_002',
      name: 'Ocean_Temperature_Data_2024.csv',
      status: 'processing',
      progress: 65,
      size: '15.2 MB',
      format: 'CSV',
      createdAt: new Date(Date.now() - 300000),
      completedAt: null,
      downloadUrl: null,
      expiresAt: null
    },
    {
      id: 'exp_003',
      name: 'Bathymetry_Report_Q1.pdf',
      status: 'queued',
      progress: 0,
      size: '8.7 MB',
      format: 'PDF',
      createdAt: new Date(Date.now() - 60000),
      completedAt: null,
      downloadUrl: null,
      expiresAt: null
    },
    {
      id: 'exp_004',
      name: 'DNA_Sequences_Archive.zip',
      status: 'failed',
      progress: 0,
      size: '45.1 MB',
      format: 'ZIP',
      createdAt: new Date(Date.now() - 600000),
      completedAt: null,
      downloadUrl: null,
      expiresAt: null,
      error: 'Insufficient storage space'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Icon name="CheckCircle" size={16} color="var(--color-success)" />;
      case 'processing':
        return <Icon name="Loader2" size={16} className="animate-spin text-primary" />;
      case 'queued':
        return <Icon name="Clock" size={16} color="var(--color-warning)" />;
      case 'failed':
        return <Icon name="XCircle" size={16} color="var(--color-error)" />;
      default:
        return <Icon name="FileText" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'processing':
        return 'text-primary';
      case 'queued':
        return 'text-warning';
      case 'failed':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const formatExpiresIn = (date) => {
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    return 'Soon';
  };

  const handleDownload = (exportItem) => {
    if (exportItem?.downloadUrl && exportItem?.status === 'completed') {
      console.log(`Downloading ${exportItem?.name}`);
      // Simulate download
    }
  };

  const handleRetry = (exportId) => {
    setExports(exports.map(exp => 
      exp?.id === exportId 
        ? { ...exp, status: 'queued', progress: 0, error: undefined }
        : exp
    ));
  };

  const handleCancel = (exportId) => {
    setExports(exports.filter(exp => exp?.id !== exportId));
  };

  const completedCount = exports.filter(exp => exp?.status === 'completed')?.length;
  const processingCount = exports.filter(exp => exp?.status === 'processing')?.length;
  const queuedCount = exports.filter(exp => exp?.status === 'queued')?.length;
  const failedCount = exports.filter(exp => exp?.status === 'failed')?.length;

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Export Queue</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={() => window.location?.reload()}
          >
            Refresh
          </Button>
        </div>
        
        <div className="flex items-center space-x-6 mt-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-muted-foreground">{completedCount} completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">{processingCount} processing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">{queuedCount} queued</span>
          </div>
          {failedCount > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-error rounded-full"></div>
              <span className="text-muted-foreground">{failedCount} failed</span>
            </div>
          )}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {exports.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Download" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No exports in queue</p>
            <p className="text-xs text-muted-foreground mt-1">Start an export to see it here</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {exports.map((exportItem) => (
              <div key={exportItem?.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(exportItem?.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {exportItem?.name}
                        </p>
                        <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                          <span>{exportItem?.size}</span>
                          <span>•</span>
                          <span>{exportItem?.format}</span>
                          <span>•</span>
                          <span className={getStatusColor(exportItem?.status)}>
                            {exportItem?.status?.charAt(0)?.toUpperCase() + exportItem?.status?.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                          <span>Created {formatTimeAgo(exportItem?.createdAt)}</span>
                          {exportItem?.completedAt && (
                            <>
                              <span>•</span>
                              <span>Completed {formatTimeAgo(exportItem?.completedAt)}</span>
                            </>
                          )}
                          {exportItem?.expiresAt && exportItem?.status === 'completed' && (
                            <>
                              <span>•</span>
                              <span>Expires in {formatExpiresIn(exportItem?.expiresAt)}</span>
                            </>
                          )}
                        </div>
                        
                        {exportItem?.error && (
                          <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded text-xs text-error">
                            {exportItem?.error}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        {exportItem?.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(exportItem)}
                            iconName="Download"
                            className="h-8 w-8 p-0"
                          />
                        )}
                        {exportItem?.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRetry(exportItem?.id)}
                            iconName="RotateCcw"
                            className="h-8 w-8 p-0"
                          />
                        )}
                        {(exportItem?.status === 'processing' || exportItem?.status === 'queued') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(exportItem?.id)}
                            iconName="X"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-error"
                          />
                        )}
                      </div>
                    </div>
                    
                    {exportItem?.status === 'processing' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Processing...</span>
                          <span>{exportItem?.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${exportItem?.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {exports.length > 0 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExports(exports.filter(exp => exp?.status !== 'completed'))}
              disabled={completedCount === 0}
            >
              Clear Completed
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              disabled={completedCount === 0}
            >
              Download All ({completedCount})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportQueue;