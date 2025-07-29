import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    { id: 'market-news', label: 'Market News', count: 245 },
    { id: 'technical-analysis', label: 'Technical Analysis', count: 89 },
    { id: 'fundamental-analysis', label: 'Fundamental Analysis', count: 67 },
    { id: 'regulatory', label: 'Regulatory', count: 34 },
    { id: 'institutional', label: 'Institutional', count: 56 },
    { id: 'defi', label: 'DeFi', count: 123 },
    { id: 'nft', label: 'NFT', count: 78 },
    { id: 'mining', label: 'Mining', count: 45 }
  ];

  const sources = [
    { id: 'coindesk', label: 'CoinDesk', credibility: 'high' },
    { id: 'cointelegraph', label: 'Cointelegraph', credibility: 'high' },
    { id: 'decrypt', label: 'Decrypt', credibility: 'high' },
    { id: 'blockworks', label: 'Blockworks', credibility: 'medium' },
    { id: 'coinbureau', label: 'Coin Bureau', credibility: 'medium' },
    { id: 'cryptoslate', label: 'CryptoSlate', credibility: 'medium' }
  ];

  const cryptocurrencies = [
    { id: 'bitcoin', label: 'Bitcoin (BTC)', count: 156 },
    { id: 'ethereum', label: 'Ethereum (ETH)', count: 134 },
    { id: 'binance-coin', label: 'BNB', count: 67 },
    { id: 'cardano', label: 'Cardano (ADA)', count: 45 },
    { id: 'solana', label: 'Solana (SOL)', count: 78 },
    { id: 'polkadot', label: 'Polkadot (DOT)', count: 34 }
  ];

  const sentiments = [
    { id: 'bullish', label: 'Bullish', color: 'text-success' },
    { id: 'bearish', label: 'Bearish', color: 'text-error' },
    { id: 'neutral', label: 'Neutral', color: 'text-text-secondary' }
  ];

  const timeRanges = [
    { id: 'last-hour', label: 'Last Hour' },
    { id: 'today', label: 'Today' },
    { id: 'this-week', label: 'This Week' },
    { id: 'this-month', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (type, value, checked) => {
    const newFilters = { ...localFilters };
    
    if (type === 'categories' || type === 'sources' || type === 'cryptocurrencies' || type === 'sentiments') {
      if (!newFilters[type]) newFilters[type] = [];
      
      if (checked) {
        newFilters[type] = [...newFilters[type], value];
      } else {
        newFilters[type] = newFilters[type].filter(item => item !== value);
      }
    } else {
      newFilters[type] = value;
    }
    
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters = {
      categories: [],
      sources: [],
      cryptocurrencies: [],
      sentiments: [],
      timeRange: 'today',
      searchQuery: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getCredibilityIcon = (credibility) => {
    switch (credibility) {
      case 'high': return { icon: 'Shield', color: 'text-success' };
      case 'medium': return { icon: 'ShieldCheck', color: 'text-warning' };
      case 'low': return { icon: 'ShieldAlert', color: 'text-error' };
      default: return { icon: 'Shield', color: 'text-text-secondary' };
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 bg-background border-r border-border z-50 transform transition-transform duration-300 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <Input
              type="search"
              placeholder="Search news and analysis..."
              value={localFilters.searchQuery || ''}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Time Range */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Time Range</h3>
            <div className="space-y-2">
              {timeRanges.map((range) => (
                <label key={range.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timeRange"
                    value={range.id}
                    checked={localFilters.timeRange === range.id}
                    onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-sm text-text-secondary">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Categories</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <Checkbox
                  key={category.id}
                  label={
                    <div className="flex items-center justify-between w-full">
                      <span>{category.label}</span>
                      <span className="text-xs text-text-secondary">({category.count})</span>
                    </div>
                  }
                  checked={localFilters.categories?.includes(category.id) || false}
                  onChange={(e) => handleFilterChange('categories', category.id, e.target.checked)}
                />
              ))}
            </div>
          </div>

          {/* Cryptocurrencies */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Cryptocurrencies</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cryptocurrencies.map((crypto) => (
                <Checkbox
                  key={crypto.id}
                  label={
                    <div className="flex items-center justify-between w-full">
                      <span>{crypto.label}</span>
                      <span className="text-xs text-text-secondary">({crypto.count})</span>
                    </div>
                  }
                  checked={localFilters.cryptocurrencies?.includes(crypto.id) || false}
                  onChange={(e) => handleFilterChange('cryptocurrencies', crypto.id, e.target.checked)}
                />
              ))}
            </div>
          </div>

          {/* Sources */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Sources</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sources.map((source) => {
                const credibilityIcon = getCredibilityIcon(source.credibility);
                return (
                  <Checkbox
                    key={source.id}
                    label={
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <span>{source.label}</span>
                          <Icon 
                            name={credibilityIcon.icon} 
                            size={14} 
                            className={credibilityIcon.color} 
                          />
                        </div>
                      </div>
                    }
                    checked={localFilters.sources?.includes(source.id) || false}
                    onChange={(e) => handleFilterChange('sources', source.id, e.target.checked)}
                  />
                );
              })}
            </div>
          </div>

          {/* Sentiment */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Sentiment</h3>
            <div className="space-y-2">
              {sentiments.map((sentiment) => (
                <Checkbox
                  key={sentiment.id}
                  label={
                    <span className={sentiment.color}>
                      {sentiment.label}
                    </span>
                  }
                  checked={localFilters.sentiments?.includes(sentiment.id) || false}
                  onChange={(e) => handleFilterChange('sentiments', sentiment.id, e.target.checked)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-4 border-t border-border">
          <Button
            variant="default"
            fullWidth
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;