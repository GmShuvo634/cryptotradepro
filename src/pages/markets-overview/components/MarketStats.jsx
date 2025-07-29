import React from 'react';
import Icon from '../../../components/AppIcon';

const MarketStats = ({ stats }) => {
  const formatCurrency = (value) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const getFearGreedColor = (index) => {
    if (index >= 75) return 'text-success';
    if (index >= 50) return 'text-warning';
    if (index >= 25) return 'text-error';
    return 'text-error';
  };

  const getFearGreedLabel = (index) => {
    if (index >= 75) return 'Extreme Greed';
    if (index >= 50) return 'Greed';
    if (index >= 25) return 'Fear';
    return 'Extreme Fear';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Market Cap */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <span className="text-sm text-text-secondary">Market Cap</span>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${
            stats.marketCapChange24h >= 0 
              ? 'bg-success/20 text-success' :'bg-error/20 text-error'
          }`}>
            {stats.marketCapChange24h >= 0 ? '+' : ''}{stats.marketCapChange24h.toFixed(2)}%
          </div>
        </div>
        <div className="font-mono text-xl font-semibold text-text-primary">
          {formatCurrency(stats.totalMarketCap)}
        </div>
        <div className="text-xs text-text-secondary mt-1">
          24h change: {formatCurrency(Math.abs(stats.totalMarketCap * stats.marketCapChange24h / 100))}
        </div>
      </div>

      {/* 24h Volume */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="BarChart3" size={20} className="text-accent" />
            <span className="text-sm text-text-secondary">24h Volume</span>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${
            stats.volumeChange24h >= 0 
              ? 'bg-success/20 text-success' :'bg-error/20 text-error'
          }`}>
            {stats.volumeChange24h >= 0 ? '+' : ''}{stats.volumeChange24h.toFixed(2)}%
          </div>
        </div>
        <div className="font-mono text-xl font-semibold text-text-primary">
          {formatCurrency(stats.totalVolume24h)}
        </div>
        <div className="text-xs text-text-secondary mt-1">
          Across {stats.activeExchanges} exchanges
        </div>
      </div>

      {/* BTC Dominance */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="PieChart" size={20} className="text-warning" />
            <span className="text-sm text-text-secondary">BTC Dominance</span>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${
            stats.btcDominanceChange >= 0 
              ? 'bg-success/20 text-success' :'bg-error/20 text-error'
          }`}>
            {stats.btcDominanceChange >= 0 ? '+' : ''}{stats.btcDominanceChange.toFixed(2)}%
          </div>
        </div>
        <div className="font-mono text-xl font-semibold text-text-primary">
          {stats.btcDominance.toFixed(1)}%
        </div>
        <div className="text-xs text-text-secondary mt-1">
          ETH: {stats.ethDominance.toFixed(1)}%
        </div>
      </div>

      {/* Fear & Greed Index */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className={getFearGreedColor(stats.fearGreedIndex)} />
            <span className="text-sm text-text-secondary">Fear & Greed</span>
          </div>
          <div className="text-xs text-text-secondary">
            24h ago: {stats.fearGreedYesterday}
          </div>
        </div>
        <div className={`font-mono text-xl font-semibold ${getFearGreedColor(stats.fearGreedIndex)}`}>
          {stats.fearGreedIndex}
        </div>
        <div className="text-xs text-text-secondary mt-1">
          {getFearGreedLabel(stats.fearGreedIndex)}
        </div>
      </div>
    </div>
  );
};

export default MarketStats;