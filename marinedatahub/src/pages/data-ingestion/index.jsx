import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickUpload from '../../components/ui/QuickUpload';
import ExportQueue from '../../components/ui/ExportQueue';
import SearchBar from '../../components/ui/SearchBar';
import UploadZone from './components/UploadZone';
import FileQueue from './components/FileQueue';
import ProcessingPanel from './components/ProcessingPanel';
import AdvancedOptions from './components/AdvancedOptions';
import BatchControls from './components/BatchControls';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DataIngestion = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [processingSettings, setProcessingSettings] = useState({
    dataSource: 'research_vessel',
    priority: 'normal',
    qualityLevel: 'standard',
    autoMetadata: true,
    batchProcessing: true,
    notifyOnComplete: true,
    customTags: '',
    projectName: '',
    researcherName: '',
    institutionName: ''
  });

  const [processingStats] = useState({
    active: 3,
    completed: 127,
    queued: 8,
    failed: 2
  });

  const [pipelineStages] = useState([
    {
      id: 1,
      name: 'Validation',
      status: 'completed',
      progress: 100,
      description: 'File format and structure validation'
    },
    {
      id: 2,
      name: 'Standardization',
      status: 'processing',
      progress: 65,
      description: 'Converting to standard marine data formats'
    },
    {
      id: 3,
      name: 'Metadata Tagging',
      status: 'pending',
      progress: 0,
      description: 'Extracting and tagging metadata'
    },
    {
      id: 4,
      name: 'Quality Check',
      status: 'pending',
      progress: 0,
      description: 'Data quality assessment and validation'
    },
    {
      id: 5,
      name: 'Indexing',
      status: 'pending',
      progress: 0,
      description: 'Creating searchable indexes'
    }
  ]);

  const mockFiles = [
    {
      id: 1,
      name: 'Pacific_Temperature_2024.csv',
      size: 2457600,
      type: 'CSV',
      status: 'completed',
      progress: 100,
      uploadTime: '2 min ago',
      error: null
    },
    {
      id: 2,
      name: 'Otolith_Images_Batch_01.zip',
      size: 15728640,
      type: 'Images',
      status: 'processing',
      progress: 45,
      uploadTime: '5 min ago',
      error: null
    },
    {
      id: 3,
      name: 'DNA_Sequences_Tuna.fasta',
      size: 8912896,
      type: 'DNA',
      status: 'error',
      progress: 0,
      uploadTime: '8 min ago',
      error: 'Invalid sequence format detected'
    },
    {
      id: 4,
      name: 'Salinity_Data_Station_7B.json',
      size: 1048576,
      type: 'JSON',
      status: 'pending',
      progress: 0,
      uploadTime: '10 min ago',
      error: null
    }
  ];

  useEffect(() => {
    setFiles(mockFiles);
  }, []);

  const handleFilesSelected = (newFiles) => {
    const processedFiles = newFiles?.map((file, index) => ({
      id: Date.now() + index,
      name: file?.name,
      size: file?.size,
      type: getFileType(file?.name),
      status: 'pending',
      progress: 0,
      uploadTime: 'Just now',
      error: null,
      file: file
    }));

    setFiles(prev => [...prev, ...processedFiles]);
    
    // Simulate processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const getFileType = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return 'CSV';
      case 'json':
        return 'JSON';
      case 'jpg': case'jpeg': case'png': case'tiff':
        return 'Images';
      case 'fasta': case'fastq':
        return 'DNA';
      default:
        return 'Other';
    }
  };

  const handleRemoveFile = (fileId) => {
    setFiles(prev => prev?.filter(file => file?.id !== fileId));
    setSelectedFiles(prev => prev?.filter(id => id !== fileId));
  };

  const handleRetryFile = (fileId) => {
    setFiles(prev => prev?.map(file => 
      file?.id === fileId 
        ? { ...file, status: 'pending', error: null, progress: 0 }
        : file
    ));
  };

  const handleClearAll = () => {
    setFiles([]);
    setSelectedFiles([]);
  };

  const handleSelectAll = () => {
    setSelectedFiles(files?.map(file => file?.id));
  };

  const handleDeselectAll = () => {
    setSelectedFiles([]);
  };

  const handleProcessSelected = () => {
    setIsProcessing(true);
    // Simulate processing selected files
    setTimeout(() => {
      setIsProcessing(false);
    }, 5000);
  };

  const handlePauseAll = () => {
    setIsProcessing(false);
  };

  const handleResumeAll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const handleViewDetails = () => {
    console.log('View processing details');
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Data Ingestion - MarineDataHub</title>
        <meta name="description" content="Upload and process multi-format marine datasets including CSV files, images, and DNA sequences through an intuitive batch processing interface." />
      </Helmet>
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Data Ingestion</h1>
                <p className="text-muted-foreground">
                  Upload and process multi-format marine datasets with automated validation and standardization
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <ExportQueue />
                <Button
                  variant="outline"
                  iconName="HelpCircle"
                  iconPosition="left"
                >
                  Help Guide
                </Button>
              </div>
            </div>

            <SearchBar />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Upload and Queue */}
            <div className="xl:col-span-2 space-y-6">
              {/* Upload Zone */}
              <UploadZone 
                onFilesSelected={handleFilesSelected}
                isProcessing={isProcessing}
              />

              {/* Batch Controls */}
              <BatchControls
                selectedFiles={selectedFiles}
                totalFiles={files?.length}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onProcessSelected={handleProcessSelected}
                onPauseAll={handlePauseAll}
                onResumeAll={handleResumeAll}
                isProcessing={isProcessing}
              />

              {/* File Queue */}
              <FileQueue
                files={files}
                onRemoveFile={handleRemoveFile}
                onRetryFile={handleRetryFile}
                onClearAll={handleClearAll}
              />

              {/* Advanced Options */}
              <AdvancedOptions
                isExpanded={showAdvancedOptions}
                onToggle={() => setShowAdvancedOptions(!showAdvancedOptions)}
                settings={processingSettings}
                onSettingsChange={setProcessingSettings}
              />
            </div>

            {/* Right Column - Processing Panel */}
            <div className="xl:col-span-1">
              <ProcessingPanel
                processingStats={processingStats}
                pipelineStages={pipelineStages}
                onViewDetails={handleViewDetails}
              />
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <Icon name="Upload" size={24} color="var(--color-primary)" className="mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">2.4TB</div>
              <div className="text-sm text-muted-foreground">Total Data Processed</div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <Icon name="FileSpreadsheet" size={24} color="var(--color-success)" className="mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">1,247</div>
              <div className="text-sm text-muted-foreground">Files Processed</div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <Icon name="Database" size={24} color="var(--color-accent)" className="mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">89</div>
              <div className="text-sm text-muted-foreground">Data Sources</div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <Icon name="CheckCircle" size={24} color="var(--color-success)" className="mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">98.7%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </main>
      <QuickUpload />
    </div>
  );
};

export default DataIngestion;