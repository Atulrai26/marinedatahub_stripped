import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BatchProcessing = ({ onBatchProcess, isProcessing }) => {
  const [batchFiles, setBatchFiles] = useState([]);
  const [processingMode, setProcessingMode] = useState('parallel');
  const [outputFormat, setOutputFormat] = useState('csv');
  const [batchProgress, setBatchProgress] = useState([]);

  const processingModeOptions = [
    { value: 'parallel', label: 'Parallel Processing (Faster)' },
    { value: 'sequential', label: 'Sequential Processing (More Accurate)' }
  ];

  const outputFormatOptions = [
    { value: 'csv', label: 'CSV Report' },
    { value: 'json', label: 'JSON Data' },
    { value: 'excel', label: 'Excel Workbook' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files)?.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file?.name,
      size: file?.size,
      type: file?.type?.startsWith('image/') ? 'image' : 'sequence',
      status: 'pending',
      progress: 0,
      result: null
    }));
    
    setBatchFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setBatchFiles(prev => prev?.filter(file => file?.id !== fileId));
  };

  const startBatchProcessing = () => {
    if (batchFiles?.length === 0) return;
    
    onBatchProcess({
      files: batchFiles,
      mode: processingMode,
      outputFormat
    });
  };

  const clearAll = () => {
    setBatchFiles([]);
    setBatchProgress([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'Clock';
      case 'processing':
        return 'Loader2';
      case 'completed':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      default:
        return 'FileText';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-muted-foreground';
      case 'processing':
        return 'text-primary';
      case 'completed':
        return 'text-success';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const completedCount = batchFiles?.filter(file => file?.status === 'completed')?.length;
  const errorCount = batchFiles?.filter(file => file?.status === 'error')?.length;
  const totalProgress = batchFiles?.length > 0 ? 
    (batchFiles?.reduce((sum, file) => sum + file?.progress, 0) / batchFiles?.length) : 0;

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Batch Processing</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              disabled={isProcessing}
              iconName="Trash2"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Select
            label="Processing Mode"
            options={processingModeOptions}
            value={processingMode}
            onChange={setProcessingMode}
            disabled={isProcessing}
          />
          <Select
            label="Output Format"
            options={outputFormatOptions}
            value={outputFormat}
            onChange={setOutputFormat}
            disabled={isProcessing}
          />
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
          <Icon name="Upload" size={24} color="var(--color-muted-foreground)" className="mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Drop multiple files here or click to browse
          </p>
          <input
            type="file"
            multiple
            accept="image/*,.csv,.txt,.fasta"
            onChange={(e) => handleFileUpload(e?.target?.files)}
            className="hidden"
            id="batch-upload"
            disabled={isProcessing}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('batch-upload')?.click()}
            disabled={isProcessing}
            iconName="FolderOpen"
            iconPosition="left"
          >
            Select Files
          </Button>
        </div>
      </div>
      {/* File List */}
      <div className="max-h-64 overflow-y-auto">
        {batchFiles?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Files" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No files added yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add multiple images or sequence files for batch processing
            </p>
          </div>
        ) : (
          <div className="p-2">
            {batchFiles?.map((file) => (
              <div
                key={file?.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
              >
                {/* File Type Icon */}
                <div className="flex-shrink-0">
                  <Icon
                    name={file?.type === 'image' ? 'Image' : 'FileText'}
                    size={16}
                    color="var(--color-muted-foreground)"
                  />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file?.name}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(file?.size)}</span>
                    <span>•</span>
                    <span className="capitalize">{file?.type}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  {file?.status === 'processing' && (
                    <div className="w-full bg-muted rounded-full h-1 mt-2">
                      <div
                        className="bg-primary h-1 rounded-full transition-all duration-300"
                        style={{ width: `${file?.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                  <Icon
                    name={getStatusIcon(file?.status)}
                    size={16}
                    className={`${getStatusColor(file?.status)} ${
                      file?.status === 'processing' ? 'animate-spin' : ''
                    }`}
                  />
                  {file?.status === 'completed' && file?.result && (
                    <span className="text-xs text-success font-medium">
                      {file?.result?.confidence}%
                    </span>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file?.id)}
                  disabled={isProcessing}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-error"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Progress Summary */}
      {batchFiles?.length > 0 && (
        <div className="p-4 border-t border-border">
          {isProcessing && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Batch Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(totalProgress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-muted-foreground">
                {batchFiles?.length} files
              </span>
              {completedCount > 0 && (
                <span className="text-success">
                  {completedCount} completed
                </span>
              )}
              {errorCount > 0 && (
                <span className="text-error">
                  {errorCount} failed
                </span>
              )}
            </div>

            <Button
              variant="default"
              onClick={startBatchProcessing}
              disabled={batchFiles?.length === 0 || isProcessing}
              loading={isProcessing}
              iconName="Play"
              iconPosition="left"
            >
              {isProcessing ? 'Processing...' : 'Start Batch'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchProcessing;