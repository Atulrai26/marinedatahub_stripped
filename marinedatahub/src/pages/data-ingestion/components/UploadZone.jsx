import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFilesSelected, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFormats = [
    { type: 'CSV', icon: 'FileSpreadsheet', description: 'Oceanographic data, species records' },
    { type: 'JSON', icon: 'FileCode', description: 'Structured marine datasets' },
    { type: 'Images', icon: 'Image', description: 'Otolith photos, underwater imagery' },
    { type: 'DNA/eDNA', icon: 'Dna', description: 'Sequence files (.fasta, .fastq)' }
  ];

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
    onFilesSelected(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    onFilesSelected(files);
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-6">
          <div className="w-16 h-16 mx-auto">
            <Icon 
              name={isProcessing ? "Loader2" : "Upload"} 
              size={64} 
              color="var(--color-primary)" 
              className={isProcessing ? "animate-spin" : ""}
            />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {isProcessing ? 'Processing Files...' : 'Upload Marine Data'}
            </h3>
            <p className="text-muted-foreground">
              {isProcessing 
                ? 'Please wait while we process your files'
                : 'Drag and drop your files here, or click to browse'
              }
            </p>
          </div>

          {!isProcessing && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                onClick={openFileDialog}
                iconName="FolderOpen"
                iconPosition="left"
              >
                Browse Files
              </Button>
              <Button
                variant="outline"
                onClick={openFileDialog}
                iconName="Upload"
                iconPosition="left"
              >
                Batch Upload
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {supportedFormats?.map((format) => (
          <div key={format?.type} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex-shrink-0 mt-1">
              <Icon name={format?.icon} size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">{format?.type}</h4>
              <p className="text-xs text-muted-foreground mt-1">{format?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".csv,.json,.jpg,.jpeg,.png,.tiff,.fasta,.fastq,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default UploadZone;