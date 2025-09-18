import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportPreview = ({ selectedItems, configuration }) => {
  const [previewType, setPreviewType] = useState('structure');
  const [expandedSections, setExpandedSections] = useState(['metadata']);

  const sampleData = {
    csv: `species_id,common_name,scientific_name,temperature,salinity,depth,location_lat,location_lng,date_collected
1,Bluefin Tuna,Thunnus thynnus,18.5,35.2,45.2,40.7128,-74.0060,2024-03-15
2,Atlantic Cod,Gadus morhua,12.3,34.8,120.5,41.2033,-70.0589,2024-03-16
3,Yellowfin Tuna,Thunnus albacares,22.1,35.5,25.8,39.9526,-75.1652,2024-03-17`,
    json: `{
  "export_metadata": {
    "generated_at": "2024-09-09T14:36:14Z",
    "format": "json",
    "total_records": 1247,
    "datasets_included": ["temperature_2024", "species_classifications"]
  },
  "data": [
    {
      "species_id": 1,
      "common_name": "Bluefin Tuna",
      "scientific_name": "Thunnus thynnus",
      "environmental_data": {
        "temperature": 18.5,
        "salinity": 35.2,
        "depth": 45.2
      },
      "location": {
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "collection_date": "2024-03-15T10:30:00Z"
    }
  ]
}`,
    structure: [
      {
        section: 'Metadata',
        fields: [
          { name: 'export_id', type: 'string', description: 'Unique export identifier' },
          { name: 'generated_at', type: 'datetime', description: 'Export generation timestamp' },
          { name: 'format_version', type: 'string', description: 'Data format version' },
          { name: 'total_records', type: 'integer', description: 'Total number of records' }
        ]
      },
      {
        section: 'Species Data',
        fields: [
          { name: 'species_id', type: 'integer', description: 'Unique species identifier' },
          { name: 'common_name', type: 'string', description: 'Common species name' },
          { name: 'scientific_name', type: 'string', description: 'Scientific nomenclature' },
          { name: 'confidence_score', type: 'float', description: 'AI identification confidence (0-1)' }
        ]
      },
      {
        section: 'Environmental Data',
        fields: [
          { name: 'temperature', type: 'float', description: 'Water temperature (°C)' },
          { name: 'salinity', type: 'float', description: 'Salinity (PSU)' },
          { name: 'depth', type: 'float', description: 'Depth (meters)' },
          { name: 'ph_level', type: 'float', description: 'pH measurement' }
        ]
      }
    ]
  };

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev?.includes(section)
        ? prev?.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getPreviewContent = () => {
    switch (previewType) {
      case 'csv':
        return (
          <pre className="text-xs text-foreground font-mono bg-muted/30 p-4 rounded-lg overflow-x-auto">
            {sampleData?.csv}
          </pre>
        );
      case 'json':
        return (
          <pre className="text-xs text-foreground font-mono bg-muted/30 p-4 rounded-lg overflow-x-auto">
            {sampleData?.json}
          </pre>
        );
      case 'structure':
        return (
          <div className="space-y-4">
            {sampleData?.structure?.map((section) => (
              <div key={section?.section} className="border border-border rounded-lg">
                <button
                  onClick={() => toggleSection(section?.section)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
                >
                  <span className="font-medium text-foreground">{section?.section}</span>
                  <Icon
                    name={expandedSections?.includes(section?.section) ? 'ChevronDown' : 'ChevronRight'}
                    size={16}
                  />
                </button>
                {expandedSections?.includes(section?.section) && (
                  <div className="border-t border-border">
                    <div className="p-3 space-y-2">
                      {section?.fields?.map((field) => (
                        <div key={field?.name} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-32">
                            <span className="text-sm font-mono text-foreground">{field?.name}</span>
                          </div>
                          <div className="flex-shrink-0 w-16">
                            <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                              {field?.type}
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm text-muted-foreground">{field?.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const validationResults = [
    { type: 'success', message: 'All selected datasets are compatible' },
    { type: 'warning', message: 'Large file size may require extended processing time' },
    { type: 'info', message: 'Metadata will be included in export header' }
  ];

  const getValidationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Icon name="CheckCircle" size={16} color="var(--color-success)" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />;
      case 'error':
        return <Icon name="XCircle" size={16} color="var(--color-error)" />;
      case 'info':
        return <Icon name="Info" size={16} color="var(--color-accent)" />;
      default:
        return <Icon name="Circle" size={16} />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Export Preview</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={previewType === 'structure' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewType('structure')}
            >
              Structure
            </Button>
            <Button
              variant={previewType === 'csv' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewType('csv')}
            >
              CSV
            </Button>
            <Button
              variant={previewType === 'json' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewType('json')}
            >
              JSON
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {/* Validation Results */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Validation Results</h4>
          <div className="space-y-2">
            {validationResults?.map((result, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-muted/20">
                <div className="flex-shrink-0 mt-0.5">
                  {getValidationIcon(result?.type)}
                </div>
                <span className="text-sm text-foreground">{result?.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Content */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Sample Output ({previewType?.toUpperCase()})
          </h4>
          <div className="border border-border rounded-lg overflow-hidden">
            {getPreviewContent()}
          </div>
        </div>

        {/* Export Summary */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Export Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Selected datasets:</span>
              <span className="ml-2 text-foreground font-medium">{selectedItems?.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Output format:</span>
              <span className="ml-2 text-foreground font-medium">{configuration?.format?.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Include metadata:</span>
              <span className="ml-2 text-foreground font-medium">
                {configuration?.includeMetadata ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Compression:</span>
              <span className="ml-2 text-foreground font-medium">
                {configuration?.compressionLevel || 'Medium'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPreview;