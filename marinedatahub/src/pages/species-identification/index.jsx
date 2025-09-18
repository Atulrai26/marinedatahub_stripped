import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import QuickUpload from '../../components/ui/QuickUpload';
import ExportQueue from '../../components/ui/ExportQueue';
import SearchBar from '../../components/ui/SearchBar';
import ImageUploadTab from './components/ImageUploadTab';
import SequenceInputTab from './components/SequenceInputTab';
import AIProcessingPanel from './components/AIProcessingPanel';
import SpeciesResultCard from './components/SpeciesResultCard';
import ClassificationHistory from './components/ClassificationHistory';
import BatchProcessing from './components/BatchProcessing';
import ConfidenceThresholdSlider from './components/ConfidenceThresholdSlider';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SpeciesIdentification = () => {
  const [activeTab, setActiveTab] = useState('image');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('upload');
  const [results, setResults] = useState(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [classificationHistory, setClassificationHistory] = useState([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // Mock classification history data
  const mockHistory = [
    {
      id: 1,
      type: 'image',
      species: {
        commonName: 'Atlantic Bluefin Tuna',
        scientificName: 'Thunnus thynnus',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'
      },
      confidence: 94,
      timestamp: new Date(Date.now() - 3600000),
      sampleId: 'IMG_001'
    },
    {
      id: 2,
      type: 'sequence',
      species: {
        commonName: 'Pacific Salmon',
        scientificName: 'Oncorhynchus kisutch',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      },
      confidence: 87,
      timestamp: new Date(Date.now() - 7200000),
      sampleId: 'DNA_002'
    },
    {
      id: 3,
      type: 'image',
      species: {
        commonName: 'European Sea Bass',
        scientificName: 'Dicentrarchus labrax',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
      },
      confidence: 76,
      timestamp: new Date(Date.now() - 10800000),
      sampleId: 'IMG_003'
    }
  ];

  // Mock species results data
  const mockResults = [
    {
      id: 1,
      commonName: 'Atlantic Bluefin Tuna',
      scientificName: 'Thunnus thynnus',
      confidence: 94,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      habitat: 'Atlantic Ocean',
      size: '200-250 cm',
      taxonomy: {
        family: 'Scombridae',
        order: 'Perciformes',
        class: 'Actinopterygii',
        phylum: 'Chordata'
      },
      characteristics: `Large, fast-swimming fish with a streamlined body. Distinguished by metallic blue coloration on the back and silver-white on the belly. Known for their incredible speed and endurance, capable of reaching speeds up to 70 km/h.`,
      sources: [
        { name: 'FishBase', url: 'https://fishbase.org' },
        { name: 'NCBI', url: 'https://ncbi.nlm.nih.gov' },
        { name: 'GBIF', url: 'https://gbif.org' }
      ],
      matchDetails: [
        { feature: 'Body Shape', score: 96 },
        { feature: 'Fin Structure', score: 94 },
        { feature: 'Coloration', score: 92 },
        { feature: 'Size Ratio', score: 90 }
      ]
    },
    {
      id: 2,
      commonName: 'Yellowfin Tuna',
      scientificName: 'Thunnus albacares',
      confidence: 87,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      habitat: 'Tropical/Subtropical Oceans',
      size: '150-200 cm',
      taxonomy: {
        family: 'Scombridae',
        order: 'Perciformes',
        class: 'Actinopterygii',
        phylum: 'Chordata'
      },
      characteristics: `Medium to large tuna species with distinctive yellow fins. Has a torpedo-shaped body optimized for high-speed swimming. The second dorsal and anal fins are bright yellow, giving the species its common name.`,
      sources: [
        { name: 'FishBase', url: 'https://fishbase.org' },
        { name: 'IUCN Red List', url: 'https://iucnredlist.org' }
      ],
      matchDetails: [
        { feature: 'Body Shape', score: 89 },
        { feature: 'Fin Structure', score: 88 },
        { feature: 'Coloration', score: 85 },
        { feature: 'Size Ratio', score: 87 }
      ]
    },
    {
      id: 3,
      commonName: 'Bigeye Tuna',
      scientificName: 'Thunnus obesus',
      confidence: 73,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      habitat: 'Deep Ocean Waters',
      size: '180-200 cm',
      taxonomy: {
        family: 'Scombridae',
        order: 'Perciformes',
        class: 'Actinopterygii',
        phylum: 'Chordata'
      },
      characteristics: `Deep-water tuna species characterized by large eyes adapted for low-light conditions. Has a robust body and can dive to depths of over 500 meters. Important commercial species in many fisheries.`,
      sources: [
        { name: 'FishBase', url: 'https://fishbase.org' },
        { name: 'FAO', url: 'https://fao.org' }
      ],
      matchDetails: [
        { feature: 'Body Shape', score: 75 },
        { feature: 'Fin Structure', score: 72 },
        { feature: 'Coloration', score: 71 },
        { feature: 'Size Ratio', score: 74 }
      ]
    }
  ];

  useEffect(() => {
    setClassificationHistory(mockHistory);
  }, []);

  const handleImageUpload = async (files) => {
    const imageUrls = files?.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file?.name
    }));
    
    setUploadedImages(prev => [...prev, ...imageUrls]);
    await simulateProcessing();
  };

  const handleSequenceSubmit = async (sequenceData) => {
    await simulateProcessing();
  };

  const simulateProcessing = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setCurrentStep('preprocessing');
    setResults(null);

    // Simulate processing steps
    const steps = [
      { step: 'preprocessing', duration: 800 },
      { step: 'analysis', duration: 1500 },
      { step: 'matching', duration: 1200 },
      { step: 'results', duration: 500 }
    ];

    for (let i = 0; i < steps?.length; i++) {
      setCurrentStep(steps?.[i]?.step);
      
      // Simulate progress within each step
      for (let progress = 0; progress <= 100; progress += 10) {
        setProcessingProgress(((i * 100) + progress) / steps?.length);
        await new Promise(resolve => setTimeout(resolve, steps[i].duration / 10));
      }
    }

    // Set results
    setResults(mockResults);
    setIsProcessing(false);
    
    // Add to history
    const newHistoryItem = {
      id: Date.now(),
      type: activeTab,
      species: mockResults?.[0],
      confidence: mockResults?.[0]?.confidence,
      timestamp: new Date(),
      sampleId: activeTab === 'image' ? `IMG_${String(Date.now())?.slice(-3)}` : `DNA_${String(Date.now())?.slice(-3)}`
    };
    
    setClassificationHistory(prev => [newHistoryItem, ...prev]);
  };

  const handleBatchProcess = async (batchData) => {
    setIsBatchProcessing(true);
    // Simulate batch processing
    setTimeout(() => {
      setIsBatchProcessing(false);
    }, 5000);
  };

  const handleViewDetails = (species) => {
    console.log('View details for:', species);
  };

  const handleAddToReport = (species) => {
    console.log('Add to report:', species);
  };

  const handleRerunAnalysis = (historyItem) => {
    console.log('Rerun analysis for:', historyItem);
  };

  const handleExportHistory = (history) => {
    console.log('Export history:', history);
  };

  const handleDeleteHistoryItem = (itemId) => {
    setClassificationHistory(prev => prev?.filter(item => item?.id !== itemId));
  };

  const filteredResults = results ? results?.filter(result => result?.confidence >= confidenceThreshold) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Species Identification</h1>
                <p className="text-muted-foreground mt-2">
                  AI-powered species classification using otolith images and DNA sequences
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <ExportQueue />
                <Button
                  variant="outline"
                  iconName="HelpCircle"
                  iconPosition="left"
                >
                  Help Guide
                </Button>
              </div>
            </div>
            
            <SearchBar />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-8">
              {/* Input Tabs */}
              <div className="bg-card border border-border rounded-lg">
                <div className="border-b border-border">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('image')}
                      className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                        activeTab === 'image' ?'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name="Image" size={16} />
                      <span>Otolith Images</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('sequence')}
                      className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                        activeTab === 'sequence' ?'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name="Dna" size={16} />
                      <span>DNA Sequences</span>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === 'image' ? (
                    <ImageUploadTab
                      onImageUpload={handleImageUpload}
                      uploadedImages={uploadedImages}
                      isProcessing={isProcessing}
                    />
                  ) : (
                    <SequenceInputTab
                      onSequenceSubmit={handleSequenceSubmit}
                      isProcessing={isProcessing}
                    />
                  )}
                </div>
              </div>

              {/* AI Processing Panel */}
              <AIProcessingPanel
                isProcessing={isProcessing}
                progress={processingProgress}
                currentStep={currentStep}
                results={results}
              />

              {/* Results */}
              {filteredResults && filteredResults?.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                      Classification Results
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredResults?.length} results above {confidenceThreshold}% confidence
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredResults?.map((species, index) => (
                      <SpeciesResultCard
                        key={species?.id}
                        species={species}
                        rank={index + 1}
                        onViewDetails={handleViewDetails}
                        onAddToReport={handleAddToReport}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Confidence Threshold */}
              <ConfidenceThresholdSlider
                threshold={confidenceThreshold}
                onThresholdChange={setConfidenceThreshold}
                results={results}
              />

              {/* Classification History */}
              <ClassificationHistory
                history={classificationHistory}
                onRerun={handleRerunAnalysis}
                onExport={handleExportHistory}
                onDelete={handleDeleteHistoryItem}
              />

              {/* Batch Processing */}
              <BatchProcessing
                onBatchProcess={handleBatchProcess}
                isProcessing={isBatchProcessing}
              />
            </div>
          </div>
        </div>
      </div>
      <QuickUpload />
    </div>
  );
};

export default SpeciesIdentification;