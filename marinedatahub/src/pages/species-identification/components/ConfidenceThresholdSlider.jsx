import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ConfidenceThresholdSlider = ({ threshold, onThresholdChange, results }) => {
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleSliderChange = (e) => {
    const value = parseInt(e?.target?.value);
    onThresholdChange(value);
  };

  const getThresholdColor = (threshold) => {
    if (threshold >= 90) return 'text-success';
    if (threshold >= 70) return 'text-warning';
    return 'text-error';
  };

  const getThresholdBg = (threshold) => {
    if (threshold >= 90) return 'bg-success';
    if (threshold >= 70) return 'bg-warning';
    return 'bg-error';
  };

  const getFilteredResultsCount = () => {
    if (!results) return 0;
    return results?.filter(result => result?.confidence >= threshold)?.length;
  };

  const getThresholdLabel = (threshold) => {
    if (threshold >= 95) return 'Very High Confidence';
    if (threshold >= 90) return 'High Confidence';
    if (threshold >= 80) return 'Good Confidence';
    if (threshold >= 70) return 'Moderate Confidence';
    if (threshold >= 60) return 'Low Confidence';
    return 'Very Low Confidence';
  };

  const presetThresholds = [
    { value: 95, label: '95%', description: 'Research Grade' },
    { value: 90, label: '90%', description: 'High Quality' },
    { value: 80, label: '80%', description: 'Standard' },
    { value: 70, label: '70%', description: 'Exploratory' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Sliders" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Confidence Threshold</h3>
          <p className="text-sm text-muted-foreground">
            Filter results by minimum confidence level
          </p>
        </div>
      </div>
      {/* Current Threshold Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Current Threshold</span>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${getThresholdColor(threshold)}`}>
              {threshold}%
            </span>
            <div className={`px-2 py-1 rounded text-xs font-medium text-white ${getThresholdBg(threshold)}`}>
              {getThresholdLabel(threshold)}
            </div>
          </div>
        </div>
        
        {results && (
          <div className="text-sm text-muted-foreground">
            Showing {getFilteredResultsCount()} of {results?.length} results
          </div>
        )}
      </div>
      {/* Slider */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="range"
            min="50"
            max="99"
            value={threshold}
            onChange={handleSliderChange}
            onMouseDown={() => setIsAdjusting(true)}
            onMouseUp={() => setIsAdjusting(false)}
            onTouchStart={() => setIsAdjusting(true)}
            onTouchEnd={() => setIsAdjusting(false)}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, var(--color-error) 0%, var(--color-warning) 50%, var(--color-success) 100%)`
            }}
          />
          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm pointer-events-none"
            style={{ left: `calc(${((threshold - 50) / 49) * 100}% - 8px)` }}
          ></div>
        </div>
        
        {/* Scale Labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>50%</span>
          <span>60%</span>
          <span>70%</span>
          <span>80%</span>
          <span>90%</span>
          <span>99%</span>
        </div>
      </div>
      {/* Preset Buttons */}
      <div className="mb-4">
        <p className="text-sm font-medium text-foreground mb-3">Quick Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {presetThresholds?.map((preset) => (
            <button
              key={preset?.value}
              onClick={() => onThresholdChange(preset?.value)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                threshold === preset?.value
                  ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="font-medium text-sm">{preset?.label}</div>
              <div className="text-xs text-muted-foreground">{preset?.description}</div>
            </button>
          ))}
        </div>
      </div>
      {/* Impact Information */}
      <div className="bg-muted/30 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Threshold Guidelines:</p>
            <ul className="space-y-1">
              <li>• <strong>95%+:</strong> Publication-ready identifications</li>
              <li>• <strong>90%+:</strong> High confidence for research use</li>
              <li>• <strong>80%+:</strong> Good for preliminary analysis</li>
              <li>• <strong>70%+:</strong> Requires expert validation</li>
            </ul>
          </div>
        </div>
      </div>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--color-primary);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--color-primary);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ConfidenceThresholdSlider;