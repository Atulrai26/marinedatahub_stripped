import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'data-ingestion',
      title: 'Data Ingestion',
      description: 'Upload and process marine datasets',
      icon: 'Upload',
      color: 'primary',
      route: '/data-ingestion'
    },
    {
      id: 'oceanographic-mapping',
      title: 'Ocean Mapping',
      description: 'Visualize oceanographic parameters',
      icon: 'Map',
      color: 'accent',
      route: '/oceanographic-mapping'
    },
    {
      id: 'species-identification',
      title: 'Species ID',
      description: 'AI-powered species classification',
      icon: 'Search',
      color: 'secondary',
      route: '/species-identification'
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      description: 'Statistical analysis and correlations',
      icon: 'BarChart3',
      color: 'success',
      route: '/data-analysis'
    },
    {
      id: 'data-export',
      title: 'Data Export',
      description: 'Export processed datasets',
      icon: 'Download',
      color: 'warning',
      route: '/data-export'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary hover:bg-primary/20';
      case 'accent':
        return 'bg-accent/10 text-accent hover:bg-accent/20';
      case 'secondary':
        return 'bg-secondary/10 text-secondary hover:bg-secondary/20';
      case 'success':
        return 'bg-success/10 text-success hover:bg-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning hover:bg-warning/20';
      default:
        return 'bg-primary/10 text-primary hover:bg-primary/20';
    }
  };

  const handleActionClick = (route) => {
    navigate(route);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => handleActionClick(action?.route)}
            className="group p-4 rounded-lg border border-border hover:border-primary/20 hover:shadow-subtle transition-all duration-200 text-left"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors duration-200 ${getColorClasses(action?.color)}`}>
              <Icon name={action?.icon} size={24} />
            </div>
            
            <h3 className="text-sm font-medium text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
              {action?.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {action?.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;