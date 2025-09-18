import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DataTable = ({ data, onDataUpdate }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterConfig, setFilterConfig] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mockTableData = [
    { id: 1, date: '2024-01-15', location: 'Pacific Zone A', temperature: 18.5, salinity: 35.2, fishCount: 245, depth: 150, species: 'Bluefin Tuna' },
    { id: 2, date: '2024-01-16', location: 'Pacific Zone A', temperature: 19.2, salinity: 35.1, fishCount: 267, depth: 148, species: 'Yellowfin Tuna' },
    { id: 3, date: '2024-01-17', location: 'Pacific Zone B', temperature: 20.1, salinity: 34.9, fishCount: 289, depth: 152, species: 'Skipjack Tuna' },
    { id: 4, date: '2024-01-18', location: 'Pacific Zone B', temperature: 21.8, salinity: 34.8, fishCount: 312, depth: 155, species: 'Albacore' },
    { id: 5, date: '2024-01-19', location: 'Pacific Zone C', temperature: 23.2, salinity: 34.6, fishCount: 298, depth: 158, species: 'Bigeye Tuna' },
    { id: 6, date: '2024-01-20', location: 'Pacific Zone C', temperature: 24.5, salinity: 34.5, fishCount: 276, depth: 160, species: 'Bluefin Tuna' },
    { id: 7, date: '2024-01-21', location: 'Pacific Zone A', temperature: 25.8, salinity: 34.3, fishCount: 254, depth: 162, species: 'Yellowfin Tuna' },
    { id: 8, date: '2024-01-22', location: 'Pacific Zone B', temperature: 26.1, salinity: 34.2, fishCount: 231, depth: 165, species: 'Skipjack Tuna' },
    { id: 9, date: '2024-01-23', location: 'Pacific Zone C', temperature: 24.9, salinity: 34.4, fishCount: 258, depth: 163, species: 'Albacore' },
    { id: 10, date: '2024-01-24', location: 'Pacific Zone A', temperature: 22.7, salinity: 34.7, fishCount: 285, depth: 159, species: 'Bigeye Tuna' },
    { id: 11, date: '2024-01-25', location: 'Pacific Zone B', temperature: 20.3, salinity: 34.9, fishCount: 301, depth: 156, species: 'Bluefin Tuna' },
    { id: 12, date: '2024-01-26', location: 'Pacific Zone C', temperature: 18.9, salinity: 35.0, fishCount: 273, depth: 153, species: 'Yellowfin Tuna' }
  ];

  const columns = [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'temperature', label: 'Temperature (°C)', type: 'number' },
    { key: 'salinity', label: 'Salinity (PSU)', type: 'number' },
    { key: 'fishCount', label: 'Fish Count', type: 'number' },
    { key: 'depth', label: 'Depth (m)', type: 'number' },
    { key: 'species', label: 'Primary Species', type: 'text' }
  ];

  const itemsPerPageOptions = [
    { value: '10', label: '10 per page' },
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' }
  ];

  const filteredAndSortedData = useMemo(() => {
    let filtered = mockTableData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(row =>
        Object.values(row)?.some(value =>
          value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        )
      );
    }

    // Apply column filters
    Object.entries(filterConfig)?.forEach(([key, value]) => {
      if (value) {
        filtered = filtered?.filter(row =>
          row?.[key]?.toString()?.toLowerCase()?.includes(value?.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        const aValue = a?.[sortConfig?.key];
        const bValue = b?.[sortConfig?.key];
        
        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, filterConfig, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData?.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilter = (key, value) => {
    setFilterConfig(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const exportData = (format) => {
    console.log(`Exporting ${filteredAndSortedData?.length} rows as ${format}`);
    // Simulate export functionality
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Table Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Data Table</h3>
          <span className="text-sm text-muted-foreground">
            {filteredAndSortedData?.length} records
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Input
            type="search"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-64"
          />
          <Button variant="outline" size="sm" iconName="Filter">
            Filters
          </Button>
          <Button variant="outline" size="sm" iconName="Download" onClick={() => exportData('csv')}>
            Export
          </Button>
        </div>
      </div>
      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-muted/30 sticky top-0">
            <tr>
              {columns?.map((column) => (
                <th key={column?.key} className="text-left p-3 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSort(column?.key)}
                      className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <span>{column?.label}</span>
                      {getSortIcon(column?.key)}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((row) => (
              <tr key={row?.id} className="hover:bg-muted/30 transition-colors">
                {columns?.map((column) => (
                  <td key={column?.key} className="p-3 border-b border-border text-sm text-foreground">
                    {column?.type === 'number' ? 
                      typeof row?.[column?.key] === 'number' ? row?.[column?.key]?.toFixed(1) : row?.[column?.key]
                      : row?.[column?.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table Footer */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
        <div className="flex items-center space-x-4">
          <Select
            options={itemsPerPageOptions}
            value={itemsPerPage?.toString()}
            onChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData?.length)} of {filteredAndSortedData?.length} entries
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          <span className="text-sm text-foreground px-3">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default DataTable;