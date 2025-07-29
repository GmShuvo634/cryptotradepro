import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const OrderBook = ({ selectedPair }) => {
  const [precision, setPrecision] = useState(2);
  const [grouping, setGrouping] = useState('0.01');
  const [viewMode, setViewMode] = useState('both'); // 'both', 'buy', 'sell'

  const [orderBookData, setOrderBookData] = useState({
    bids: [],
    asks: [],
    lastUpdate: new Date()
  });

  // Mock order book data
  useEffect(() => {
    const generateOrderBook = () => {
      const basePrice = 45750;
      const bids = [];
      const asks = [];

      // Generate bid orders (buy orders - below current price)
      for (let i = 0; i < 15; i++) {
        const price = basePrice - (i + 1) * Math.random() * 50;
        const size = Math.random() * 2 + 0.1;
        const total = price * size;
        bids.push({
          price: price.toFixed(2),
          size: size.toFixed(4),
          total: total.toFixed(2),
          percentage: Math.random() * 100
        });
      }

      // Generate ask orders (sell orders - above current price)
      for (let i = 0; i < 15; i++) {
        const price = basePrice + (i + 1) * Math.random() * 50;
        const size = Math.random() * 2 + 0.1;
        const total = price * size;
        asks.push({
          price: price.toFixed(2),
          size: size.toFixed(4),
          total: total.toFixed(2),
          percentage: Math.random() * 100
        });
      }

      setOrderBookData({
        bids: bids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)),
        asks: asks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)),
        lastUpdate: new Date()
      });
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 2000);
    return () => clearInterval(interval);
  }, [selectedPair]);

  const formatNumber = (num, decimals = 2) => {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const OrderRow = ({ order, type, index }) => (
    <div 
      className={`grid grid-cols-3 gap-2 py-1 px-2 text-xs font-mono hover:bg-surface/50 cursor-pointer relative group transition-colors animate-pulse-subtle`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Background bar showing depth */}
      <div
        className={`absolute right-0 top-0 bottom-0 opacity-10 ${
          type === 'bid' ? 'bg-success' : 'bg-error'
        }`}
        style={{ width: `${order.percentage}%` }}
      />
      
      <div className={`text-right ${type === 'bid' ? 'text-success' : 'text-error'}`}>
        ${formatNumber(order.price)}
      </div>
      <div className="text-right text-text-primary">
        {formatNumber(order.size, 4)}
      </div>
      <div className="text-right text-text-secondary">
        ${formatNumber(order.total)}
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text-primary">Order Book</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPrecision(prev => Math.max(0, prev - 1))}
              className="p-1 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Icon name="Minus" size={14} />
            </button>
            <span className="text-xs text-text-secondary font-mono">
              {precision} decimals
            </span>
            <button
              onClick={() => setPrecision(prev => Math.min(8, prev + 1))}
              className="p-1 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Icon name="Plus" size={14} />
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-surface rounded-lg p-1">
          {[
            { value: 'both', label: 'Both', icon: 'BarChart3' },
            { value: 'buy', label: 'Bids', icon: 'TrendingUp' },
            { value: 'sell', label: 'Asks', icon: 'TrendingDown' }
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => setViewMode(mode.value)}
              className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === mode.value
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={mode.icon} size={12} />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2 py-2 px-2 text-xs font-medium text-text-secondary border-b border-border">
        <div className="text-right">Price (USD)</div>
        <div className="text-right">Size (BTC)</div>
        <div className="text-right">Total (USD)</div>
      </div>

      {/* Order Book Content */}
      <div className="flex-1 overflow-hidden">
        {(viewMode === 'both' || viewMode === 'sell') && (
          <div className="h-1/2 overflow-y-auto">
            {/* Asks (Sell Orders) */}
            <div className="space-y-0">
              {orderBookData.asks.slice(0, viewMode === 'sell' ? 30 : 15).map((ask, index) => (
                <OrderRow key={`ask-${index}`} order={ask} type="ask" index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Current Price */}
        {viewMode === 'both' && (
          <div className="flex items-center justify-center py-3 border-y border-border bg-surface/30">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <div className="text-center">
                <div className="text-lg font-mono font-bold text-text-primary">
                  $45,750.00
                </div>
                <div className="text-xs text-success">
                  +125.50 (+0.27%)
                </div>
              </div>
              <div className="text-xs text-text-secondary">
                Last: {orderBookData.lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        {(viewMode === 'both' || viewMode === 'buy') && (
          <div className="h-1/2 overflow-y-auto">
            {/* Bids (Buy Orders) */}
            <div className="space-y-0">
              {orderBookData.bids.slice(0, viewMode === 'buy' ? 30 : 15).map((bid, index) => (
                <OrderRow key={`bid-${index}`} order={bid} type="bid" index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Market Depth Summary */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="text-center">
            <div className="text-text-secondary mb-1">Bid Sum</div>
            <div className="font-mono font-semibold text-success">
              {formatNumber(orderBookData.bids.reduce((sum, bid) => sum + parseFloat(bid.size), 0), 4)} BTC
            </div>
          </div>
          <div className="text-center">
            <div className="text-text-secondary mb-1">Ask Sum</div>
            <div className="font-mono font-semibold text-error">
              {formatNumber(orderBookData.asks.reduce((sum, ask) => sum + parseFloat(ask.size), 0), 4)} BTC
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <div className="text-xs text-text-secondary mb-1">Spread</div>
          <div className="font-mono text-sm text-text-primary">
            ${formatNumber(parseFloat(orderBookData.asks[0]?.price || 0) - parseFloat(orderBookData.bids[0]?.price || 0))}
            <span className="text-text-secondary ml-2">
              ({(((parseFloat(orderBookData.asks[0]?.price || 0) - parseFloat(orderBookData.bids[0]?.price || 0)) / parseFloat(orderBookData.asks[0]?.price || 1)) * 100).toFixed(3)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;