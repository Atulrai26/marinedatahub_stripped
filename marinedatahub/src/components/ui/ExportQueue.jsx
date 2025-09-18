import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ExportQueue = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [exports, setExports] = useState([
    {
      id: 1,
      name: 'Species_Analysis_2024.xlsx',
      status: 'completed',
      progress: 100,
      size: '2.4 MB',
      timestamp: '2 min ago',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Ocean_Temperature_Data.csv',
      status: 'processing',
      progress: 65,
      size: '15.2 MB',
      timestamp: 'In progress',
      downloadUrl: null
    },
    {
      id: 3,
      name: 'Bathymetry_Report.pdf',
      status: 'queued',
      progress: 0,
      size: '8.7 MB',
      timestamp: 'Queued',
      downloadUrl: null
    }
  ]);

  const completedCount = exports.filter(exp => exp?.status === 'completed')?.length;
  const processingCount = exports.filter(exp => exp?.status === 'processing')?.length;

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

  const handleDownload = (exportItem) => {
    if (exportItem?.downloadUrl && exportItem?.status === 'completed') {
      // Simulate download
      console.log(`Downloading ${exportItem?.name}`);
    }
  };

  const handleRemove = (exportId) => {
    setExports(exports.filter(exp => exp?.id !== exportId));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <div className="relative">
          <Icon name="Download" size={16} />
          {(completedCount > 0 || processingCount > 0) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent text-white text-xs rounded-full flex items-center justify-center">
              {completedCount + processingCount}
            </div>
          )}
        </div>
        <span className="hidden md:inline">Exports</span>
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-popover border border-border rounded-lg shadow-moderate z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Export Queue</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span>{completedCount} completed</span>
              <span>{processingCount} processing</span>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {exports.length === 0 ? (
              <div className="p-6 text-center">
                <Icon name="Download" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No exports yet</p>
              </div>
            ) : (
              <div className="p-2">
                {exports.map((exportItem) => (
                  <div
                    key={exportItem?.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(exportItem?.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {exportItem?.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">{exportItem?.size}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{exportItem?.timestamp}</span>
                      </div>
                      
                      {exportItem?.status === 'processing' && (
                        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${exportItem?.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {exportItem?.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(exportItem)}
                          className="h-8 w-8 p-0"
                        >
                          <Icon name="Download" size={14} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(exportItem?.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-error"
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {exports.length > 0 && (
            <div className="p-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExports([])}
                className="w-full"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExportQueue;