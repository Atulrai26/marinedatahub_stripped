import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileQueue = ({ files, onRemoveFile, onRetryFile, onClearAll }) => {
  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return 'FileSpreadsheet';
      case 'json':
        return 'FileCode';
      case 'jpg': case'jpeg': case'png': case'tiff':
        return 'Image';
      case 'fasta': case'fastq':
        return 'Dna';
      default:
        return 'FileText';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'var(--color-success)';
      case 'processing':
        return 'var(--color-primary)';
      case 'error':
        return 'var(--color-error)';
      case 'pending':
        return 'var(--color-warning)';
      default:
        return 'var(--color-muted-foreground)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'processing':
        return 'Loader2';
      case 'error':
        return 'XCircle';
      case 'pending':
        return 'Clock';
      default:
        return 'FileText';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  if (files?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center">
          <Icon name="Inbox" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Files in Queue</h3>
          <p className="text-muted-foreground">Upload files to see them appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">File Queue</h3>
          <p className="text-sm text-muted-foreground">{files?.length} files total</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          iconName="Trash2"
          iconPosition="left"
        >
          Clear All
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {files?.map((file) => (
          <div key={file?.id} className="flex items-center space-x-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors duration-200">
            <div className="flex-shrink-0">
              <Icon name={getFileIcon(file?.name)} size={24} color="var(--color-muted-foreground)" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-medium text-foreground truncate">{file?.name}</p>
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getStatusIcon(file?.status)} 
                    size={16} 
                    color={getStatusColor(file?.status)}
                    className={file?.status === 'processing' ? 'animate-spin' : ''}
                  />
                  <span className="text-xs text-muted-foreground capitalize">{file?.status}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>{formatFileSize(file?.size)}</span>
                <span>•</span>
                <span>{file?.type}</span>
                {file?.uploadTime && (
                  <>
                    <span>•</span>
                    <span>{file?.uploadTime}</span>
                  </>
                )}
              </div>
              
              {file?.status === 'processing' && (
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${file?.progress || 0}%` }}
                  ></div>
                </div>
              )}
              
              {file?.status === 'error' && file?.error && (
                <p className="text-xs text-error mt-1">{file?.error}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {file?.status === 'error' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRetryFile(file?.id)}
                  iconName="RotateCcw"
                  className="h-8 w-8 p-0"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(file?.id)}
                iconName="X"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-error"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileQueue;