import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TradingChart = ({ selectedPair, onPairChange }) => {
  const [timeframe, setTimeframe] = useState('1H');
  const [chartType, setChartType] = useState('candlestick');
  const [indicators, setIndicators] = useState(['MA', 'RSI']);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timeframes = ['1M', '5M', '15M', '30M', '1H', '4H', '1D', '1W'];
  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick', icon: 'BarChart3' },
    { value: 'line', label: 'Line', icon: 'TrendingUp' },
    { value: 'area', label: 'Area', icon: 'Activity' }
  ];

  const availableIndicators = [
    { id: 'MA', name: 'Moving Average', color: '#0066FF' },
    { id: 'EMA', name: 'Exponential MA', color: '#00D4AA' },
    { id: 'RSI', name: 'RSI', color: '#F59E0B' },
    { id: 'MACD', name: 'MACD', color: '#EF4444' },
    { id: 'BB', name: 'Bollinger Bands', color: '#8B5CF6' }
  ];

  const mockPriceData = [
    { time: '09:00', open: 44800, high: 45200, low: 44600, close: 45100, volume: 1250 },
    { time: '10:00', open: 45100, high: 45400, low: 44900, close: 45300, volume: 1180 },
    { time: '11:00', open: 45300, high: 45600, low: 45100, close: 45450, volume: 1320 },
    { time: '12:00', open: 45450, high: 45800, low: 45200, close: 45650, volume: 1450 },
    { time: '13:00', open: 45650, high: 45900, low: 45400, close: 45750, volume: 1380 }
  ];

  const toggleIndicator = (indicatorId) => {
    setIndicators(prev => 
      prev.includes(indicatorId) 
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${isFullscreen ? 'fixed inset-4 z-50' : 'h-full'}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-black">₿</span>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{selectedPair}</h3>
              <p className="text-xs text-text-secondary">Bitcoin / US Dollar</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-mono font-bold text-text-primary">$45,750.00</span>
            <div className="flex items-center space-x-1 text-success">
              <Icon name="TrendingUp" size={16} />
              <span className="text-sm font-medium">+2.45%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-surface rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center bg-surface rounded-lg p-1">
            {chartTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setChartType(type.value)}
                className={`p-2 rounded transition-colors ${
                  chartType === type.value
                    ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                }`}
                title={type.label}
              >
                <Icon name={type.icon} size={16} />
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            iconName={isFullscreen ? "Minimize2" : "Maximize2"}
            onClick={() => setIsFullscreen(!isFullscreen)}
          />
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative flex-1 p-4">
        {/* Mock TradingView Chart */}
        <div className="w-full h-96 bg-background border border-border rounded-lg relative overflow-hidden">
          {/* Price Grid */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full border-t border-border"
                style={{ top: `${i * 10}%` }}
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute h-full border-l border-border"
                style={{ left: `${i * 10}%` }}
              />
            ))}
          </div>

          {/* Mock Candlestick Chart */}
          <div className="absolute inset-4 flex items-end justify-between">
            {mockPriceData.map((candle, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                {/* Candlestick */}
                <div className="relative">
                  <div
                    className={`w-2 ${
                      candle.close > candle.open ? 'bg-success' : 'bg-error'
                    }`}
                    style={{
                      height: `${Math.abs(candle.high - candle.low) / 20}px`,
                      marginBottom: '2px'
                    }}
                  />
                  <div
                    className={`w-4 border-2 ${
                      candle.close > candle.open 
                        ? 'border-success bg-success' :'border-error bg-error'
                    }`}
                    style={{
                      height: `${Math.abs(candle.close - candle.open) / 10}px`
                    }}
                  />
                </div>
                <span className="text-xs text-text-secondary">{candle.time}</span>
              </div>
            ))}
          </div>

          {/* Price Labels */}
          <div className="absolute right-2 top-4 space-y-8">
            {[45900, 45600, 45300, 45000, 44700].map((price) => (
              <div key={price} className="text-xs text-text-secondary font-mono">
                ${price.toLocaleString()}
              </div>
            ))}
          </div>

          {/* Volume Chart */}
          <div className="absolute bottom-4 left-4 right-16 h-16 flex items-end justify-between">
            {mockPriceData.map((candle, index) => (
              <div
                key={index}
                className="bg-text-secondary opacity-30"
                style={{
                  width: '12px',
                  height: `${(candle.volume / 1500) * 100}%`
                }}
              />
            ))}
          </div>
        </div>

        {/* Drawing Tools */}
        <div className="absolute top-8 left-8 flex items-center space-x-2 bg-surface rounded-lg p-2">
          {[
            { icon: 'Move', label: 'Cursor' },
            { icon: 'Minus', label: 'Trend Line' },
            { icon: 'Square', label: 'Rectangle' },
            { icon: 'Circle', label: 'Circle' },
            { icon: 'Type', label: 'Text' }
          ].map((tool) => (
            <button
              key={tool.label}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors"
              title={tool.label}
            >
              <Icon name={tool.icon} size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Indicators Panel */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-text-primary">Technical Indicators</h4>
          <Button variant="ghost" size="sm" iconName="Plus">
            Add Indicator
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {availableIndicators.map((indicator) => (
            <button
              key={indicator.id}
              onClick={() => toggleIndicator(indicator.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                indicators.includes(indicator.id)
                  ? 'bg-primary/20 text-primary border border-primary/30' :'bg-surface text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: indicator.color }}
              />
              <span>{indicator.name}</span>
              {indicators.includes(indicator.id) && (
                <Icon name="X" size={12} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingChart;