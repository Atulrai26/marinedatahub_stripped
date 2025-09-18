import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveMap = ({ 
  activeLayers, 
  selectedPoint, 
  onPointSelect, 
  onAreaSelect,
  mapCenter,
  zoomLevel,
  onMapChange 
}) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const mapRef = useRef(null);

  const mockDataPoints = [
    {
      id: 1,
      lat: 36.7783,
      lng: -119.4179,
      temperature: 18.5,
      salinity: 34.2,
      depth: 125,
      timestamp: "2024-12-08T14:30:00Z",
      source: "NOAA Buoy 46042"
    },
    {
      id: 2,
      lat: 37.2431,
      lng: -119.8206,
      temperature: 16.8,
      salinity: 33.9,
      depth: 89,
      timestamp: "2024-12-08T14:25:00Z",
      source: "Research Vessel Atlantis"
    },
    {
      id: 3,
      lat: 36.9741,
      lng: -120.0954,
      temperature: 19.2,
      salinity: 34.5,
      depth: 156,
      timestamp: "2024-12-08T14:20:00Z",
      source: "Satellite Observation"
    },
    {
      id: 4,
      lat: 37.4419,
      lng: -119.6382,
      temperature: 17.3,
      salinity: 34.1,
      depth: 203,
      timestamp: "2024-12-08T14:15:00Z",
      source: "NOAA Buoy 46026"
    }
  ];

  const getPointColor = (point) => {
    if (activeLayers?.includes('temperature')) {
      if (point?.temperature < 15) return '#0066CC';
      if (point?.temperature < 18) return '#33CCFF';
      if (point?.temperature < 20) return '#FFFF00';
      return '#FF3300';
    }
    if (activeLayers?.includes('salinity')) {
      if (point?.salinity < 33) return '#E6F3FF';
      if (point?.salinity < 34) return '#80BFFF';
      if (point?.salinity < 35) return '#4DA6FF';
      return '#0066CC';
    }
    return '#1e40af';
  };

  const handlePointClick = (point) => {
    onPointSelect(point);
  };

  const handleAreaSelection = () => {
    if (isSelectionMode) {
      const mockArea = {
        bounds: {
          north: 37.5,
          south: 36.5,
          east: -119.0,
          west: -120.5
        },
        dataPoints: mockDataPoints?.slice(0, 3),
        avgTemperature: 18.2,
        avgSalinity: 34.2
      };
      setSelectedArea(mockArea);
      onAreaSelect(mockArea);
    }
    setIsSelectionMode(!isSelectionMode);
  };

  const MapTooltip = ({ point, position }) => (
    <div 
      className="absolute z-50 bg-popover border border-border rounded-lg shadow-moderate p-3 pointer-events-none"
      style={{ 
        left: position?.x + 10, 
        top: position?.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="space-y-1">
        <div className="font-medium text-foreground text-sm">Data Point #{point?.id}</div>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <div>Temperature: {point?.temperature}°C</div>
          <div>Salinity: {point?.salinity} PSU</div>
          <div>Depth: {point?.depth}m</div>
          <div>Source: {point?.source}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full bg-muted/30 rounded-lg overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full relative">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Oceanographic Data Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoomLevel}&output=embed`}
          className="absolute inset-0"
        />
        
        {/* Data Points Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {mockDataPoints?.map((point) => (
            <div
              key={point?.id}
              className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((point?.lng + 120) / 1.5) * 100}%`,
                top: `${((37.5 - point?.lat) / 1) * 100}%`
              }}
              onClick={() => handlePointClick(point)}
              onMouseEnter={(e) => setHoveredPoint({ 
                point, 
                position: { x: e?.clientX, y: e?.clientY } 
              })}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:scale-125 ${
                  selectedPoint?.id === point?.id ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                style={{ backgroundColor: getPointColor(point) }}
              />
            </div>
          ))}
        </div>

        {/* Selection Area Overlay */}
        {selectedArea && (
          <div 
            className="absolute border-2 border-primary bg-primary/10 pointer-events-none"
            style={{
              left: '25%',
              top: '30%',
              width: '40%',
              height: '35%'
            }}
          />
        )}
      </div>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          variant={isSelectionMode ? "default" : "outline"}
          size="sm"
          onClick={handleAreaSelection}
          className="bg-card/90 backdrop-blur-sm"
        >
          <Icon name={isSelectionMode ? "Square" : "MousePointer"} size={16} />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMapChange({ ...mapCenter }, Math.min(zoomLevel + 1, 18))}
          className="bg-card/90 backdrop-blur-sm"
        >
          <Icon name="Plus" size={16} />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMapChange({ ...mapCenter }, Math.max(zoomLevel - 1, 3))}
          className="bg-card/90 backdrop-blur-sm"
        >
          <Icon name="Minus" size={16} />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onMapChange({ lat: 37.0, lng: -119.5 }, 10);
            setSelectedArea(null);
            onPointSelect(null);
          }}
          className="bg-card/90 backdrop-blur-sm"
        >
          <Icon name="Home" size={16} />
        </Button>
      </div>
      {/* Coordinates Display */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded px-3 py-2">
        <div className="text-xs text-muted-foreground">
          Center: {mapCenter?.lat?.toFixed(4)}°, {mapCenter?.lng?.toFixed(4)}° | Zoom: {zoomLevel}
        </div>
      </div>
      {/* Selection Mode Indicator */}
      {isSelectionMode && (
        <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Square" size={16} />
            <span className="text-sm font-medium">Area Selection Mode</span>
          </div>
          <div className="text-xs opacity-90 mt-1">Click and drag to select an area</div>
        </div>
      )}
      {/* Tooltip */}
      {hoveredPoint && (
        <MapTooltip 
          point={hoveredPoint?.point} 
          position={hoveredPoint?.position} 
        />
      )}
    </div>
  );
};

export default InteractiveMap;