import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ResponsiveContainer, BarChart, Bar } from 'recharts';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ChartVisualization = ({ analysisData, chartConfig, onChartConfigChange }) => {
  const [chartType, setChartType] = useState('line');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const chartRef = useRef(null);

  const chartTypeOptions = [
    { value: 'line', label: 'Line Chart', description: 'Trend visualization' },
    { value: 'scatter', label: 'Scatter Plot', description: 'Correlation analysis' },
    { value: 'bar', label: 'Bar Chart', description: 'Comparative analysis' },
    { value: 'correlation', label: 'Correlation Matrix', description: 'Multi-parameter correlation' }
  ];

  const mockData = [
    { month: 'Jan', temperature: 18.5, salinity: 35.2, fishCount: 245, depth: 150 },
    { month: 'Feb', temperature: 19.2, salinity: 35.1, fishCount: 267, depth: 148 },
    { month: 'Mar', temperature: 20.1, salinity: 34.9, fishCount: 289, depth: 152 },
    { month: 'Apr', temperature: 21.8, salinity: 34.8, fishCount: 312, depth: 155 },
    { month: 'May', temperature: 23.2, salinity: 34.6, fishCount: 298, depth: 158 },
    { month: 'Jun', temperature: 24.5, salinity: 34.5, fishCount: 276, depth: 160 },
    { month: 'Jul', temperature: 25.8, salinity: 34.3, fishCount: 254, depth: 162 },
    { month: 'Aug', temperature: 26.1, salinity: 34.2, fishCount: 231, depth: 165 },
    { month: 'Sep', temperature: 24.9, salinity: 34.4, fishCount: 258, depth: 163 },
    { month: 'Oct', temperature: 22.7, salinity: 34.7, fishCount: 285, depth: 159 },
    { month: 'Nov', temperature: 20.3, salinity: 34.9, fishCount: 301, depth: 156 },
    { month: 'Dec', temperature: 18.9, salinity: 35.0, fishCount: 273, depth: 153 }
  ];

  const correlationData = [
    { parameter1: 'Temperature', parameter2: 'Fish Count', correlation: -0.78, significance: 0.001 },
    { parameter1: 'Salinity', parameter2: 'Fish Count', correlation: 0.65, significance: 0.012 },
    { parameter1: 'Depth', parameter2: 'Temperature', correlation: -0.23, significance: 0.156 },
    { parameter1: 'Temperature', parameter2: 'Salinity', correlation: -0.89, significance: 0.000 }
  ];

  const handleZoom = (direction) => {
    const newZoom = direction === 'in' ? Math.min(zoomLevel + 25, 200) : Math.max(zoomLevel - 25, 50);
    setZoomLevel(newZoom);
  };

  const exportChart = (format) => {
    console.log(`Exporting chart as ${format}`);
    // Simulate export functionality
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-moderate">
          <p className="text-sm font-medium text-foreground mb-2">{`${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${entry?.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      width: '100%',
      height: 400,
      data: mockData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="var(--color-primary)" strokeWidth={2} name="Temperature (°C)" />
              <Line type="monotone" dataKey="fishCount" stroke="var(--color-accent)" strokeWidth={2} name="Fish Count" />
              <Line type="monotone" dataKey="salinity" stroke="var(--color-secondary)" strokeWidth={2} name="Salinity (PSU)" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="temperature" stroke="var(--color-muted-foreground)" name="Temperature" />
              <YAxis dataKey="fishCount" stroke="var(--color-muted-foreground)" name="Fish Count" />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="Temperature vs Fish Count" fill="var(--color-primary)" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="fishCount" fill="var(--color-primary)" name="Fish Count" />
              <Bar dataKey="temperature" fill="var(--color-accent)" name="Temperature" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'correlation':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Correlation Matrix</h3>
            <div className="space-y-3">
              {correlationData?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {item?.parameter1} vs {item?.parameter2}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Significance: p = {item?.significance}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      Math.abs(item?.correlation) > 0.7 ? 'text-primary' : 
                      Math.abs(item?.correlation) > 0.4 ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                      {item?.correlation?.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.abs(item?.correlation) > 0.7 ? 'Strong' : 
                       Math.abs(item?.correlation) > 0.4 ? 'Moderate' : 'Weak'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${isFullscreen ? 'fixed inset-4 z-50' : 'h-full'}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Data Visualization</h3>
          <Select
            options={chartTypeOptions}
            value={chartType}
            onChange={setChartType}
            className="w-48"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="ZoomIn"
            onClick={() => handleZoom('in')}
            disabled={zoomLevel >= 200}
          />
          <span className="text-sm text-muted-foreground">{zoomLevel}%</span>
          <Button
            variant="ghost"
            size="sm"
            iconName="ZoomOut"
            onClick={() => handleZoom('out')}
            disabled={zoomLevel <= 50}
          />
          <Button
            variant="ghost"
            size="sm"
            iconName={isFullscreen ? "Minimize2" : "Maximize2"}
            onClick={() => setIsFullscreen(!isFullscreen)}
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            onClick={() => exportChart('png')}
          />
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-4" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
        <div ref={chartRef} className="w-full">
          {renderChart()}
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" iconName="RotateCcw">
            Reset View
          </Button>
          <Button variant="ghost" size="sm" iconName="Settings">
            Chart Settings
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Export:</span>
          <Button variant="ghost" size="sm" onClick={() => exportChart('png')}>PNG</Button>
          <Button variant="ghost" size="sm" onClick={() => exportChart('svg')}>SVG</Button>
          <Button variant="ghost" size="sm" onClick={() => exportChart('pdf')}>PDF</Button>
        </div>
      </div>
    </div>
  );
};

export default ChartVisualization;