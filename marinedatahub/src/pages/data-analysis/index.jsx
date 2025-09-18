import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickUpload from '../../components/ui/QuickUpload';
import ExportQueue from '../../components/ui/ExportQueue';
import SearchBar from '../../components/ui/SearchBar';
import AnalysisControlPanel from './components/AnalysisControlPanel';
import ChartVisualization from './components/ChartVisualization';
import DataTable from './components/DataTable';
import AnalysisResults from './components/AnalysisResults';

const DataAnalysisPage = () => {
  const [selectedDatasets, setSelectedDatasets] = useState(['ocean_temp', 'fish_abundance']);
  const [analysisConfig, setAnalysisConfig] = useState({
    parameters: ['temperature', 'fishCount'],
    timeRange: { start: '2024-01-01', end: '2024-12-31' },
    analysisType: 'correlation',
    statisticalOptions: {
      regression: false,
      significance: true,
      confidence: '95'
    }
  });
  const [chartConfig, setChartConfig] = useState({
    type: 'line',
    zoom: 100,
    fullscreen: false
  });
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);

  useEffect(() => {
    // Simulate initial data load
    setAnalysisData({
      correlations: [],
      trends: [],
      insights: []
    });
  }, []);

  const handleAnalysisUpdate = (newConfig) => {
    setAnalysisConfig(newConfig);
    
    if (newConfig?.trigger === 'run') {
      setIsAnalysisRunning(true);
      // Simulate analysis processing
      setTimeout(() => {
        setIsAnalysisRunning(false);
        setAnalysisData({
          correlations: [
            { parameter1: 'Temperature', parameter2: 'Fish Count', coefficient: -0.78, pValue: 0.001 }
          ],
          trends: [
            { parameter: 'Temperature', trend: 'Increasing', slope: 0.15, rSquared: 0.82 }
          ],
          insights: [
            { type: 'pattern', title: 'Seasonal Pattern Detected', confidence: 94 }
          ]
        });
      }, 2000);
    }
  };

  const handleDatasetChange = (newDatasets) => {
    setSelectedDatasets(newDatasets);
  };

  const handleChartConfigChange = (newConfig) => {
    setChartConfig(newConfig);
  };

  const handleDataUpdate = (newData) => {
    console.log('Data updated:', newData);
  };

  const handleExportResults = (format) => {
    console.log(`Exporting analysis results as ${format}`);
    // Simulate export functionality
  };

  return (
    <>
      <Helmet>
        <title>Data Analysis - MarineDataHub</title>
        <meta name="description" content="Comprehensive trend analysis and correlation plotting between oceanographic parameters and fish abundance data through interactive visualization and statistical tools." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {/* Top Navigation Bar */}
          <div className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Data Analysis</h1>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive trend analysis and correlation plotting
                  </p>
                </div>
                {isAnalysisRunning && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-primary/10 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm text-primary font-medium">Running Analysis...</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <SearchBar />
                <ExportQueue />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex h-[calc(100vh-8rem)]">
            {/* Left Control Panel */}
            <AnalysisControlPanel
              onAnalysisUpdate={handleAnalysisUpdate}
              selectedDatasets={selectedDatasets}
              onDatasetChange={handleDatasetChange}
            />

            {/* Center Content */}
            <div className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
              {/* Chart Visualization */}
              <div className="flex-1">
                <ChartVisualization
                  analysisData={analysisData}
                  chartConfig={chartConfig}
                  onChartConfigChange={handleChartConfigChange}
                />
              </div>

              {/* Data Table */}
              <div className="h-80">
                <DataTable
                  data={analysisData}
                  onDataUpdate={handleDataUpdate}
                />
              </div>
            </div>

            {/* Right Results Panel */}
            <AnalysisResults
              analysisData={analysisData}
              onExportResults={handleExportResults}
            />
          </div>
        </main>

        <QuickUpload />
      </div>
    </>
  );
};

export default DataAnalysisPage;