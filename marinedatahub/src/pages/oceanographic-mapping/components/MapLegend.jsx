import React from 'react';
import Icon from '../../../components/AppIcon';

const MapLegend = ({ activeLayer, dataQuality }) => {
  const legendData = {
    temperature: {
      title: "Sea Surface Temperature",
      unit: "°C",
      scale: [
        { color: "#0066CC", value: "< 5°C", label: "Very Cold" },
        { color: "#0099FF", value: "5-10°C", label: "Cold" },
        { color: "#33CCFF", value: "10-15°C", label: "Cool" },
        { color: "#66FF66", value: "15-20°C", label: "Moderate" },
        { color: "#FFFF00", value: "20-25°C", label: "Warm" },
        { color: "#FF9900", value: "25-30°C", label: "Hot" },
        { color: "#FF3300", value: "> 30°C", label: "Very Hot" }
      ]
    },
    salinity: {
      title: "Salinity Levels",
      unit: "PSU",
      scale: [
        { color: "#E6F3FF", value: "< 30", label: "Brackish" },
        { color: "#B3D9FF", value: "30-32", label: "Low Salinity" },
        { color: "#80BFFF", value: "32-34", label: "Normal" },
        { color: "#4DA6FF", value: "34-36", label: "High Salinity" },
        { color: "#1A8CFF", value: "36-38", label: "Very High" },
        { color: "#0066CC", value: "> 38", label: "Hypersaline" }
      ]
    },
    depth: {
      title: "Bathymetry",
      unit: "meters",
      scale: [
        { color: "#8B4513", value: "0-50m", label: "Shallow" },
        { color: "#A0522D", value: "50-200m", label: "Continental Shelf" },
        { color: "#CD853F", value: "200-1000m", label: "Upper Slope" },
        { color: "#DEB887", value: "1000-3000m", label: "Mid Slope" },
        { color: "#F5DEB3", value: "3000-6000m", label: "Abyssal Plain" },
        { color: "#2F4F4F", value: "> 6000m", label: "Deep Ocean" }
      ]
    }
  };

  const currentLegend = legendData?.[activeLayer] || legendData?.temperature;

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getQualityIcon = (quality) => {
    switch (quality) {
      case 'high': return 'CheckCircle';
      case 'medium': return 'AlertTriangle';
      case 'low': return 'XCircle';
      default: return 'HelpCircle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{currentLegend?.title}</h3>
        <span className="text-sm text-muted-foreground">({currentLegend?.unit})</span>
      </div>
      <div className="space-y-2">
        {currentLegend?.scale?.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded border border-border flex-shrink-0"
              style={{ backgroundColor: item?.color }}
            ></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{item?.value}</span>
                <span className="text-xs text-muted-foreground">{item?.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Data Quality</span>
          <div className={`flex items-center space-x-1 ${getQualityColor(dataQuality)}`}>
            <Icon name={getQualityIcon(dataQuality)} size={14} />
            <span className="text-sm capitalize">{dataQuality}</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Last Updated:</span>
            <span>Dec 8, 2024 14:30</span>
          </div>
          <div className="flex justify-between">
            <span>Data Points:</span>
            <span>2,847 measurements</span>
          </div>
          <div className="flex justify-between">
            <span>Coverage:</span>
            <span>Pacific Region 7B</span>
          </div>
        </div>
      </div>
      <div className="pt-3 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">Data Sources</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-xs text-muted-foreground">NOAA Buoy Network</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span className="text-xs text-muted-foreground">Satellite Observations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-xs text-muted-foreground">Research Vessel Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;