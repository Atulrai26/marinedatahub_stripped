import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SequenceInputTab = ({ onSequenceSubmit, isProcessing }) => {
  const [sequenceData, setSequenceData] = useState('');
  const [sequenceType, setSequenceType] = useState('dna');
  const [sequenceFormat, setSequenceFormat] = useState('fasta');
  const [sampleInfo, setSampleInfo] = useState({
    sampleId: '',
    location: '',
    date: '',
    depth: ''
  });
  const [validationError, setValidationError] = useState('');

  const sequenceTypeOptions = [
    { value: 'dna', label: 'DNA Sequence' },
    { value: 'edna', label: 'Environmental DNA (eDNA)' },
    { value: 'mitochondrial', label: 'Mitochondrial DNA' },
    { value: 'barcode', label: 'DNA Barcode' }
  ];

  const formatOptions = [
    { value: 'fasta', label: 'FASTA Format' },
    { value: 'raw', label: 'Raw Sequence' },
    { value: 'genbank', label: 'GenBank Format' }
  ];

  const validateSequence = (sequence) => {
    if (!sequence?.trim()) {
      return "Sequence cannot be empty";
    }
    
    if (sequence?.length < 50) {
      return "Sequence too short (minimum 50 base pairs)";
    }
    
    const validBases = /^[ATCGRYSWKMBDHVN\s\n>-]+$/i;
    if (!validBases?.test(sequence)) {
      return "Invalid characters in sequence. Only ATCG and IUPAC codes allowed";
    }
    
    return '';
  };

  const handleSequenceChange = (e) => {
    const value = e?.target?.value;
    setSequenceData(value);
    
    if (value?.trim()) {
      const error = validateSequence(value);
      setValidationError(error);
    } else {
      setValidationError('');
    }
  };

  const handleSubmit = () => {
    const error = validateSequence(sequenceData);
    if (error) {
      setValidationError(error);
      return;
    }
    
    onSequenceSubmit({
      sequence: sequenceData,
      type: sequenceType,
      format: sequenceFormat,
      sampleInfo
    });
  };

  const handleSampleInfoChange = (field, value) => {
    setSampleInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exampleSequences = {
    dna: `>Sample_Fish_DNA_001
ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC
GATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC
GATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC`,
    edna: `>Environmental_Sample_Marine_001
ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC
GATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC`,
    mitochondrial: `>Mitochondrial_COI_Gene
ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC
GATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC`
  };

  const loadExample = () => {
    setSequenceData(exampleSequences?.[sequenceType] || exampleSequences?.dna);
    setValidationError('');
  };

  return (
    <div className="space-y-6">
      {/* Sequence Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Sequence Type"
          options={sequenceTypeOptions}
          value={sequenceType}
          onChange={setSequenceType}
        />
        <Select
          label="Format"
          options={formatOptions}
          value={sequenceFormat}
          onChange={setSequenceFormat}
        />
      </div>
      {/* Sample Information */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Sample Information (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Sample ID"
            placeholder="e.g., FISH_001"
            value={sampleInfo?.sampleId}
            onChange={(e) => handleSampleInfoChange('sampleId', e?.target?.value)}
          />
          <Input
            label="Collection Location"
            placeholder="e.g., Pacific Ocean, 35°N 120°W"
            value={sampleInfo?.location}
            onChange={(e) => handleSampleInfoChange('location', e?.target?.value)}
          />
          <Input
            type="date"
            label="Collection Date"
            value={sampleInfo?.date}
            onChange={(e) => handleSampleInfoChange('date', e?.target?.value)}
          />
          <Input
            type="number"
            label="Depth (meters)"
            placeholder="e.g., 50"
            value={sampleInfo?.depth}
            onChange={(e) => handleSampleInfoChange('depth', e?.target?.value)}
          />
        </div>
      </div>
      {/* Sequence Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            DNA/eDNA Sequence *
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadExample}
            iconName="FileText"
            iconPosition="left"
          >
            Load Example
          </Button>
        </div>
        <textarea
          value={sequenceData}
          onChange={handleSequenceChange}
          placeholder={`Enter your ${sequenceType?.toUpperCase()} sequence here...\n\nExample:\n>Sample_001\nATGCGATCGATCGATCGATC...`}
          className="w-full h-48 p-4 border border-border rounded-lg bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          disabled={isProcessing}
        />
        {validationError && (
          <div className="flex items-center space-x-2 text-error text-sm">
            <Icon name="AlertCircle" size={16} />
            <span>{validationError}</span>
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          Minimum 50 base pairs • Supports FASTA format and IUPAC nucleotide codes
        </div>
      </div>
      {/* Sequence Stats */}
      {sequenceData?.trim() && (
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Sequence Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Length:</span>
              <span className="ml-2 font-medium text-foreground">
                {sequenceData?.replace(/[^ATCGRYSWKMBDHVN]/gi, '')?.length} bp
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">GC Content:</span>
              <span className="ml-2 font-medium text-foreground">
                {(() => {
                  const cleanSeq = sequenceData?.replace(/[^ATCG]/gi, '');
                  const gc = (cleanSeq?.match(/[GC]/gi) || [])?.length;
                  return cleanSeq?.length > 0 ? `${((gc / cleanSeq?.length) * 100)?.toFixed(1)}%` : '0%';
                })()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">A+T:</span>
              <span className="ml-2 font-medium text-foreground">
                {(() => {
                  const cleanSeq = sequenceData?.replace(/[^ATCG]/gi, '');
                  const at = (cleanSeq?.match(/[AT]/gi) || [])?.length;
                  return cleanSeq?.length > 0 ? `${((at / cleanSeq?.length) * 100)?.toFixed(1)}%` : '0%';
                })()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Quality:</span>
              <span className="ml-2 font-medium text-success">
                {sequenceData?.replace(/[^ATCGRYSWKMBDHVN]/gi, '')?.length >= 100 ? 'Good' : 'Fair'}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={handleSubmit}
          disabled={!sequenceData?.trim() || !!validationError || isProcessing}
          loading={isProcessing}
          iconName="Search"
          iconPosition="left"
        >
          {isProcessing ? 'Analyzing Sequence...' : 'Identify Species'}
        </Button>
      </div>
    </div>
  );
};

export default SequenceInputTab;