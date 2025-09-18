import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalysisResults = ({ analysisData, onExportResults }) => {
  const [activeTab, setActiveTab] = useState('correlations');
  const [isExpanded, setIsExpanded] = useState(true);

  const correlationResults = [
    {
      id: 1,
      parameter1: 'Temperature',
      parameter2: 'Fish Abundance',
      coefficient: -0.78,
      pValue: 0.001,
      significance: 'Highly Significant',
      strength: 'Strong Negative',
      interpretation: `Strong negative correlation indicates that as water temperature increases, fish abundance decreases significantly. This relationship is statistically significant (p < 0.001).`
    },
    {
      id: 2,
      parameter1: 'Salinity',
      parameter2: 'Fish Abundance',
      coefficient: 0.65,
      pValue: 0.012,
      significance: 'Significant',
      strength: 'Moderate Positive',
      interpretation: `Moderate positive correlation suggests that higher salinity levels are associated with increased fish abundance. This relationship is statistically significant (p < 0.05).`
    },
    {
      id: 3,
      parameter1: 'Depth',
      parameter2: 'Temperature',
      coefficient: -0.23,
      pValue: 0.156,
      significance: 'Not Significant',
      strength: 'Weak Negative',
      interpretation: `Weak negative correlation between depth and temperature. This relationship is not statistically significant (p > 0.05).`
    }
  ];

  const trendAnalysis = [
    {
      parameter: 'Temperature',
      trend: 'Increasing',
      slope: 0.15,
      rSquared: 0.82,
      forecast: 'Temperature expected to rise by 1.8°C over next 12 months',
      confidence: '95%'
    },
    {
      parameter: 'Fish Abundance',
      trend: 'Decreasing',
      slope: -2.3,
      rSquared: 0.67,
      forecast: 'Fish count projected to decrease by 27.6 individuals over next 12 months',
      confidence: '90%'
    },
    {
      parameter: 'Salinity',
      trend: 'Stable',
      slope: 0.02,
      rSquared: 0.15,
      forecast: 'Salinity levels expected to remain relatively stable',
      confidence: '85%'
    }
  ];

  const aiInsights = [
    {
      type: 'pattern',
      title: 'Seasonal Temperature Pattern Detected',
      description: `Analysis reveals a clear seasonal temperature cycle with peak temperatures in July-August (26.1°C) and lowest in January (18.5°C). This 7.6°C variation significantly impacts fish distribution patterns.`,
      confidence: 94,
      actionable: true
    },
    {
      type: 'anomaly',
      title: 'Unusual Fish Abundance Spike',
      description: `April shows an unexpected fish abundance peak (312 individuals) despite rising temperatures. This anomaly suggests potential spawning season or food source availability.`,
      confidence: 87,
      actionable: true
    },
    {
      type: 'prediction',
      title: 'Ecosystem Stress Indicator',
      description: `Current temperature trends combined with decreasing fish abundance suggest potential ecosystem stress. Recommend monitoring dissolved oxygen levels and implementing conservation measures.`,
      confidence: 91,
      actionable: true
    }
  ];

  const getSignificanceColor = (pValue) => {
    if (pValue < 0.001) return 'text-success';
    if (pValue < 0.05) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getCorrelationStrength = (coefficient) => {
    const abs = Math.abs(coefficient);
    if (abs >= 0.7) return { label: 'Strong', color: 'text-primary' };
    if (abs >= 0.4) return { label: 'Moderate', color: 'text-warning' };
    return { label: 'Weak', color: 'text-muted-foreground' };
  };

  const getTrendIcon = (trend) => {
    switch (trend?.toLowerCase()) {
      case 'increasing': return 'TrendingUp';
      case 'decreasing': return 'TrendingDown';
      case 'stable': return 'Minus';
      default: return 'Activity';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'pattern': return 'Zap';
      case 'anomaly': return 'AlertTriangle';
      case 'prediction': return 'Brain';
      default: return 'Info';
    }
  };

  const tabs = [
    { id: 'correlations', label: 'Correlations', icon: 'GitBranch' },
    { id: 'trends', label: 'Trends', icon: 'TrendingUp' },
    { id: 'insights', label: 'AI Insights', icon: 'Brain' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg transition-all duration-300 ${isExpanded ? 'w-96' : 'w-12'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {isExpanded && (
          <div>
            <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
            <p className="text-sm text-muted-foreground">Statistical findings and insights</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? "ChevronRight" : "ChevronLeft"}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      {isExpanded && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab?.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span className="hidden sm:inline">{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 h-96 overflow-y-auto">
            {activeTab === 'correlations' && (
              <div className="space-y-4">
                {correlationResults?.map((result) => (
                  <div key={result?.id} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">
                        {result?.parameter1} vs {result?.parameter2}
                      </h4>
                      <span className={`text-lg font-bold ${result?.coefficient >= 0 ? 'text-success' : 'text-error'}`}>
                        {result?.coefficient?.toFixed(2)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Strength:</span>
                        <span className={getCorrelationStrength(result?.coefficient)?.color}>
                          {getCorrelationStrength(result?.coefficient)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">p-value:</span>
                        <span className={getSignificanceColor(result?.pValue)}>
                          {result?.pValue?.toFixed(3)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {result?.interpretation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-4">
                {trendAnalysis?.map((trend, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">{trend?.parameter}</h4>
                      <div className="flex items-center space-x-2">
                        <Icon name={getTrendIcon(trend?.trend)} size={16} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">{trend?.trend}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Slope:</span>
                        <span className="text-foreground">{trend?.slope}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">R²:</span>
                        <span className="text-foreground">{trend?.rSquared}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="text-foreground">{trend?.confidence}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {trend?.forecast}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-4">
                {aiInsights?.map((insight, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <Icon name={getInsightIcon(insight?.type)} size={16} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground mb-1">{insight?.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{insight?.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Confidence: {insight?.confidence}%
                          </span>
                          {insight?.actionable && (
                            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                              Actionable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Download"
                onClick={() => onExportResults('pdf')}
              >
                Export Report
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                iconName="Share"
              >
                Share
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisResults;