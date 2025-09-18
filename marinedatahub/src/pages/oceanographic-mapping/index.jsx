import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import QuickUpload from '../../components/ui/QuickUpload';
import ExportQueue from '../../components/ui/ExportQueue';
import SearchBar from '../../components/ui/SearchBar';
import LayerControls from './components/LayerControls';
import InteractiveMap from './components/InteractiveMap';
import MapLegend from './components/MapLegend';
import CorrelationPanel from './components/CorrelationPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const OceanographicMapping = () => {
  const [activeLayers, setActiveLayers] = useState(['temperature', 'salinity']);
  const [layerOpacity, setLayerOpacity] = useState({
    temperature: 80,
    salinity: 70,
    depth: 85
  });
  const [timeRange, setTimeRange] = useState('24h');
  const [depthFilter, setDepthFilter] = useState('all');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.0, lng: -119.5 });
  const [zoomLevel, setZoomLevel] = useState(10);
  const [dataQuality, setDataQuality] = useState('high');
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  const handleLayerToggle = (layerId, enabled) => {
    if (enabled) {
      setActiveLayers(prev => [...prev, layerId]);
    } else {
      setActiveLayers(prev => prev?.filter(id => id !== layerId));
    }
  };

  const handleOpacityChange = (layerId, opacity) => {
    setLayerOpacity(prev => ({
      ...prev,
      [layerId]: opacity
    }));
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Simulate data quality change based on time range
    if (range === '1h' || range === '6h') {
      setDataQuality('high');
    } else if (range === '24h' || range === '7d') {
      setDataQuality('medium');
    } else {
      setDataQuality('low');
    }
  };

  const handleDepthFilterChange = (filter) => {
    setDepthFilter(filter);
  };

  const handlePointSelect = (point) => {
    setSelectedPoint(point);
    setSelectedArea(null);
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setSelectedPoint(null);
  };

  const handleMapChange = (center, zoom) => {
    setMapCenter(center);
    setZoomLevel(zoom);
  };

  const handleExport = (type) => {
    console.log(`Exporting ${type}...`);
    // Export functionality would be implemented here
  };

  const getCurrentLayer = () => {
    if (activeLayers?.includes('temperature')) return 'temperature';
    if (activeLayers?.includes('salinity')) return 'salinity';
    if (activeLayers?.includes('depth')) return 'depth';
    return 'temperature';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Top Navigation Bar */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Map" size={24} color="var(--color-primary)" />
                <h1 className="text-xl font-semibold text-foreground">Oceanographic Mapping</h1>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <span>•</span>
                <span>Pacific Region 7B</span>
                <span>•</span>
                <span>{activeLayers?.length} layers active</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden lg:block w-96">
                <SearchBar />
              </div>
              <ExportQueue />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('current-view')}
              >
                <Icon name="Camera" size={16} />
                <span className="hidden md:inline ml-2">Snapshot</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Left Control Panel */}
          <div className={`bg-card border-r border-border transition-all duration-300 ${
            isControlPanelCollapsed ? 'w-12' : 'w-80'
          }`}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                {!isControlPanelCollapsed && (
                  <h2 className="font-medium text-foreground">Controls</h2>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsControlPanelCollapsed(!isControlPanelCollapsed)}
                  className="h-8 w-8 p-0"
                >
                  <Icon 
                    name={isControlPanelCollapsed ? "ChevronRight" : "ChevronLeft"} 
                    size={16} 
                  />
                </Button>
              </div>
              
              {!isControlPanelCollapsed && (
                <div className="flex-1 overflow-y-auto p-4">
                  <LayerControls
                    activeLayers={activeLayers}
                    onLayerToggle={handleLayerToggle}
                    opacity={layerOpacity}
                    onOpacityChange={handleOpacityChange}
                    timeRange={timeRange}
                    onTimeRangeChange={handleTimeRangeChange}
                    depthFilter={depthFilter}
                    onDepthFilterChange={handleDepthFilterChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4">
              <InteractiveMap
                activeLayers={activeLayers}
                selectedPoint={selectedPoint}
                onPointSelect={handlePointSelect}
                onAreaSelect={handleAreaSelect}
                mapCenter={mapCenter}
                zoomLevel={zoomLevel}
                onMapChange={handleMapChange}
              />
            </div>
          </div>

          {/* Right Legend Panel */}
          <div className={`bg-card border-l border-border transition-all duration-300 ${
            isLegendCollapsed ? 'w-12' : 'w-80'
          }`}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
                  className="h-8 w-8 p-0"
                >
                  <Icon 
                    name={isLegendCollapsed ? "ChevronLeft" : "ChevronRight"} 
                    size={16} 
                  />
                </Button>
                {!isLegendCollapsed && (
                  <h2 className="font-medium text-foreground">Legend</h2>
                )}
              </div>
              
              {!isLegendCollapsed && (
                <div className="flex-1 overflow-y-auto p-4">
                  <MapLegend
                    activeLayer={getCurrentLayer()}
                    dataQuality={dataQuality}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Correlation Panel */}
        <div className="bg-card border-t border-border">
          <div className="p-6">
            <CorrelationPanel
              selectedPoint={selectedPoint}
              selectedArea={selectedArea}
              onExport={handleExport}
            />
          </div>
        </div>
      </main>
      <QuickUpload />
    </div>
  );
};

export default OceanographicMapping;