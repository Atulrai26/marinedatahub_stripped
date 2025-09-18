import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CorrelationPanel = ({ selectedPoint, selectedArea, onExport }) => {
  const [chartType, setChartType] = useState('trend');
  const [xParameter, setXParameter] = useState('temperature');
  const [yParameter, setYParameter] = useState('salinity');
  const [timeframe, setTimeframe] = useState('7d');

  const trendData = [
    { time: '00:00', temperature: 16.2, salinity: 33.8, depth: 120 },
    { time: '04:00', temperature: 16.8, salinity: 33.9, depth: 118 },
    { time: '08:00', temperature: 17.5, salinity: 34.1, depth: 115 },
    { time: '12:00', temperature: 18.3, salinity: 34.2, depth: 112 },
    { time: '16:00', temperature: 18.9, salinity: 34.4, depth: 108 },
    { time: '20:00', temperature: 18.1, salinity: 34.3, depth: 110 },
    { time: '24:00', temperature: 17.2, salinity: 34.0, depth: 116 }
  ];

  const correlationData = [
    { temperature: 16.2, salinity: 33.8, depth: 120 },
    { temperature: 16.8, salinity: 33.9, depth: 118 },
    { temperature: 17.5, salinity: 34.1, depth: 115 },
    { temperature: 18.3, salinity: 34.2, depth: 112 },
    { temperature: 18.9, salinity: 34.4, depth: 108 },
    { temperature: 18.1, salinity: 34.3, depth: 110 },
    { temperature: 17.2, salinity: 34.0, depth: 116 },
    { temperature: 19.1, salinity: 34.5, depth: 105 },
    { temperature: 17.8, salinity: 34.2, depth: 113 },
    { temperature: 16.5, salinity: 33.9, depth: 119 }
  ];

  const parameterOptions = [
    { value: 'temperature', label: 'Temperature (°C)' },
    { value: 'salinity', label: 'Salinity (PSU)' },
    { value: 'depth', label: 'Depth (m)' }
  ];

  const timeframeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const calculateCorrelation = (data, xParam, yParam) => {
    const n = data.length;
    const sumX = data.reduce((sum, item) => sum + item[xParam], 0);
    const sumY = data.reduce((sum, item) => sum + item[yParam], 0);
    const sumXY = data.reduce((sum, item) => sum + (item[xParam] * item[yParam]), 0);
    const sumX2 = data.reduce((sum, item) => sum + (item[xParam] * item[xParam]), 0);
    const sumY2 = data.reduce((sum, item) => sum + (item[yParam] * item[yParam]), 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return isNaN(correlation) ? 0 : correlation;
  };

  const correlation = calculateCorrelation(correlationData, xParameter, yParameter);

  const getCorrelationStrength = (corr) => {
    const abs = Math.abs(corr);
    if (abs >= 0.8) return { strength: 'Very Strong', color: 'text-success' };
    if (abs >= 0.6) return { strength: 'Strong', color: 'text-primary' };
    if (abs >= 0.4) return { strength: 'Moderate', color: 'text-warning' };
    if (abs >= 0.2) return { strength: 'Weak', color: 'text-muted-foreground' };
    return { strength: 'Very Weak', color: 'text-error' };
  };

  const correlationInfo = getCorrelationStrength(correlation);

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Correlation Analysis</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={chartType === 'trend' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('trend')}
          >
            <Icon name="TrendingUp" size={16} />
            Trends
          </Button>
          <Button
            variant={chartType === 'scatter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('scatter')}
          >
            <Icon name="Scatter3D" size={16} />
            Scatter
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartType === 'scatter' && (
          <>
            <Select
              label="X-Axis Parameter"
              options={parameterOptions}
              value={xParameter}
              onChange={setXParameter}
            />
            <Select
              label="Y-Axis Parameter"
              options={parameterOptions}
              value={yParameter}
              onChange={setYParameter}
            />
          </>
        )}
        <Select
          label="Time Range"
          options={timeframeOptions}
          value={timeframe}
          onChange={setTimeframe}
        />
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'trend' ? (
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                name="Temperature (°C)"
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="salinity" 
                stroke="var(--color-secondary)" 
                strokeWidth={2}
                name="Salinity (PSU)"
                dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          ) : (
            <ScatterChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                type="number"
                dataKey={xParameter}
                name={parameterOptions.find(p => p.value === xParameter)?.label}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                type="number"
                dataKey={yParameter}
                name={parameterOptions.find(p => p.value === yParameter)?.label}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Scatter 
                fill="var(--color-primary)" 
                fillOpacity={0.7}
                stroke="var(--color-primary)"
                strokeWidth={2}
              />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      {chartType === 'scatter' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {correlation.toFixed(3)}
            </div>
            <div className="text-sm text-muted-foreground">Correlation Coefficient</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${correlationInfo.color}`}>
              {correlationInfo.strength}
            </div>
            <div className="text-sm text-muted-foreground">Relationship Strength</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {(correlation * correlation * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Variance Explained</div>
          </div>
        </div>
      )}

      {/* Selected Data Info */}
      {(selectedPoint || selectedArea) && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium text-foreground mb-3">
            {selectedPoint ? 'Selected Point Data' : 'Selected Area Summary'}
          </h4>
          
          {selectedPoint ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Temperature:</span>
                <div className="font-medium text-foreground">{selectedPoint.temperature}°C</div>
              </div>
              <div>
                <span className="text-muted-foreground">Salinity:</span>
                <div className="font-medium text-foreground">{selectedPoint.salinity} PSU</div>
              </div>
              <div>
                <span className="text-muted-foreground">Depth:</span>
                <div className="font-medium text-foreground">{selectedPoint.depth}m</div>
              </div>
              <div>
                <span className="text-muted-foreground">Source:</span>
                <div className="font-medium text-foreground text-xs">{selectedPoint.source}</div>
              </div>
            </div>
          ) : selectedArea && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Avg Temperature:</span>
                <div className="font-medium text-foreground">{selectedArea.avgTemperature}°C</div>
              </div>
              <div>
                <span className="text-muted-foreground">Avg Salinity:</span>
                <div className="font-medium text-foreground">{selectedArea.avgSalinity} PSU</div>
              </div>
              <div>
                <span className="text-muted-foreground">Data Points:</span>
                <div className="font-medium text-foreground">{selectedArea.dataPoints.length}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Last updated: Dec 8, 2024 at 2:30 PM
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport('chart')}
          >
            <Icon name="Download" size={16} />
            Export Chart
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport('data')}
          >
            <Icon name="FileSpreadsheet" size={16} />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CorrelationPanel;