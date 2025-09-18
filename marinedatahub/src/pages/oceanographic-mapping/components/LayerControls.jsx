import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const LayerControls = ({ 
  activeLayers, 
  onLayerToggle, 
  opacity, 
  onOpacityChange,
  timeRange,
  onTimeRangeChange,
  depthFilter,
  onDepthFilterChange 
}) => {
  const availableLayers = [
    {
      id: 'temperature',
      name: 'Sea Surface Temperature',
      icon: 'Thermometer',
      color: '#FF6B35',
      enabled: true
    },
    {
      id: 'salinity',
      name: 'Salinity Levels',
      icon: 'Droplets',
      color: '#4ECDC4',
      enabled: true
    },
    {
      id: 'depth',
      name: 'Bathymetry',
      icon: 'Mountain',
      color: '#8B4513',
      enabled: true
    },
    {
      id: 'currents',
      name: 'Ocean Currents',
      icon: 'Wind',
      color: '#45B7D1',
      enabled: false
    },
    {
      id: 'chlorophyll',
      name: 'Chlorophyll-a',
      icon: 'Leaf',
      color: '#96CEB4',
      enabled: false
    }
  ];

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const depthRanges = [
    { value: 'all', label: 'All Depths' },
    { value: '0-50', label: '0-50m (Surface)' },
    { value: '50-200', label: '50-200m (Shallow)' },
    { value: '200-1000', label: '200-1000m (Mid)' },
    { value: '1000+', label: '1000m+ (Deep)' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Layer Controls</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            availableLayers?.forEach(layer => {
              if (layer?.enabled) onLayerToggle(layer?.id, false);
            });
          }}
        >
          <Icon name="EyeOff" size={14} />
        </Button>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Data Layers</h4>
        {availableLayers?.map((layer) => (
          <div key={layer?.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Checkbox
                checked={activeLayers?.includes(layer?.id)}
                onChange={(e) => onLayerToggle(layer?.id, e?.target?.checked)}
                disabled={!layer?.enabled}
                label={
                  <div className="flex items-center space-x-2">
                    <Icon name={layer?.icon} size={16} color={layer?.color} />
                    <span className={`text-sm ${layer?.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {layer?.name}
                    </span>
                  </div>
                }
              />
              {!layer?.enabled && (
                <span className="text-xs text-warning bg-warning/10 px-2 py-1 rounded">
                  Coming Soon
                </span>
              )}
            </div>
            
            {activeLayers?.includes(layer?.id) && layer?.enabled && (
              <div className="ml-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground w-16">Opacity:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity?.[layer?.id] || 80}
                    onChange={(e) => onOpacityChange(layer?.id, parseInt(e?.target?.value))}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {opacity?.[layer?.id] || 80}%
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="space-y-3 pt-3 border-t border-border">
        <h4 className="text-sm font-medium text-foreground">Time Range</h4>
        <div className="grid grid-cols-2 gap-2">
          {timeRanges?.map((range) => (
            <Button
              key={range?.value}
              variant={timeRange === range?.value ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeRangeChange(range?.value)}
              className="text-xs"
            >
              {range?.label}
            </Button>
          ))}
        </div>
        
        {timeRange === 'custom' && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="datetime-local"
                className="px-2 py-1 text-xs bg-input border border-border rounded"
                defaultValue="2024-12-01T00:00"
              />
              <input
                type="datetime-local"
                className="px-2 py-1 text-xs bg-input border border-border rounded"
                defaultValue="2024-12-08T23:59"
              />
            </div>
          </div>
        )}
      </div>
      <div className="space-y-3 pt-3 border-t border-border">
        <h4 className="text-sm font-medium text-foreground">Depth Filter</h4>
        <div className="space-y-2">
          {depthRanges?.map((depth) => (
            <label key={depth?.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="depthFilter"
                value={depth?.value}
                checked={depthFilter === depth?.value}
                onChange={(e) => onDepthFilterChange(e?.target?.value)}
                className="w-4 h-4 text-primary border-border focus:ring-ring"
              />
              <span className="text-sm text-foreground">{depth?.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            onTimeRangeChange('24h');
            onDepthFilterChange('all');
            availableLayers?.forEach(layer => {
              if (layer?.enabled) onOpacityChange(layer?.id, 80);
            });
          }}
        >
          <Icon name="RotateCcw" size={14} />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default LayerControls;