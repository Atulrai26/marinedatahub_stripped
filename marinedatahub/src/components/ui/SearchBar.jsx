import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';


const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const location = useLocation();

  const searchScopes = {
    '/dashboard': 'Dashboard',
    '/data-ingestion': 'Data Sources',
    '/oceanographic-mapping': 'Ocean Data',
    '/species-identification': 'Species Records',
    '/data-analysis': 'Analysis Results',
    '/data-export': 'Export History'
  };

  const currentScope = searchScopes?.[location?.pathname] || 'All Data';

  const mockResults = [
    {
      id: 1,
      title: 'Pacific Ocean Temperature Dataset',
      type: 'dataset',
      description: 'Temperature measurements from 2023-2024',
      category: 'Oceanographic Data'
    },
    {
      id: 2,
      title: 'Bluefin Tuna Classification',
      type: 'species',
      description: 'AI-identified species from recent surveys',
      category: 'Species Records'
    },
    {
      id: 3,
      title: 'Bathymetry Analysis Report',
      type: 'analysis',
      description: 'Depth analysis for research area 7B',
      category: 'Analysis Results'
    }
  ];

  useEffect(() => {
    if (searchQuery?.length > 2) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setSearchResults(mockResults?.filter(result =>
          result?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          result?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        ));
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (e?.key === 'ArrowDown') {
      e?.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults?.length - 1));
    } else if (e?.key === 'ArrowUp') {
      e?.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e?.key === 'Enter') {
      e?.preventDefault();
      if (selectedIndex >= 0 && searchResults?.[selectedIndex]) {
        handleResultClick(searchResults?.[selectedIndex]);
      }
    } else if (e?.key === 'Escape') {
      setIsExpanded(false);
      inputRef?.current?.blur();
    }
  };

  const handleResultClick = (result) => {
    console.log('Selected result:', result);
    setSearchQuery('');
    setIsExpanded(false);
    setSelectedIndex(-1);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'dataset':
        return 'Database';
      case 'species':
        return 'Fish';
      case 'analysis':
        return 'BarChart3';
      default:
        return 'FileText';
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className={`relative transition-all duration-200 ${isExpanded ? 'z-50' : 'z-10'}`}>
        <div className="relative">
          <Icon
            name="Search"
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={`Search ${currentScope?.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-20 py-2.5 bg-muted/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {currentScope}
            </span>
            {isLoading && (
              <Icon name="Loader2" size={14} className="animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {isExpanded && (searchResults?.length > 0 || searchQuery?.length > 2) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-moderate max-h-80 overflow-y-auto">
            {searchResults?.length > 0 ? (
              <div className="py-2">
                {searchResults?.map((result, index) => (
                  <button
                    key={result?.id}
                    onClick={() => handleResultClick(result)}
                    className={`w-full flex items-start space-x-3 px-4 py-3 text-left hover:bg-muted transition-colors duration-200 ${
                      index === selectedIndex ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon name={getTypeIcon(result?.type)} size={16} color="var(--color-muted-foreground)" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {result?.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {result?.description}
                      </p>
                      <span className="inline-block text-xs text-accent mt-1">
                        {result?.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery?.length > 2 ? (
              <div className="p-6 text-center">
                <Icon name="Search" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
                <p className="text-xs text-muted-foreground mt-1">Try different keywords or check spelling</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;