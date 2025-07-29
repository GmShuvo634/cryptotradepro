import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AlertFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  alertCounts 
}) => {
  const statusOptions = [
    { value: 'all', label: `All Alerts (${alertCounts.total})` },
    { value: 'active', label: `Active (${alertCounts.active})` },
    { value: 'triggered', label: `Triggered (${alertCounts.triggered})` },
    { value: 'paused', label: `Paused (${alertCounts.paused})` },
    { value: 'expired', label: `Expired (${alertCounts.expired})` }
  ];

  const conditionOptions = [
    { value: 'all', label: 'All Conditions' },
    { value: 'above', label: 'Price Above' },
    { value: 'below', label: 'Price Below' },
    { value: 'percentage_up', label: 'Percentage Up' },
    { value: 'percentage_down', label: 'Percentage Down' },
    { value: 'volume', label: 'Volume' },
    { value: 'technical', label: 'Technical' }
  ];

  const sortOptions = [
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' },
    { value: 'symbol_asc', label: 'Symbol A-Z' },
    { value: 'symbol_desc', label: 'Symbol Z-A' },
    { value: 'target_asc', label: 'Target Price Low-High' },
    { value: 'target_desc', label: 'Target Price High-Low' }
  ];

  const hasActiveFilters = () => {
    return filters.status !== 'all' || 
           filters.condition !== 'all' || 
           filters.search !== '';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Icon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
        />
        <input
          type="text"
          placeholder="Search alerts by symbol, condition, or note..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange('search', '')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Status Filter */}
        <Select
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        {/* Condition Filter */}
        <Select
          label="Condition Type"
          options={conditionOptions}
          value={filters.condition}
          onChange={(value) => onFilterChange('condition', value)}
        />

        {/* Sort Options */}
        <Select
          label="Sort By"
          options={sortOptions}
          value={filters.sortBy}
          onChange={(value) => onFilterChange('sortBy', value)}
        />
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm text-text-secondary">Quick filters:</span>
        
        <button
          onClick={() => onFilterChange('status', 'active')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filters.status === 'active' ?'bg-success/20 text-success' :'bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          Active Only
        </button>
        
        <button
          onClick={() => onFilterChange('status', 'triggered')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filters.status === 'triggered' ?'bg-warning/20 text-warning' :'bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          Recently Triggered
        </button>
        
        <button
          onClick={() => onFilterChange('condition', 'above')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filters.condition === 'above' ?'bg-primary/20 text-primary' :'bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          Price Above
        </button>
        
        <button
          onClick={() => onFilterChange('condition', 'below')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filters.condition === 'below' ?'bg-primary/20 text-primary' :'bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          Price Below
        </button>
      </div>

      {/* Active Filters & Clear */}
      {hasActiveFilters() && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">
              Filters applied
            </span>
            {filters.search && (
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                Search: "{filters.search}"
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                Status: {filters.status}
              </span>
            )}
            {filters.condition !== 'all' && (
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                Condition: {filters.condition}
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertFilters;