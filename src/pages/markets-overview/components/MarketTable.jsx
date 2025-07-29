import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const MarketTable = ({ data, onSort, sortConfig, onAddToWatchlist, onQuickTrade }) => {
  const [selectedCoins, setSelectedCoins] = useState(new Set());

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`;
    } else {
      return `$${volume.toLocaleString()}`;
    }
  };

  const handleSelectCoin = (coinId) => {
    const newSelected = new Set(selectedCoins);
    if (newSelected.has(coinId)) {
      newSelected.delete(coinId);
    } else {
      newSelected.add(coinId);
    }
    setSelectedCoins(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCoins.size === data.length) {
      setSelectedCoins(new Set());
    } else {
      setSelectedCoins(new Set(data.map(coin => coin.id)));
    }
  };

  const handleBulkAddToWatchlist = () => {
    selectedCoins.forEach(coinId => {
      const coin = data.find(c => c.id === coinId);
      if (coin) onAddToWatchlist(coin);
    });
    setSelectedCoins(new Set());
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const SparklineChart = ({ data: sparklineData, change }) => {
    const points = sparklineData.map((value, index) => {
      const x = (index / (sparklineData.length - 1)) * 100;
      const minValue = Math.min(...sparklineData);
      const maxValue = Math.max(...sparklineData);
      const y = 100 - ((value - minValue) / (maxValue - minValue)) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="80" height="30" className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={change >= 0 ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'}
          strokeWidth="1.5"
          className="drop-shadow-sm"
        />
      </svg>
    );
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Table Header with Bulk Actions */}
      {selectedCoins.size > 0 && (
        <div className="bg-primary/10 border-b border-border p-4 flex items-center justify-between">
          <span className="text-sm text-text-primary">
            {selectedCoins.size} coin{selectedCoins.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleBulkAddToWatchlist}>
              Add to Watchlist
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCoins(new Set())}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedCoins.size === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th 
                className="p-4 text-left cursor-pointer hover:bg-surface/50 transition-colors"
                onClick={() => onSort('rank')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-text-secondary">#</span>
                  <Icon name={getSortIcon('rank')} size={14} className="text-text-secondary" />
                </div>
              </th>
              <th 
                className="p-4 text-left cursor-pointer hover:bg-surface/50 transition-colors"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-text-secondary">Name</span>
                  <Icon name={getSortIcon('name')} size={14} className="text-text-secondary" />
                </div>
              </th>
              <th 
                className="p-4 text-right cursor-pointer hover:bg-surface/50 transition-colors"
                onClick={() => onSort('price')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-sm font-medium text-text-secondary">Price</span>
                  <Icon name={getSortIcon('price')} size={14} className="text-text-secondary" />
                </div>
              </th>
              <th 
                className="p-4 text-right cursor-pointer hover:bg-surface/50 transition-colors"
                onClick={() => onSort('change24h')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-sm font-medium text-text-secondary">24h %</span>
                  <Icon name={getSortIcon('change24h')} size={14} className="text-text-secondary" />
                </div>
              </th>
              <th 
                className="p-4 text-right cursor-pointer hover:bg-surface/50 transition-colors"
                onClick={() => onSort('volume24h')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-sm font-medium text-text-secondary">Volume (24h)</span>
                  <Icon name={getSortIcon('volume24h')} size={14} className="text-text-secondary" />
                </div>
              </th>
              <th 
                className="p-4 text-right cursor-pointer hover:bg-surface/50 transition-colors"
                onClick={() => onSort('marketCap')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-sm font-medium text-text-secondary">Market Cap</span>
                  <Icon name={getSortIcon('marketCap')} size={14} className="text-text-secondary" />
                </div>
              </th>
              <th className="p-4 text-center">
                <span className="text-sm font-medium text-text-secondary">Last 7 Days</span>
              </th>
              <th className="p-4 text-center">
                <span className="text-sm font-medium text-text-secondary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((coin) => (
              <tr 
                key={coin.id} 
                className="border-b border-border hover:bg-surface/30 transition-colors"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedCoins.has(coin.id)}
                    onChange={() => handleSelectCoin(coin.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <span className="text-sm font-mono text-text-secondary">{coin.rank}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-text-primary">{coin.name}</div>
                      <div className="text-sm text-text-secondary uppercase">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="font-mono text-text-primary">{formatPrice(coin.price)}</div>
                </td>
                <td className="p-4 text-right">
                  <div className={`font-mono ${coin.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="font-mono text-text-secondary">{formatVolume(coin.volume24h)}</div>
                </td>
                <td className="p-4 text-right">
                  <div className="font-mono text-text-secondary">{formatMarketCap(coin.marketCap)}</div>
                </td>
                <td className="p-4 text-center">
                  <SparklineChart data={coin.sparkline} change={coin.change24h} />
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Plus"
                      onClick={() => onAddToWatchlist(coin)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onQuickTrade(coin)}
                    >
                      Trade
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {data.map((coin) => (
          <div key={coin.id} className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedCoins.has(coin.id)}
                  onChange={() => handleSelectCoin(coin.id)}
                  className="rounded border-border"
                />
                <Image
                  src={coin.image}
                  alt={coin.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-text-primary">{coin.name}</div>
                  <div className="text-sm text-text-secondary uppercase">{coin.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-text-primary">{formatPrice(coin.price)}</div>
                <div className={`text-sm font-mono ${coin.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                  {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-text-secondary">Market Cap</div>
                <div className="font-mono text-sm text-text-primary">{formatMarketCap(coin.marketCap)}</div>
              </div>
              <div>
                <div className="text-xs text-text-secondary">Volume (24h)</div>
                <div className="font-mono text-sm text-text-primary">{formatVolume(coin.volume24h)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <SparklineChart data={coin.sparkline} change={coin.change24h} />
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Plus"
                  onClick={() => onAddToWatchlist(coin)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickTrade(coin)}
                >
                  Trade
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTable;