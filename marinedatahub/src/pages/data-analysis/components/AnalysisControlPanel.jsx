import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AnalysisControlPanel = ({ onAnalysisUpdate, selectedDatasets, onDatasetChange }) => {
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [timeRange, setTimeRange] = useState({ start: '2024-01-01', end: '2024-12-31' });
  const [analysisType, setAnalysisType] = useState('correlation');
  const [statisticalOptions, setStatisticalOptions] = useState({
    regression: false,
    significance: true,
    confidence: '95'
  });

  const datasetOptions = [
    { value: 'ocean_temp', label: 'Ocean Temperature Data', description: '2024 Pacific measurements' },
    { value: 'fish_abundance', label: 'Fish Abundance Records', description: 'Species count data' },
    { value: 'salinity', label: 'Salinity Measurements', description: 'Water salinity levels' },
    { value: 'depth_data', label: 'Bathymetry Data', description: 'Ocean depth measurements' },
    { value: 'current_speed', label: 'Ocean Current Speed', description: 'Current velocity data' }
  ];

  const parameterOptions = [
    { value: 'temperature', label: 'Temperature (°C)' },
    { value: 'salinity', label: 'Salinity (PSU)' },
    { value: 'depth', label: 'Depth (m)' },
    { value: 'fish_count', label: 'Fish Abundance' },
    { value: 'current_speed', label: 'Current Speed (m/s)' },
    { value: 'ph_level', label: 'pH Level' }
  ];

  const analysisTypeOptions = [
    { value: 'correlation', label: 'Correlation Analysis' },
    { value: 'trend', label: 'Trend Analysis' },
    { value: 'regression', label: 'Regression Analysis' },
    { value: 'comparative', label: 'Comparative Analysis' }
  ];

  const confidenceOptions = [
    { value: '90', label: '90%' },
    { value: '95', label: '95%' },
    { value: '99', label: '99%' }
  ];

  const handleParameterChange = (newParameters) => {
    setSelectedParameters(newParameters);
    onAnalysisUpdate({
      parameters: newParameters,
      datasets: selectedDatasets,
      timeRange,
      analysisType,
      statisticalOptions
    });
  };

  const handleTimeRangeChange = (field, value) => {
    const newTimeRange = { ...timeRange, [field]: value };
    setTimeRange(newTimeRange);
    onAnalysisUpdate({
      parameters: selectedParameters,
      datasets: selectedDatasets,
      timeRange: newTimeRange,
      analysisType,
      statisticalOptions
    });
  };

  const handleStatisticalOptionChange = (option, value) => {
    const newOptions = { ...statisticalOptions, [option]: value };
    setStatisticalOptions(newOptions);
    onAnalysisUpdate({
      parameters: selectedParameters,
      datasets: selectedDatasets,
      timeRange,
      analysisType,
      statisticalOptions: newOptions
    });
  };

  const runAnalysis = () => {
    onAnalysisUpdate({
      parameters: selectedParameters,
      datasets: selectedDatasets,
      timeRange,
      analysisType,
      statisticalOptions,
      trigger: 'run'
    });
  };

  return (
    <div className="w-80 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Analysis Controls</h2>
        <p className="text-sm text-muted-foreground">Configure parameters and statistical options</p>
      </div>
      <div className="p-6 space-y-6">
        {/* Data Source Selection */}
        <div>
          <Select
            label="Data Sources"
            description="Select datasets to analyze"
            multiple
            searchable
            options={datasetOptions}
            value={selectedDatasets}
            onChange={onDatasetChange}
            className="mb-4"
          />
        </div>

        {/* Parameter Selection */}
        <div>
          <Select
            label="Analysis Parameters"
            description="Choose parameters for analysis"
            multiple
            searchable
            options={parameterOptions}
            value={selectedParameters}
            onChange={handleParameterChange}
            className="mb-4"
          />
        </div>

        {/* Time Range Controls */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Time Range</h3>
          <div className="space-y-3">
            <Input
              label="Start Date"
              type="date"
              value={timeRange?.start}
              onChange={(e) => handleTimeRangeChange('start', e?.target?.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={timeRange?.end}
              onChange={(e) => handleTimeRangeChange('end', e?.target?.value)}
            />
          </div>
        </div>

        {/* Analysis Type */}
        <div>
          <Select
            label="Analysis Type"
            description="Select analysis method"
            options={analysisTypeOptions}
            value={analysisType}
            onChange={setAnalysisType}
            className="mb-4"
          />
        </div>

        {/* Statistical Options */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Statistical Options</h3>
          <div className="space-y-3">
            <Checkbox
              label="Include Regression Analysis"
              checked={statisticalOptions?.regression}
              onChange={(e) => handleStatisticalOptionChange('regression', e?.target?.checked)}
            />
            <Checkbox
              label="Calculate Significance Testing"
              checked={statisticalOptions?.significance}
              onChange={(e) => handleStatisticalOptionChange('significance', e?.target?.checked)}
            />
            <Select
              label="Confidence Level"
              options={confidenceOptions}
              value={statisticalOptions?.confidence}
              onChange={(value) => handleStatisticalOptionChange('confidence', value)}
              className="mt-3"
            />
          </div>
        </div>

        {/* Custom Formula Input */}
        <div>
          <Input
            label="Custom Formula (Optional)"
            type="text"
            placeholder="e.g., temp * 0.5 + salinity"
            description="Enter custom mathematical formula"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Button
            variant="default"
            fullWidth
            iconName="Play"
            iconPosition="left"
            onClick={runAnalysis}
            disabled={selectedParameters?.length === 0 || selectedDatasets?.length === 0}
          >
            Run Analysis
          </Button>
          <Button
            variant="outline"
            fullWidth
            iconName="Save"
            iconPosition="left"
          >
            Save Configuration
          </Button>
          <Button
            variant="ghost"
            fullWidth
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisControlPanel;