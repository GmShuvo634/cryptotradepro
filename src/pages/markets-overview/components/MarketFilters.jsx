import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MarketFilters = ({ onFiltersChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(activeFilters);

  const marketCapOptions = [
    { value: 'all', label: 'All Market Caps' },
    { value: 'large', label: 'Large Cap (>$10B)' },
    { value: 'mid', label: 'Mid Cap ($1B-$10B)' },
    { value: 'small', label: 'Small Cap ($100M-$1B)' },
    { value: 'micro', label: 'Micro Cap (<$100M)' }
  ];

  const exchangeOptions = [
    { value: 'all', label: 'All Exchanges' },
    { value: 'binance', label: 'Binance' },
    { value: 'coinbase', label: 'Coinbase Pro' },
    { value: 'kraken', label: 'Kraken' },
    { value: 'huobi', label: 'Huobi' },
    { value: 'kucoin', label: 'KuCoin' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'defi', label: 'DeFi' },
    { value: 'nft', label: 'NFT' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'layer1', label: 'Layer 1' },
    { value: 'layer2', label: 'Layer 2' },
    { value: 'meme', label: 'Meme Coins' },
    { value: 'ai', label: 'AI & Big Data' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: '',
      marketCap: 'all',
      exchange: 'all',
      category: 'all',
      priceMin: '',
      priceMax: '',
      changeMin: '',
      changeMax: '',
      volumeMin: ''
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== '' && value !== 'all'
  );

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-text-secondary" />
          <h3 className="font-semibold text-text-primary">Market Filters</h3>
          {hasActiveFilters && (
            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>

      {/* Basic Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          type="search"
          placeholder="Search coins..."
          value={localFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full"
        />
        
        <Select
          placeholder="Market Cap"
          options={marketCapOptions}
          value={localFilters.marketCap}
          onChange={(value) => handleFilterChange('marketCap', value)}
        />
        
        <Select
          placeholder="Exchange"
          options={exchangeOptions}
          value={localFilters.exchange}
          onChange={(value) => handleFilterChange('exchange', value)}
        />
        
        <Select
          placeholder="Category"
          options={categoryOptions}
          value={localFilters.category}
          onChange={(value) => handleFilterChange('category', value)}
        />
      </div>

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Price Range (USD)</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                />
                <span className="text-text-secondary">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                />
              </div>
            </div>

            {/* 24h Change Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">24h Change (%)</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min %"
                  value={localFilters.changeMin}
                  onChange={(e) => handleFilterChange('changeMin', e.target.value)}
                />
                <span className="text-text-secondary">to</span>
                <Input
                  type="number"
                  placeholder="Max %"
                  value={localFilters.changeMax}
                  onChange={(e) => handleFilterChange('changeMax', e.target.value)}
                />
              </div>
            </div>

            {/* Volume Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Min Volume (USD)</label>
              <Input
                type="number"
                placeholder="Minimum volume"
                value={localFilters.volumeMin}
                onChange={(e) => handleFilterChange('volumeMin', e.target.value)}
              />
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
            <span className="text-sm text-text-secondary">Quick filters:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('changeMin', '10')}
            >
              Gainers 10%+
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('changeMax', '-10')}
            >
              Losers 10%+
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleFilterChange('volumeMin', '1000000');
                handleFilterChange('marketCap', 'large');
              }}
            >
              High Volume
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('category', 'defi')}
            >
              DeFi Only
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketFilters;