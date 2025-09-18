import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SpeciesResultCard = ({ species, rank, onViewDetails, onAddToReport }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceBg = (confidence) => {
    if (confidence >= 90) return 'bg-success/10';
    if (confidence >= 70) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getRankBadge = (rank) => {
    const badges = {
      1: { label: 'Best Match', color: 'bg-success text-success-foreground' },
      2: { label: '2nd Match', color: 'bg-primary text-primary-foreground' },
      3: { label: '3rd Match', color: 'bg-secondary text-secondary-foreground' }
    };
    return badges?.[rank] || { label: `${rank}th Match`, color: 'bg-muted text-muted-foreground' };
  };

  const badge = getRankBadge(rank);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-moderate transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}>
              #{rank}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceBg(species?.confidence)} ${getConfidenceColor(species?.confidence)}`}>
              {species?.confidence}% confidence
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <div className="p-4">
        <div className="flex space-x-4">
          {/* Species Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
              <Image
                src={species?.image}
                alt={species?.commonName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Species Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {species?.commonName}
            </h3>
            <p className="text-sm text-muted-foreground italic mb-2">
              {species?.scientificName}
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Icon name="MapPin" size={12} />
                <span>{species?.habitat}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Ruler" size={12} />
                <span>{species?.size}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {/* Taxonomic Information */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Taxonomic Classification</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Family:</span>
                  <span className="ml-2 text-foreground">{species?.taxonomy?.family}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Order:</span>
                  <span className="ml-2 text-foreground">{species?.taxonomy?.order}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Class:</span>
                  <span className="ml-2 text-foreground">{species?.taxonomy?.class}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Phylum:</span>
                  <span className="ml-2 text-foreground">{species?.taxonomy?.phylum}</span>
                </div>
              </div>
            </div>

            {/* Characteristics */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Key Characteristics</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {species?.characteristics}
              </p>
            </div>

            {/* Database Sources */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Reference Sources</h4>
              <div className="flex flex-wrap gap-2">
                {species?.sources?.map((source, index) => (
                  <button
                    key={index}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground hover:bg-muted/80 transition-colors duration-200"
                    onClick={() => window.open(source?.url, '_blank')}
                  >
                    <Icon name="ExternalLink" size={10} />
                    <span>{source?.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Match Details */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Match Analysis</h4>
              <div className="space-y-2">
                {species?.matchDetails?.map((detail, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{detail?.feature}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-1">
                        <div
                          className="bg-primary h-1 rounded-full"
                          style={{ width: `${detail?.score}%` }}
                        ></div>
                      </div>
                      <span className="text-foreground font-medium w-8">{detail?.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(species)}
            iconName="Eye"
            iconPosition="left"
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onAddToReport(species)}
            iconName="Plus"
            iconPosition="left"
            className="flex-1"
          >
            Add to Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpeciesResultCard;