import React from 'react';

import Button from '../../../components/ui/Button';

const BatchControls = ({ 
  selectedFiles, 
  totalFiles, 
  onSelectAll, 
  onDeselectAll, 
  onProcessSelected, 
  onPauseAll, 
  onResumeAll, 
  isProcessing 
}) => {
  const hasSelection = selectedFiles?.length > 0;
  const allSelected = selectedFiles?.length === totalFiles && totalFiles > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            {hasSelection ? (
              <span>{selectedFiles?.length} of {totalFiles} files selected</span>
            ) : (
              <span>{totalFiles} files total</span>
            )}
          </div>
          
          {totalFiles > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={allSelected ? onDeselectAll : onSelectAll}
                iconName={allSelected ? "Square" : "CheckSquare"}
                iconPosition="left"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          )}
        </div>

        {/* Batch Actions */}
        <div className="flex items-center space-x-2">
          {hasSelection && (
            <Button
              variant="default"
              size="sm"
              onClick={onProcessSelected}
              disabled={isProcessing}
              iconName="Play"
              iconPosition="left"
            >
              Process Selected ({selectedFiles?.length})
            </Button>
          )}
          
          {isProcessing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onPauseAll}
              iconName="Pause"
              iconPosition="left"
            >
              Pause All
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onResumeAll}
              disabled={totalFiles === 0}
              iconName="Play"
              iconPosition="left"
            >
              Resume All
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            disabled={totalFiles === 0}
            iconName="MoreVertical"
          >
            More
          </Button>
        </div>
      </div>
      {/* Processing Status Bar */}
      {isProcessing && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Batch Processing</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((selectedFiles?.length / totalFiles) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedFiles?.length / totalFiles) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchControls;