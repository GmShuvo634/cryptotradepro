import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MarketStats = ({ selectedPair }) => {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock market stats data
    const mockStats = {
      'BTC/USD': {
        price: 45750.00,
        change24h: 1125.50,
        changePercent24h: 2.52,
        high24h: 46200.00,
        low24h: 44100.00,
        volume24h: 28450.75,
        volumeUsd24h: 1302847500,
        marketCap: 897500000000,
        circulatingSupply: 19625000,
        allTimeHigh: 69000.00,
        allTimeLow: 3200.00,
        fearGreedIndex: 72,
        dominance: 42.5
      },
      'ETH/USD': {
        price: 2850.00,
        change24h: 85.25,
        changePercent24h: 3.08,
        high24h: 2890.00,
        low24h: 2750.00,
        volume24h: 15680.25,
        volumeUsd24h: 447087125,
        marketCap: 342750000000,
        circulatingSupply: 120250000,
        allTimeHigh: 4850.00,
        allTimeLow: 85.00,
        fearGreedIndex: 68,
        dominance: 18.2
      }
    };

    setIsLoading(true);
    setTimeout(() => {
      setStats(mockStats[selectedPair] || mockStats['BTC/USD']);
      setIsLoading(false);
    }, 500);
  }, [selectedPair]);

  const formatNumber = (num, decimals = 2) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(1)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(1)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(1)}K`;
    }
    return `$${parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}`;
  };

  const formatVolume = (num) => {
    if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(2)}K`;
    }
    return num.toFixed(2);
  };

  const getFearGreedColor = (index) => {
    if (index >= 75) return 'text-success';
    if (index >= 50) return 'text-warning';
    if (index >= 25) return 'text-error';
    return 'text-error';
  };

  const getFearGreedLabel = (index) => {
    if (index >= 75) return 'Extreme Greed';
    if (index >= 55) return 'Greed';
    if (index >= 45) return 'Neutral';
    if (index >= 25) return 'Fear';
    return 'Extreme Fear';
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-surface rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-surface rounded w-2/3"></div>
                <div className="h-4 bg-surface rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Market Statistics</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-text-secondary">Live</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 space-y-4">
        {/* Price Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface rounded-lg p-3">
            <div className="text-xs text-text-secondary mb-1">Current Price</div>
            <div className="font-mono text-lg font-bold text-text-primary">
              ${stats.price?.toLocaleString()}
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              stats.changePercent24h >= 0 ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={stats.changePercent24h >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
              />
              <span>
                {stats.changePercent24h >= 0 ? '+' : ''}
                {stats.changePercent24h?.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-3">
            <div className="text-xs text-text-secondary mb-1">24h Change</div>
            <div className={`font-mono text-lg font-bold ${
              stats.change24h >= 0 ? 'text-success' : 'text-error'
            }`}>
              {stats.change24h >= 0 ? '+' : ''}${stats.change24h?.toLocaleString()}
            </div>
            <div className="text-xs text-text-secondary">
              Last 24 hours
            </div>
          </div>
        </div>

        {/* High/Low Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-text-secondary mb-1">24h High</div>
            <div className="font-mono text-sm font-semibold text-success">
              ${stats.high24h?.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1">24h Low</div>
            <div className="font-mono text-sm font-semibold text-error">
              ${stats.low24h?.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Volume Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-text-secondary mb-1">24h Volume</div>
            <div className="font-mono text-sm font-semibold text-text-primary">
              {formatVolume(stats.volume24h)} {selectedPair.split('/')[0]}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1">Volume (USD)</div>
            <div className="font-mono text-sm font-semibold text-text-primary">
              {formatNumber(stats.volumeUsd24h)}
            </div>
          </div>
        </div>

        {/* Market Cap & Supply */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-text-secondary mb-1">Market Cap</div>
            <div className="font-mono text-sm font-semibold text-text-primary">
              {formatNumber(stats.marketCap)}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1">Circulating Supply</div>
            <div className="font-mono text-sm font-semibold text-text-primary">
              {stats.circulatingSupply?.toLocaleString()} {selectedPair.split('/')[0]}
            </div>
          </div>
        </div>

        {/* All Time High/Low */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-text-secondary mb-1">All Time High</div>
            <div className="font-mono text-sm font-semibold text-text-primary">
              ${stats.allTimeHigh?.toLocaleString()}
            </div>
            <div className="text-xs text-error">
              -{((stats.allTimeHigh - stats.price) / stats.allTimeHigh * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1">All Time Low</div>
            <div className="font-mono text-sm font-semibold text-text-primary">
              ${stats.allTimeLow?.toLocaleString()}
            </div>
            <div className="text-xs text-success">
              +{((stats.price - stats.allTimeLow) / stats.allTimeLow * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Fear & Greed Index */}
        <div className="bg-surface rounded-lg p-3">
          <div className="text-xs text-text-secondary mb-2">Fear & Greed Index</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`text-2xl font-bold ${getFearGreedColor(stats.fearGreedIndex)}`}>
                {stats.fearGreedIndex}
              </div>
              <div>
                <div className={`text-sm font-medium ${getFearGreedColor(stats.fearGreedIndex)}`}>
                  {getFearGreedLabel(stats.fearGreedIndex)}
                </div>
                <div className="text-xs text-text-secondary">Market Sentiment</div>
              </div>
            </div>
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  stats.fearGreedIndex >= 75 ? 'bg-success' :
                  stats.fearGreedIndex >= 50 ? 'bg-warning': 'bg-error'
                }`}
                style={{ width: `${stats.fearGreedIndex}%` }}
              />
            </div>
          </div>
        </div>

        {/* Market Dominance */}
        <div>
          <div className="text-xs text-text-secondary mb-1">Market Dominance</div>
          <div className="flex items-center space-x-2">
            <div className="font-mono text-sm font-semibold text-text-primary">
              {stats.dominance}%
            </div>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${stats.dominance}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketStats;