import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickUpload from '../../components/ui/QuickUpload';
import SearchBar from '../../components/ui/SearchBar';
import ExportQueue from '../../components/ui/ExportQueue';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DataSelectionTree from './components/DataSelectionTree';
import FormatConfiguration from './components/FormatConfiguration';
import ExportPreview from './components/ExportPreview';
import ExportQueueComponent from './components/ExportQueue';
import ScheduledExports from './components/ScheduledExports';

const DataExport = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [exportConfiguration, setExportConfiguration] = useState({
    format: 'csv',
    includeMetadata: true,
    compressionLevel: 'medium',
    citationFormat: 'apa',
    imageQuality: 'high'
  });
  const [activeTab, setActiveTab] = useState('manual');
  const [isExporting, setIsExporting] = useState(false);

  const handleSelectionChange = (items) => {
    setSelectedItems(items);
  };

  const handleConfigurationChange = (config) => {
    setExportConfiguration(config);
  };

  const handleStartExport = async () => {
    if (selectedItems?.length === 0) return;
    
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      // Reset selections after successful export
      setSelectedItems([]);
    }, 3000);
  };

  const exportStats = {
    totalDatasets: 156,
    totalSize: '4.2 TB',
    availableFormats: 6,
    activeSchedules: 3
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Data Export - MarineDataHub</title>
        <meta name="description" content="Export marine research data in multiple formats for analysis and reporting" />
      </Helmet>
      <Header />
      <QuickUpload />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Data Export</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Generate customized datasets and visualizations in multiple formats for research publications, reports, and external analysis tools.
                </p>
              </div>
              
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{exportStats?.totalDatasets}</div>
                  <div className="text-sm text-muted-foreground">Datasets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{exportStats?.totalSize}</div>
                  <div className="text-sm text-muted-foreground">Total Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{exportStats?.availableFormats}</div>
                  <div className="text-sm text-muted-foreground">Formats</div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-6">
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center space-x-1">
              <Button
                variant={activeTab === 'manual' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('manual')}
                iconName="Download"
                iconPosition="left"
                className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
                data-active={activeTab === 'manual'}
              >
                Manual Export
              </Button>
              <Button
                variant={activeTab === 'scheduled' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('scheduled')}
                iconName="CalendarClock"
                iconPosition="left"
                className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
                data-active={activeTab === 'scheduled'}
              >
                Scheduled Exports
              </Button>
              <Button
                variant={activeTab === 'queue' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('queue')}
                iconName="List"
                iconPosition="left"
                className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
                data-active={activeTab === 'queue'}
              >
                Export Queue
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'manual' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Data Selection */}
              <div className="xl:col-span-1">
                <DataSelectionTree onSelectionChange={handleSelectionChange} />
              </div>

              {/* Configuration and Preview */}
              <div className="xl:col-span-2 space-y-8">
                {/* Format Configuration */}
                <FormatConfiguration
                  selectedItems={selectedItems}
                  onConfigChange={handleConfigurationChange}
                />

                {/* Export Preview */}
                {selectedItems?.length > 0 && (
                  <ExportPreview
                    selectedItems={selectedItems}
                    configuration={exportConfiguration}
                  />
                )}

                {/* Export Actions */}
                {selectedItems?.length > 0 && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Ready to Export</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedItems?.length} datasets selected • {exportConfiguration?.format?.toUpperCase()} format
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => setSelectedItems([])}
                          disabled={isExporting}
                        >
                          Clear Selection
                        </Button>
                        <Button
                          variant="default"
                          size="default"
                          onClick={handleStartExport}
                          loading={isExporting}
                          iconName="Download"
                          iconPosition="left"
                          disabled={selectedItems?.length === 0}
                        >
                          {isExporting ? 'Processing...' : 'Start Export'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'scheduled' && (
            <div className="max-w-4xl mx-auto">
              <ScheduledExports />
            </div>
          )}

          {activeTab === 'queue' && (
            <div className="max-w-4xl mx-auto">
              <ExportQueueComponent />
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-muted/30 border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                  <Icon name="Database" size={24} color="var(--color-primary)" />
                </div>
                <div className="text-lg font-semibold text-foreground">156</div>
                <div className="text-sm text-muted-foreground">Available Datasets</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
                  <Icon name="FileText" size={24} color="var(--color-accent)" />
                </div>
                <div className="text-lg font-semibold text-foreground">6</div>
                <div className="text-sm text-muted-foreground">Export Formats</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mx-auto mb-2">
                  <Icon name="CalendarClock" size={24} color="var(--color-secondary)" />
                </div>
                <div className="text-lg font-semibold text-foreground">3</div>
                <div className="text-sm text-muted-foreground">Active Schedules</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mx-auto mb-2">
                  <Icon name="Download" size={24} color="var(--color-success)" />
                </div>
                <div className="text-lg font-semibold text-foreground">1,247</div>
                <div className="text-sm text-muted-foreground">Total Exports</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Export Queue in Header */}
      <div className="fixed top-16 right-6 z-30">
        <ExportQueue />
      </div>
    </div>
  );
};

export default DataExport;