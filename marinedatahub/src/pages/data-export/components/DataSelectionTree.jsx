import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const DataSelectionTree = ({ onSelectionChange }) => {
  const [expandedNodes, setExpandedNodes] = useState(['oceanographic', 'species', 'analysis']);
  const [selectedItems, setSelectedItems] = useState([]);

  const dataTree = [
    {
      id: 'oceanographic',
      name: 'Oceanographic Data',
      type: 'category',
      size: '2.4 GB',
      children: [
        {
          id: 'temp_2024',
          name: 'Temperature Measurements 2024',
          type: 'dataset',
          size: '856 MB',
          records: '1.2M records',
          format: 'NetCDF'
        },
        {
          id: 'salinity_2024',
          name: 'Salinity Data 2024',
          type: 'dataset',
          size: '743 MB',
          records: '980K records',
          format: 'CSV'
        },
        {
          id: 'bathymetry',
          name: 'Bathymetry Survey Results',
          type: 'dataset',
          size: '1.1 GB',
          records: '2.3M points',
          format: 'GeoTIFF'
        }
      ]
    },
    {
      id: 'species',
      name: 'Species Identification',
      type: 'category',
      size: '1.8 GB',
      children: [
        {
          id: 'fish_classifications',
          name: 'Fish Classification Results',
          type: 'dataset',
          size: '234 MB',
          records: '45K specimens',
          format: 'JSON'
        },
        {
          id: 'otolith_images',
          name: 'Otolith Image Database',
          type: 'dataset',
          size: '1.2 GB',
          records: '8.5K images',
          format: 'ZIP'
        },
        {
          id: 'dna_sequences',
          name: 'DNA/eDNA Sequences',
          type: 'dataset',
          size: '456 MB',
          records: '12K sequences',
          format: 'FASTA'
        }
      ]
    },
    {
      id: 'analysis',
      name: 'Analysis Results',
      type: 'category',
      size: '892 MB',
      children: [
        {
          id: 'correlation_analysis',
          name: 'Temperature-Species Correlation',
          type: 'analysis',
          size: '45 MB',
          records: '156 correlations',
          format: 'CSV'
        },
        {
          id: 'trend_analysis',
          name: 'Population Trend Analysis',
          type: 'analysis',
          size: '78 MB',
          records: '89 species',
          format: 'JSON'
        },
        {
          id: 'biodiversity_report',
          name: 'Biodiversity Assessment Report',
          type: 'report',
          size: '123 MB',
          records: '1 report',
          format: 'PDF'
        }
      ]
    }
  ];

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => 
      prev?.includes(nodeId) 
        ? prev?.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const handleItemSelect = (item, checked) => {
    const newSelection = checked 
      ? [...selectedItems, item]
      : selectedItems?.filter(selected => selected?.id !== item?.id);
    
    setSelectedItems(newSelection);
    onSelectionChange(newSelection);
  };

  const handleCategorySelect = (category, checked) => {
    const categoryItems = category?.children || [];
    const newSelection = checked
      ? [...selectedItems?.filter(item => !categoryItems?.some(child => child?.id === item?.id)), ...categoryItems]
      : selectedItems?.filter(item => !categoryItems?.some(child => child?.id === item?.id));
    
    setSelectedItems(newSelection);
    onSelectionChange(newSelection);
  };

  const isItemSelected = (item) => selectedItems?.some(selected => selected?.id === item?.id);
  const isCategorySelected = (category) => {
    const categoryItems = category?.children || [];
    return categoryItems?.length > 0 && categoryItems?.every(child => isItemSelected(child));
  };
  const isCategoryPartiallySelected = (category) => {
    const categoryItems = category?.children || [];
    return categoryItems?.some(child => isItemSelected(child)) && !isCategorySelected(category);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'category':
        return 'Folder';
      case 'dataset':
        return 'Database';
      case 'analysis':
        return 'BarChart3';
      case 'report':
        return 'FileText';
      default:
        return 'File';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Available Datasets</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedItems?.length} selected
            </span>
            <button
              onClick={() => {
                setSelectedItems([]);
                onSelectionChange([]);
              }}
              className="text-sm text-accent hover:text-accent/80 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        {dataTree?.map((category) => (
          <div key={category?.id} className="mb-4 last:mb-0">
            <div className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <button
                onClick={() => toggleNode(category?.id)}
                className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
              >
                <Icon 
                  name={expandedNodes?.includes(category?.id) ? 'ChevronDown' : 'ChevronRight'} 
                  size={16} 
                />
              </button>
              
              <Checkbox
                checked={isCategorySelected(category)}
                indeterminate={isCategoryPartiallySelected(category)}
                onChange={(e) => handleCategorySelect(category, e?.target?.checked)}
                className="flex-shrink-0"
              />
              
              <Icon name={getTypeIcon(category?.type)} size={16} color="var(--color-primary)" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{category?.name}</span>
                  <span className="text-sm text-muted-foreground">{category?.size}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {category?.children?.length || 0} datasets
                </div>
              </div>
            </div>

            {expandedNodes?.includes(category?.id) && category?.children && (
              <div className="ml-8 mt-2 space-y-1">
                {category?.children?.map((item) => (
                  <div
                    key={item?.id}
                    className="flex items-center space-x-3 p-2 hover:bg-muted/30 rounded-lg transition-colors"
                  >
                    <Checkbox
                      checked={isItemSelected(item)}
                      onChange={(e) => handleItemSelect(item, e?.target?.checked)}
                      className="flex-shrink-0"
                    />
                    
                    <Icon name={getTypeIcon(item?.type)} size={14} color="var(--color-muted-foreground)" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground truncate">
                          {item?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{item?.size}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{item?.records}</span>
                        <span>•</span>
                        <span>{item?.format}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataSelectionTree;