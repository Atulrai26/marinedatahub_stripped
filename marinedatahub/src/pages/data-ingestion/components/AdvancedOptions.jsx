import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedOptions = ({ isExpanded, onToggle, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const dataSourceOptions = [
    { value: 'research_vessel', label: 'Research Vessel' },
    { value: 'satellite', label: 'Satellite Data' },
    { value: 'buoy_station', label: 'Buoy Station' },
    { value: 'laboratory', label: 'Laboratory Analysis' },
    { value: 'field_survey', label: 'Field Survey' },
    { value: 'citizen_science', label: 'Citizen Science' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const qualityLevelOptions = [
    { value: 'basic', label: 'Basic Validation' },
    { value: 'standard', label: 'Standard Quality Check' },
    { value: 'comprehensive', label: 'Comprehensive Analysis' },
    { value: 'research_grade', label: 'Research Grade' }
  ];

  const handleSettingChange = (key, value) => {
    const updatedSettings = { ...localSettings, [key]: value };
    setLocalSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  const handleApplySettings = () => {
    onSettingsChange(localSettings);
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      dataSource: 'research_vessel',
      priority: 'normal',
      qualityLevel: 'standard',
      autoMetadata: true,
      batchProcessing: true,
      notifyOnComplete: true,
      customTags: '',
      projectName: '',
      researcherName: '',
      institutionName: ''
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  if (!isExpanded) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <Button
          variant="ghost"
          onClick={onToggle}
          iconName="Settings"
          iconPosition="left"
          className="w-full justify-start"
        >
          Advanced Processing Options
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Advanced Options</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          iconName="ChevronUp"
        >
          Collapse
        </Button>
      </div>
      <div className="space-y-6">
        {/* Data Source Configuration */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Data Source Configuration</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Data Source Type"
              options={dataSourceOptions}
              value={localSettings?.dataSource}
              onChange={(value) => handleSettingChange('dataSource', value)}
            />
            
            <Select
              label="Processing Priority"
              options={priorityOptions}
              value={localSettings?.priority}
              onChange={(value) => handleSettingChange('priority', value)}
            />
          </div>

          <Select
            label="Quality Validation Level"
            description="Higher levels provide more thorough validation but take longer"
            options={qualityLevelOptions}
            value={localSettings?.qualityLevel}
            onChange={(value) => handleSettingChange('qualityLevel', value)}
          />
        </div>

        {/* Processing Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Processing Options</h4>
          
          <div className="space-y-3">
            <Checkbox
              label="Auto-generate metadata tags"
              description="Automatically extract and tag metadata from file headers"
              checked={localSettings?.autoMetadata}
              onChange={(e) => handleSettingChange('autoMetadata', e?.target?.checked)}
            />
            
            <Checkbox
              label="Enable batch processing"
              description="Process multiple files simultaneously for faster throughput"
              checked={localSettings?.batchProcessing}
              onChange={(e) => handleSettingChange('batchProcessing', e?.target?.checked)}
            />
            
            <Checkbox
              label="Notify on completion"
              description="Send notification when processing is complete"
              checked={localSettings?.notifyOnComplete}
              onChange={(e) => handleSettingChange('notifyOnComplete', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Metadata Fields */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Custom Metadata</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Project Name"
              placeholder="e.g., Pacific Marine Survey 2024"
              value={localSettings?.projectName}
              onChange={(e) => handleSettingChange('projectName', e?.target?.value)}
            />
            
            <Input
              label="Researcher Name"
              placeholder="Lead researcher or PI"
              value={localSettings?.researcherName}
              onChange={(e) => handleSettingChange('researcherName', e?.target?.value)}
            />
          </div>

          <Input
            label="Institution Name"
            placeholder="Research institution or organization"
            value={localSettings?.institutionName}
            onChange={(e) => handleSettingChange('institutionName', e?.target?.value)}
          />

          <Input
            label="Custom Tags"
            placeholder="Comma-separated tags (e.g., temperature, salinity, biodiversity)"
            value={localSettings?.customTags}
            onChange={(e) => handleSettingChange('customTags', e?.target?.value)}
            description="Add custom tags to help categorize and search your data"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleResetSettings}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset to Defaults
          </Button>
          
          <Button
            variant="default"
            onClick={handleApplySettings}
            iconName="Check"
            iconPosition="left"
          >
            Apply Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedOptions;