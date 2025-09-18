import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectOverview = () => {
  const [activeTab, setActiveTab] = useState('recent');

  const recentUploads = [
    {
      id: 1,
      name: "Pacific_Temperature_2024.csv",
      type: "Oceanographic Data",
      size: "2.4 MB",
      timestamp: "2 hours ago",
      status: "processed"
    },
    {
      id: 2,
      name: "Tuna_Otoliths_Batch_7.zip",
      type: "Species Images",
      size: "15.2 MB",
      timestamp: "4 hours ago",
      status: "processing"
    },
    {
      id: 3,
      name: "eDNA_Samples_Site_12.json",
      type: "Molecular Data",
      size: "890 KB",
      timestamp: "6 hours ago",
      status: "completed"
    }
  ];

  const ongoingAnalyses = [
    {
      id: 1,
      name: "Species Distribution Analysis",
      progress: 75,
      estimatedTime: "15 min remaining",
      type: "AI Classification"
    },
    {
      id: 2,
      name: "Temperature Correlation Study",
      progress: 45,
      estimatedTime: "32 min remaining",
      type: "Statistical Analysis"
    },
    {
      id: 3,
      name: "Bathymetry Mapping",
      progress: 90,
      estimatedTime: "5 min remaining",
      type: "Geospatial Processing"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Icon name="CheckCircle" size={16} color="var(--color-success)" />;
      case 'processing':
        return <Icon name="Loader2" size={16} className="animate-spin text-primary" />;
      case 'processed':
        return <Icon name="Database" size={16} color="var(--color-accent)" />;
      default:
        return <Icon name="FileText" size={16} />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Oceanographic Data':
        return 'Waves';
      case 'Species Images':
        return 'Camera';
      case 'Molecular Data':
        return 'Dna';
      case 'AI Classification':
        return 'Brain';
      case 'Statistical Analysis':
        return 'BarChart3';
      case 'Geospatial Processing':
        return 'Map';
      default:
        return 'FileText';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Project Overview</h2>
        
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'recent' ?'bg-card text-foreground shadow-subtle' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Recent Uploads
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'ongoing' ?'bg-card text-foreground shadow-subtle' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Ongoing Analyses
          </button>
        </div>
      </div>
      <div className="p-6">
        {activeTab === 'recent' && (
          <div className="space-y-4">
            {recentUploads?.map((upload) => (
              <div key={upload?.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="flex-shrink-0">
                  <Icon name={getTypeIcon(upload?.type)} size={20} color="var(--color-muted-foreground)" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{upload?.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">{upload?.type}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{upload?.size}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{upload?.timestamp}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {getStatusIcon(upload?.status)}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ongoing' && (
          <div className="space-y-4">
            {ongoingAnalyses?.map((analysis) => (
              <div key={analysis?.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Icon name={getTypeIcon(analysis?.type)} size={20} color="var(--color-muted-foreground)" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{analysis?.name}</p>
                      <p className="text-xs text-muted-foreground">{analysis?.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{analysis?.estimatedTime}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analysis?.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">{analysis?.progress}% complete</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="default" iconName="Upload" iconPosition="left" className="w-full">
            Upload Data
          </Button>
          <Button variant="outline" iconName="Search" iconPosition="left" className="w-full">
            Identify Species
          </Button>
          <Button variant="outline" iconName="Map" iconPosition="left" className="w-full">
            View Maps
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;