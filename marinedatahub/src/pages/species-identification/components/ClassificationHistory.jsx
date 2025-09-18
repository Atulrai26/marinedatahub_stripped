import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ClassificationHistory = ({ history, onRerun, onExport, onDelete }) => {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filterOptions = [
    { value: 'all', label: 'All Classifications' },
    { value: 'image', label: 'Image Analysis' },
    { value: 'sequence', label: 'DNA Sequences' },
    { value: 'high-confidence', label: 'High Confidence (>90%)' },
    { value: 'needs-review', label: 'Needs Review (<70%)' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date (Newest)' },
    { value: 'confidence', label: 'Confidence (Highest)' },
    { value: 'species', label: 'Species Name' }
  ];

  const getFilteredHistory = () => {
    let filtered = [...history];

    // Apply filters
    switch (filterType) {
      case 'image':
        filtered = filtered?.filter(item => item?.type === 'image');
        break;
      case 'sequence':
        filtered = filtered?.filter(item => item?.type === 'sequence');
        break;
      case 'high-confidence':
        filtered = filtered?.filter(item => item?.confidence >= 90);
        break;
      case 'needs-review':
        filtered = filtered?.filter(item => item?.confidence < 70);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        filtered?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'confidence':
        filtered?.sort((a, b) => b?.confidence - a?.confidence);
        break;
      case 'species':
        filtered?.sort((a, b) => a?.species?.commonName?.localeCompare(b?.species?.commonName));
        break;
    }

    return filtered;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    return type === 'image' ? 'Image' : 'Dna';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-error';
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Classification History</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport(filteredHistory)}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select
            label="Filter by"
            options={filterOptions}
            value={filterType}
            onChange={setFilterType}
          />
          <Select
            label="Sort by"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>
      {/* History List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredHistory?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="History" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No classification history yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start by uploading images or DNA sequences
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredHistory?.map((item) => (
              <div
                key={item?.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
              >
                {/* Type Icon */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <Icon name={getTypeIcon(item?.type)} size={16} color="var(--color-muted-foreground)" />
                  </div>
                </div>

                {/* Species Image */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item?.species?.image}
                      alt={item?.species?.commonName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item?.species?.commonName}
                    </p>
                    <span className={`text-xs font-medium ${getConfidenceColor(item?.confidence)}`}>
                      {item?.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground italic truncate">
                    {item?.species?.scientificName}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item?.timestamp)}
                    </span>
                    {item?.sampleId && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {item?.sampleId}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRerun(item)}
                    className="h-8 w-8 p-0"
                    title="Rerun analysis"
                  >
                    <Icon name="RotateCcw" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item?.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-error"
                    title="Delete"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Summary Stats */}
      {filteredHistory?.length > 0 && (
        <div className="p-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-foreground">{filteredHistory?.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-success">
                {filteredHistory?.filter(item => item?.confidence >= 90)?.length}
              </p>
              <p className="text-xs text-muted-foreground">High Confidence</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-warning">
                {filteredHistory?.filter(item => item?.confidence < 70)?.length}
              </p>
              <p className="text-xs text-muted-foreground">Need Review</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassificationHistory;