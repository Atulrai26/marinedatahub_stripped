import React, { useState, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const QuickUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFileUpload(files);
  };

  const handleFileUpload = async (files) => {
    if (files?.length === 0) return;
    
    setIsUploading(true);
    setIsExpanded(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setTimeout(() => setIsExpanded(false), 2000);
    }, 3000);
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  if (isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-card border border-border rounded-lg shadow-moderate p-4 w-80">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Quick Upload</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
              isDragOver
                ? 'border-primary bg-primary/5' :'border-border bg-muted/30'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="space-y-3">
                <div className="w-8 h-8 mx-auto">
                  <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Uploading files...</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-1/3 transition-all duration-300"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-8 h-8 mx-auto">
                  <Icon name="Upload" size={32} color="var(--color-muted-foreground)" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Drop files here</p>
                  <p className="text-xs text-muted-foreground">or click to browse</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openFileDialog}
                  className="w-full"
                >
                  Select Files
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground">
            Supported: CSV, JSON, NetCDF, XLSX
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,.json,.nc,.xlsx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="default"
        size="lg"
        onClick={() => setIsExpanded(true)}
        className="rounded-full shadow-moderate hover:shadow-lg transition-all duration-200 h-14 w-14 p-0"
      >
        <Icon name="Plus" size={24} />
      </Button>
    </div>
  );
};

export default QuickUpload;