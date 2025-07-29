import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PositionsPanel = () => {
  const [activeTab, setActiveTab] = useState('positions');

  const mockPositions = [
    {
      id: 1,
      symbol: 'BTC/USD',
      side: 'long',
      size: 0.5,
      entryPrice: 44200,
      currentPrice: 45750,
      pnl: 775,
      pnlPercent: 3.51,
      leverage: 2,
      margin: 11050,
      liquidationPrice: 22100,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      symbol: 'ETH/USD',
      side: 'short',
      size: 2.5,
      entryPrice: 2900,
      currentPrice: 2850,
      pnl: 125,
      pnlPercent: 1.72,
      leverage: 3,
      margin: 2416.67,
      liquidationPrice: 3770,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ];

  const mockOrders = [
    {
      id: 1,
      symbol: 'BTC/USD',
      type: 'limit',
      side: 'buy',
      amount: 0.25,
      price: 44000,
      filled: 0,
      status: 'open',
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 2,
      symbol: 'ETH/USD',
      type: 'stop',
      side: 'sell',
      amount: 1.0,
      price: 2800,
      stopPrice: 2820,
      filled: 0,
      status: 'open',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      id: 3,
      symbol: 'BTC/USD',
      type: 'market',
      side: 'sell',
      amount: 0.1,
      price: 45650,
      filled: 0.1,
      status: 'filled',
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    }
  ];

  const mockTradeHistory = [
    {
      id: 1,
      symbol: 'BTC/USD',
      side: 'buy',
      amount: 0.5,
      price: 44200,
      fee: 11.05,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      symbol: 'ETH/USD',
      side: 'sell',
      amount: 2.5,
      price: 2900,
      fee: 3.625,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 3,
      symbol: 'BTC/USD',
      side: 'sell',
      amount: 0.1,
      price: 45650,
      fee: 2.28,
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    }
  ];

  const formatNumber = (num, decimals = 2) => {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const closePosition = (positionId) => {
    console.log('Closing position:', positionId);
    // Here you would typically call your API to close the position
  };

  const cancelOrder = (orderId) => {
    console.log('Canceling order:', orderId);
    // Here you would typically call your API to cancel the order
  };

  const PositionsTab = () => (
    <div className="space-y-2">
      {mockPositions.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="TrendingUp" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No open positions</p>
        </div>
      ) : (
        mockPositions.map((position) => (
          <div key={position.id} className="bg-surface rounded-lg p-4 hover:bg-surface/80 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  position.side === 'long' ?'bg-success/20 text-success' :'bg-error/20 text-error'
                }`}>
                  {position.side.toUpperCase()}
                </div>
                <span className="font-semibold text-text-primary">{position.symbol}</span>
                <span className="text-xs text-text-secondary">
                  {position.leverage}x Leverage
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`text-right ${position.pnl >= 0 ? 'text-success' : 'text-error'}`}>
                  <div className="font-mono font-semibold">
                    ${formatNumber(Math.abs(position.pnl))}
                  </div>
                  <div className="text-xs">
                    {position.pnl >= 0 ? '+' : '-'}{formatNumber(Math.abs(position.pnlPercent))}%
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => closePosition(position.id)}
                >
                  Close
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-text-secondary">Size</div>
                <div className="font-mono text-text-primary">{formatNumber(position.size, 4)}</div>
              </div>
              <div>
                <div className="text-text-secondary">Entry Price</div>
                <div className="font-mono text-text-primary">${formatNumber(position.entryPrice)}</div>
              </div>
              <div>
                <div className="text-text-secondary">Current Price</div>
                <div className="font-mono text-text-primary">${formatNumber(position.currentPrice)}</div>
              </div>
              <div>
                <div className="text-text-secondary">Liquidation</div>
                <div className="font-mono text-error">${formatNumber(position.liquidationPrice)}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const OrdersTab = () => (
    <div className="space-y-2">
      {mockOrders.filter(order => order.status === 'open').length === 0 ? (
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No open orders</p>
        </div>
      ) : (
        mockOrders.filter(order => order.status === 'open').map((order) => (
          <div key={order.id} className="bg-surface rounded-lg p-4 hover:bg-surface/80 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  order.side === 'buy' ?'bg-success/20 text-success' :'bg-error/20 text-error'
                }`}>
                  {order.side.toUpperCase()}
                </div>
                <span className="font-semibold text-text-primary">{order.symbol}</span>
                <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                  {order.type.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-text-secondary">
                  {formatTime(order.timestamp)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cancelOrder(order.id)}
                >
                  Cancel
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-text-secondary">Amount</div>
                <div className="font-mono text-text-primary">{formatNumber(order.amount, 4)}</div>
              </div>
              <div>
                <div className="text-text-secondary">Price</div>
                <div className="font-mono text-text-primary">${formatNumber(order.price)}</div>
              </div>
              {order.stopPrice && (
                <div>
                  <div className="text-text-secondary">Stop Price</div>
                  <div className="font-mono text-text-primary">${formatNumber(order.stopPrice)}</div>
                </div>
              )}
              <div>
                <div className="text-text-secondary">Filled</div>
                <div className="font-mono text-text-primary">
                  {formatNumber((order.filled / order.amount) * 100)}%
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const HistoryTab = () => (
    <div className="space-y-2">
      {mockTradeHistory.map((trade) => (
        <div key={trade.id} className="bg-surface rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                trade.side === 'buy' ?'bg-success/20 text-success' :'bg-error/20 text-error'
              }`}>
                {trade.side.toUpperCase()}
              </div>
              <span className="font-semibold text-text-primary">{trade.symbol}</span>
            </div>
            <span className="text-xs text-text-secondary">
              {formatTime(trade.timestamp)}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-text-secondary">Amount</div>
              <div className="font-mono text-text-primary">{formatNumber(trade.amount, 4)}</div>
            </div>
            <div>
              <div className="text-text-secondary">Price</div>
              <div className="font-mono text-text-primary">${formatNumber(trade.price)}</div>
            </div>
            <div>
              <div className="text-text-secondary">Fee</div>
              <div className="font-mono text-text-primary">${formatNumber(trade.fee)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {[
          { key: 'positions', label: 'Positions', count: mockPositions.length },
          { key: 'orders', label: 'Open Orders', count: mockOrders.filter(o => o.status === 'open').length },
          { key: 'history', label: 'Trade History', count: mockTradeHistory.length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="bg-surface text-text-secondary px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'positions' && <PositionsTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'history' && <HistoryTab />}
      </div>
    </div>
  );
};

export default PositionsPanel;