import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Treemap, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AllocationCharts = ({ allocationData, onRebalance }) => {
  const [chartType, setChartType] = useState('pie');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const COLORS = [
    'var(--color-primary)',
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-error)',
    '#8B5CF6',
    '#F59E0B',
    '#10B981',
    '#EF4444',
    '#6B7280'
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation">
          <p className="font-semibold text-text-primary">{data.name}</p>
          <p className="text-sm text-text-secondary">
            Value: <span className="text-text-primary font-mono">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm text-text-secondary">
            Allocation: <span className="text-text-primary font-mono">{data.percentage}%</span>
          </p>
          <p className="text-sm text-text-secondary">
            24h Change: <span className={`font-mono ${data.change >= 0 ? 'text-success' : 'text-error'}`}>
              {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const TreemapTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation">
          <p className="font-semibold text-text-primary">{data.name}</p>
          <p className="text-sm text-text-secondary">
            Size: <span className="text-text-primary font-mono">{formatCurrency(data.size)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const rebalanceRecommendations = [
    {
      asset: 'BTC',
      current: 45.2,
      target: 40.0,
      action: 'sell',
      amount: '$2,847'
    },
    {
      asset: 'ETH',
      current: 28.1,
      target: 30.0,
      action: 'buy',
      amount: '$1,234'
    },
    {
      asset: 'ADA',
      current: 8.3,
      target: 10.0,
      action: 'buy',
      amount: '$892'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Asset Allocation</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                chartType === 'pie' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              <Icon name="PieChart" size={16} className="mr-1" />
              Pie
            </button>
            <button
              onClick={() => setChartType('treemap')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                chartType === 'treemap' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              <Icon name="Grid3X3" size={16} className="mr-1" />
              Treemap
            </button>
          </div>
          <Button variant="outline" size="sm" iconName="RefreshCw" onClick={onRebalance}>
            Rebalance
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg p-6">
            {chartType === 'pie' ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    onMouseEnter={(data) => setSelectedAsset(data)}
                    onMouseLeave={() => setSelectedAsset(null)}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        stroke={selectedAsset?.name === entry.name ? '#ffffff' : 'none'}
                        strokeWidth={selectedAsset?.name === entry.name ? 2 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => (
                      <span className="text-text-primary text-sm">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <Treemap
                  data={allocationData.map(item => ({ ...item, size: item.value }))}
                  dataKey="size"
                  aspectRatio={4/3}
                  stroke="#fff"
                  strokeWidth={2}
                  fill="var(--color-primary)"
                >
                  <Tooltip content={<TreemapTooltip />} />
                </Treemap>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Asset List */}
        <div className="space-y-4">
          <h4 className="font-semibold text-text-primary">Holdings Breakdown</h4>
          <div className="space-y-3">
            {allocationData.map((asset, index) => (
              <div 
                key={asset.name}
                className={`bg-surface rounded-lg p-4 cursor-pointer transition-all hover:bg-surface/80 ${
                  selectedAsset?.name === asset.name ? 'ring-2 ring-primary' : ''
                }`}
                onMouseEnter={() => setSelectedAsset(asset)}
                onMouseLeave={() => setSelectedAsset(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-text-primary">{asset.name}</span>
                  </div>
                  <span className="text-sm font-mono text-text-secondary">{asset.percentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-text-primary">
                    {formatCurrency(asset.value)}
                  </span>
                  <span className={`text-sm font-mono ${
                    asset.change >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rebalancing Recommendations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-text-primary">Rebalancing Recommendations</h4>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Info" size={16} />
            <span>Based on target allocation</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {rebalanceRecommendations.map((rec, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-text-primary">{rec.asset}</span>
                <div className="text-sm text-text-secondary">
                  Current: <span className="font-mono">{rec.current}%</span> → 
                  Target: <span className="font-mono">{rec.target}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${
                  rec.action === 'buy' ? 'text-success' : 'text-error'
                }`}>
                  {rec.action.toUpperCase()} {rec.amount}
                </span>
                <Button variant="outline" size="sm">
                  Execute
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllocationCharts;