import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const WatchlistPanel = ({ watchlist, onRemoveFromWatchlist, onQuickTrade }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  if (watchlist.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 mb-6">
        <div className="text-center">
          <Icon name="Star" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="font-semibold text-text-primary mb-2">Your Watchlist is Empty</h3>
          <p className="text-text-secondary text-sm mb-4">
            Add cryptocurrencies to your watchlist to track their performance
          </p>
          <Button variant="outline" iconName="Plus">
            Browse Markets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Star" size={20} className="text-warning" />
          <h3 className="font-semibold text-text-primary">Watchlist</h3>
          <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
            {watchlist.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="Settings">
            Manage
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </div>

      {/* Watchlist Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Desktop View */}
          <div className="hidden lg:block">
            <div className="space-y-3">
              {watchlist.map((coin) => (
                <div
                  key={coin.id}
                  className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:bg-surface/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-text-primary">{coin.symbol.toUpperCase()}</div>
                      <div className="text-xs text-text-secondary">{coin.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-text-primary">{formatPrice(coin.price)}</div>
                    <div className={`text-xs font-mono ${coin.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="TrendingUp"
                      onClick={() => onQuickTrade(coin)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="X"
                      onClick={() => onRemoveFromWatchlist(coin.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Horizontal Scroll */}
          <div className="lg:hidden">
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {watchlist.map((coin) => (
                <div
                  key={coin.id}
                  className="flex-shrink-0 w-48 bg-background border border-border rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-medium text-text-primary text-sm">
                        {coin.symbol.toUpperCase()}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="X"
                      onClick={() => onRemoveFromWatchlist(coin.id)}
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="font-mono text-text-primary">{formatPrice(coin.price)}</div>
                    <div className={`text-sm font-mono ${coin.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    className="mt-3"
                    onClick={() => onQuickTrade(coin)}
                  >
                    Trade
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm text-text-secondary">
              Total Value: <span className="font-mono text-text-primary">
                ${watchlist.reduce((sum, coin) => sum + (coin.price * (coin.holdings || 0)), 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="Download">
                Export
              </Button>
              <Button variant="outline" size="sm" iconName="Share">
                Share
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistPanel;