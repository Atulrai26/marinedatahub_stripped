import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityFeed = () => {
  const [filter, setFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'processing_complete',
      title: 'Species Classification Complete',
      description: 'AI identified 47 species from otolith images',
      timestamp: '5 minutes ago',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      id: 2,
      type: 'data_upload',
      title: 'New Dataset Uploaded',
      description: 'Pacific_Temperature_2024.csv processed successfully',
      timestamp: '12 minutes ago',
      icon: 'Upload',
      color: 'primary'
    },
    {
      id: 3,
      type: 'analysis_started',
      title: 'Correlation Analysis Started',
      description: 'Temperature vs Fish Abundance analysis initiated',
      timestamp: '25 minutes ago',
      icon: 'Play',
      color: 'accent'
    },
    {
      id: 4,
      type: 'error',
      title: 'Data Validation Warning',
      description: 'Missing coordinates in 3 records of Site_7_Data.csv',
      timestamp: '1 hour ago',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      id: 5,
      type: 'export_ready',
      title: 'Export Ready for Download',
      description: 'Bathymetry_Analysis_Report.pdf is ready',
      timestamp: '2 hours ago',
      icon: 'Download',
      color: 'secondary'
    },
    {
      id: 6,
      type: 'system_update',
      title: 'AI Model Updated',
      description: 'Species identification accuracy improved to 94.2%',
      timestamp: '3 hours ago',
      icon: 'Zap',
      color: 'accent'
    }
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities?.filter(activity => activity?.type === filter);

  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return 'text-success';
      case 'primary':
        return 'text-primary';
      case 'accent':
        return 'text-accent';
      case 'warning':
        return 'text-warning';
      case 'secondary':
        return 'text-secondary';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Activities', count: activities?.length },
    { value: 'processing_complete', label: 'Completed', count: activities?.filter(a => a?.type === 'processing_complete')?.length },
    { value: 'error', label: 'Warnings', count: activities?.filter(a => a?.type === 'error')?.length },
    { value: 'data_upload', label: 'Uploads', count: activities?.filter(a => a?.type === 'data_upload')?.length }
  ];

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Activity Feed</h2>
          <Button variant="ghost" size="sm">
            <Icon name="RefreshCw" size={16} />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setFilter(option?.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                filter === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {option?.label} ({option?.count})
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {filteredActivities?.map((activity, index) => (
            <div key={activity?.id} className="relative">
              {index < filteredActivities?.length - 1 && (
                <div className="absolute left-6 top-12 w-px h-8 bg-border"></div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center ${getColorClasses(activity?.color)}`}>
                  <Icon name={activity?.icon} size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">{activity?.title}</h4>
                    <span className="text-xs text-muted-foreground">{activity?.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {activity?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 border-t border-border">
        <Button variant="outline" size="sm" className="w-full">
          View All Activities
        </Button>
      </div>
    </div>
  );
};

export default ActivityFeed;