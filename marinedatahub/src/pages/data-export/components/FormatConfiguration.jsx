import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const FormatConfiguration = ({ selectedItems, onConfigChange }) => {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [citationFormat, setCitationFormat] = useState('apa');
  const [imageQuality, setImageQuality] = useState('high');
  const [customFields, setCustomFields] = useState([]);

  const formatOptions = [
    { value: 'csv', label: 'CSV (Comma Separated)', description: 'Best for spreadsheet analysis' },
    { value: 'json', label: 'JSON', description: 'Structured data for APIs' },
    { value: 'xlsx', label: 'Excel Workbook', description: 'Multiple sheets with formatting' },
    { value: 'netcdf', label: 'NetCDF', description: 'Scientific data format' },
    { value: 'pdf', label: 'PDF Report', description: 'Publication-ready document' },
    { value: 'zip', label: 'ZIP Archive', description: 'Multiple formats bundled' }
  ];

  const compressionOptions = [
    { value: 'none', label: 'No Compression' },
    { value: 'low', label: 'Low (Fast)' },
    { value: 'medium', label: 'Medium (Balanced)' },
    { value: 'high', label: 'High (Smallest)' }
  ];

  const citationOptions = [
    { value: 'apa', label: 'APA Style' },
    { value: 'mla', label: 'MLA Style' },
    { value: 'chicago', label: 'Chicago Style' },
    { value: 'ieee', label: 'IEEE Style' },
    { value: 'custom', label: 'Custom Format' }
  ];

  const qualityOptions = [
    { value: 'low', label: 'Low (72 DPI)' },
    { value: 'medium', label: 'Medium (150 DPI)' },
    { value: 'high', label: 'High (300 DPI)' },
    { value: 'lossless', label: 'Lossless (Original)' }
  ];

  const handleConfigurationChange = () => {
    const config = {
      format: selectedFormat,
      includeMetadata,
      compressionLevel,
      citationFormat,
      imageQuality,
      customFields
    };
    onConfigChange(config);
  };

  React.useEffect(() => {
    handleConfigurationChange();
  }, [selectedFormat, includeMetadata, compressionLevel, citationFormat, imageQuality, customFields]);

  const getFormatIcon = (format) => {
    switch (format) {
      case 'csv':
        return 'FileSpreadsheet';
      case 'json':
        return 'Braces';
      case 'xlsx':
        return 'FileSpreadsheet';
      case 'netcdf':
        return 'Database';
      case 'pdf':
        return 'FileText';
      case 'zip':
        return 'Archive';
      default:
        return 'File';
    }
  };

  const estimatedSize = selectedItems?.reduce((total, item) => {
    const sizeMatch = item?.size?.match(/(\d+(?:\.\d+)?)\s*(MB|GB|KB)/);
    if (sizeMatch) {
      const value = parseFloat(sizeMatch?.[1]);
      const unit = sizeMatch?.[2];
      const mbValue = unit === 'GB' ? value * 1024 : unit === 'KB' ? value / 1024 : value;
      return total + mbValue;
    }
    return total;
  }, 0);

  const compressionMultiplier = {
    none: 1,
    low: 0.8,
    medium: 0.6,
    high: 0.4
  };

  const finalSize = estimatedSize * compressionMultiplier?.[compressionLevel];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Export Configuration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure format and options for {selectedItems?.length} selected datasets
        </p>
      </div>
      <div className="p-4 space-y-6">
        {/* Format Selection */}
        <div>
          <Select
            label="Export Format"
            description="Choose the output format for your data"
            options={formatOptions}
            value={selectedFormat}
            onChange={setSelectedFormat}
            searchable
          />
        </div>

        {/* Format-specific Options */}
        {(selectedFormat === 'pdf' || selectedFormat === 'zip') && (
          <div>
            <Select
              label="Image Quality"
              description="Quality setting for images and charts"
              options={qualityOptions}
              value={imageQuality}
              onChange={setImageQuality}
            />
          </div>
        )}

        {/* Metadata Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Metadata Options</label>
          <div className="space-y-2">
            <Checkbox
              label="Include metadata headers"
              description="Add dataset information and collection details"
              checked={includeMetadata}
              onChange={(e) => setIncludeMetadata(e?.target?.checked)}
            />
            <Checkbox
              label="Include processing history"
              description="Add information about data transformations"
              checked
              onChange={() => {}}
            />
            <Checkbox
              label="Include quality metrics"
              description="Add data quality scores and validation results"
             
              onChange={() => {}}
            />
          </div>
        </div>

        {/* Citation Format */}
        <div>
          <Select
            label="Citation Format"
            description="Academic citation style for research use"
            options={citationOptions}
            value={citationFormat}
            onChange={setCitationFormat}
          />
        </div>

        {/* Compression Settings */}
        <div>
          <Select
            label="Compression Level"
            description="Balance between file size and processing time"
            options={compressionOptions}
            value={compressionLevel}
            onChange={setCompressionLevel}
          />
        </div>

        {/* Size Estimation */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Estimated Export Size</span>
            <Icon name="Info" size={16} color="var(--color-muted-foreground)" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Original size:</span>
              <span className="text-foreground">
                {estimatedSize > 1024 ? `${(estimatedSize / 1024)?.toFixed(1)} GB` : `${estimatedSize?.toFixed(0)} MB`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">After compression:</span>
              <span className="text-foreground font-medium">
                {finalSize > 1024 ? `${(finalSize / 1024)?.toFixed(1)} GB` : `${finalSize?.toFixed(0)} MB`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated time:</span>
              <span className="text-foreground">
                {finalSize > 500 ? '15-30 min' : finalSize > 100 ? '5-15 min' : '< 5 min'}
              </span>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Advanced Options
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormatConfiguration;