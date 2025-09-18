import React from 'react';
import Icon from '../../../components/AppIcon';

const AIProcessingPanel = ({ isProcessing, progress, currentStep, results }) => {
  const processingSteps = [
    { id: 'upload', label: 'Data Upload', icon: 'Upload' },
    { id: 'preprocessing', label: 'Preprocessing', icon: 'Settings' },
    { id: 'analysis', label: 'AI Analysis', icon: 'Brain' },
    { id: 'matching', label: 'Database Matching', icon: 'Database' },
    { id: 'results', label: 'Results Ready', icon: 'CheckCircle' }
  ];

  const getStepStatus = (stepId) => {
    const stepIndex = processingSteps?.findIndex(step => step?.id === stepId);
    const currentIndex = processingSteps?.findIndex(step => step?.id === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStepIcon = (step) => {
    const status = getStepStatus(step?.id);
    if (status === 'completed') return 'CheckCircle';
    if (status === 'active') return 'Loader2';
    return step?.icon;
  };

  const getStepIconColor = (step) => {
    const status = getStepStatus(step?.id);
    if (status === 'completed') return 'var(--color-success)';
    if (status === 'active') return 'var(--color-primary)';
    return 'var(--color-muted-foreground)';
  };

  if (!isProcessing && !results) {
    return (
      <div className="bg-muted/30 rounded-lg p-6 text-center">
        <Icon name="Zap" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          Upload images or enter DNA sequences to start AI-powered species identification
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Zap" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Processing</h3>
          <p className="text-sm text-muted-foreground">
            {isProcessing ? 'Analyzing your data...' : 'Analysis complete'}
          </p>
        </div>
      </div>
      {/* Progress Bar */}
      {isProcessing && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      {/* Processing Steps */}
      <div className="space-y-4">
        {processingSteps?.map((step, index) => {
          const status = getStepStatus(step?.id);
          const isActive = status === 'active';
          const isCompleted = status === 'completed';
          
          return (
            <div
              key={step?.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-primary/5 border border-primary/20' : 
                isCompleted ? 'bg-success/5' : 'bg-muted/30'
              }`}
            >
              <div className={`flex-shrink-0 ${isActive ? 'animate-spin' : ''}`}>
                <Icon
                  name={getStepIcon(step)}
                  size={20}
                  color={getStepIconColor(step)}
                />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isCompleted ? 'text-success' : isActive ?'text-primary' : 'text-muted-foreground'
                }`}>
                  {step?.label}
                </p>
                {isActive && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step?.id === 'preprocessing' && 'Optimizing image quality and extracting features...'}
                    {step?.id === 'analysis' && 'Running neural network classification...'}
                    {step?.id === 'matching' && 'Comparing against species database...'}
                  </p>
                )}
              </div>
              {isCompleted && (
                <div className="text-xs text-success font-medium">
                  ✓ Done
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Processing Stats */}
      {isProcessing && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-foreground">2.3s</p>
              <p className="text-xs text-muted-foreground">Avg. Time</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">98.7%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">15K+</p>
              <p className="text-xs text-muted-foreground">Species DB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIProcessingPanel;