import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceAnalytics = ({ performanceData, correlationData, riskMetrics }) => {
  const [activeTab, setActiveTab] = useState('performance');
  const [chartType, setChartType] = useState('line');
  const [timeframe, setTimeframe] = useState('1y');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation">
          <p className="text-sm text-text-secondary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-text-primary">{entry.name}</span>
              </div>
              <span className="text-sm font-mono text-text-primary">
                {entry.name.includes('%') ? formatPercentage(entry.value) : formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const tabs = [
    { key: 'performance', label: 'Performance', icon: 'TrendingUp' },
    { key: 'correlation', label: 'Correlation', icon: 'GitBranch' },
    { key: 'risk', label: 'Risk Analysis', icon: 'Shield' },
    { key: 'benchmarks', label: 'Benchmarks', icon: 'Target' }
  ];

  const timeframes = [
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: '90d', label: '90D' },
    { key: '1y', label: '1Y' },
    { key: 'all', label: 'All' }
  ];

  const renderPerformanceChart = () => {
    const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
    const DataComponent = chartType === 'area' ? Area : Line;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-text-primary">Portfolio Performance</h4>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf.key}
                  onClick={() => setTimeframe(tf.key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    timeframe === tf.key
                      ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded-md transition-colors ${
                  chartType === 'line' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
              >
                <Icon name="TrendingUp" size={16} />
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`p-2 rounded-md transition-colors ${
                  chartType === 'area' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
              >
                <Icon name="AreaChart" size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <ResponsiveContainer width="100%" height={400}>
            <ChartComponent data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <DataComponent
                type="monotone"
                dataKey="portfolioValue"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill={chartType === 'area' ? 'var(--color-primary)' : undefined}
                fillOpacity={chartType === 'area' ? 0.1 : undefined}
                name="Portfolio Value"
              />
              <DataComponent
                type="monotone"
                dataKey="benchmark"
                stroke="var(--color-accent)"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill={chartType === 'area' ? 'var(--color-accent)' : undefined}
                fillOpacity={chartType === 'area' ? 0.1 : undefined}
                name="Benchmark"
              />
            </ChartComponent>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface rounded-lg p-4 text-center">
            <p className="text-sm text-text-secondary mb-1">Total Return</p>
            <p className="text-lg font-semibold text-success font-mono">+24.7%</p>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center">
            <p className="text-sm text-text-secondary mb-1">Annualized Return</p>
            <p className="text-lg font-semibold text-primary font-mono">+18.3%</p>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center">
            <p className="text-sm text-text-secondary mb-1">Max Drawdown</p>
            <p className="text-lg font-semibold text-error font-mono">-12.4%</p>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center">
            <p className="text-sm text-text-secondary mb-1">Sharpe Ratio</p>
            <p className="text-lg font-semibold text-text-primary font-mono">1.85</p>
          </div>
        </div>
      </div>
    );
  };

  const renderCorrelationMatrix = () => {
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-text-primary">Asset Correlation Matrix</h4>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 text-text-secondary font-medium">Asset</th>
                  {correlationData.assets.map((asset) => (
                    <th key={asset} className="text-center p-2 text-text-secondary font-medium text-sm">
                      {asset}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlationData.matrix.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2 font-medium text-text-primary">
                      {correlationData.assets[i]}
                    </td>
                    {row.map((correlation, j) => (
                      <td key={j} className="p-2 text-center">
                        <div 
                          className={`w-12 h-8 rounded flex items-center justify-center text-xs font-mono ${
                            correlation > 0.7 ? 'bg-error/20 text-error' :
                            correlation > 0.3 ? 'bg-warning/20 text-warning' :
                            correlation > -0.3 ? 'bg-muted text-text-secondary' :
                            correlation > -0.7 ? 'bg-primary/20 text-primary': 'bg-success/20 text-success'
                          }`}
                        >
                          {correlation.toFixed(2)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success/20 rounded"></div>
              <span className="text-text-secondary">Strong Negative (-0.7 to -1.0)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary/20 rounded"></div>
              <span className="text-text-secondary">Weak Negative (-0.3 to -0.7)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-muted rounded"></div>
              <span className="text-text-secondary">No Correlation (-0.3 to 0.3)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-warning/20 rounded"></div>
              <span className="text-text-secondary">Weak Positive (0.3 to 0.7)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-error/20 rounded"></div>
              <span className="text-text-secondary">Strong Positive (0.7 to 1.0)</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRiskAnalysis = () => {
    return (
      <div className="space-y-6">
        <h4 className="font-semibold text-text-primary">Risk Analysis</h4>
        
        {/* Risk Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-text-primary">Volatility</h5>
              <Icon name="Activity" size={20} className="text-warning" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-warning font-mono">{riskMetrics.volatility}%</p>
              <p className="text-sm text-text-secondary">30-day annualized</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-warning h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(riskMetrics.volatility, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-text-primary">Value at Risk</h5>
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-error font-mono">{formatCurrency(riskMetrics.valueAtRisk)}</p>
              <p className="text-sm text-text-secondary">95% confidence, 1-day</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-error h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((riskMetrics.valueAtRisk / 10000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-text-primary">Beta</h5>
              <Icon name="TrendingUp" size={20} className="text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-primary font-mono">{riskMetrics.beta}</p>
              <p className="text-sm text-text-secondary">vs. Market</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(riskMetrics.beta * 50, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h5 className="font-medium text-text-primary mb-4">Risk Distribution</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskMetrics.distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="range" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="frequency" 
                fill="var(--color-primary)" 
                name="Frequency"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Recommendations */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h5 className="font-medium text-text-primary mb-4">Risk Management Recommendations</h5>
          <div className="space-y-3">
            {riskMetrics.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
                <Icon 
                  name={rec.type === 'warning' ? 'AlertTriangle' : 'Info'} 
                  size={20} 
                  className={rec.type === 'warning' ? 'text-warning' : 'text-primary'}
                />
                <div className="flex-1">
                  <p className="text-text-primary font-medium">{rec.title}</p>
                  <p className="text-sm text-text-secondary mt-1">{rec.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBenchmarks = () => {
    const benchmarkData = [
      { name: 'Portfolio', return: 24.7, volatility: 18.2, sharpe: 1.85, color: 'var(--color-primary)' },
      { name: 'Bitcoin', return: 45.3, volatility: 28.5, sharpe: 1.42, color: 'var(--color-warning)' },
      { name: 'S&P 500', return: 12.1, volatility: 16.8, sharpe: 0.89, color: 'var(--color-success)' },
      { name: 'Gold', return: 8.4, volatility: 12.3, sharpe: 0.67, color: 'var(--color-accent)' }
    ];

    return (
      <div className="space-y-6">
        <h4 className="font-semibold text-text-primary">Benchmark Comparison</h4>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-text-secondary">Benchmark</th>
                  <th className="text-right p-4 font-medium text-text-secondary">Total Return</th>
                  <th className="text-right p-4 font-medium text-text-secondary">Volatility</th>
                  <th className="text-right p-4 font-medium text-text-secondary">Sharpe Ratio</th>
                  <th className="text-right p-4 font-medium text-text-secondary">Performance</th>
                </tr>
              </thead>
              <tbody>
                {benchmarkData.map((benchmark, index) => (
                  <tr key={index} className="border-b border-border hover:bg-surface/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: benchmark.color }}
                        />
                        <span className="font-medium text-text-primary">{benchmark.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`font-mono font-semibold ${
                        benchmark.return >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {formatPercentage(benchmark.return)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-mono text-text-primary">
                        {benchmark.volatility.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-mono text-text-primary">
                        {benchmark.sharpe.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="w-20 bg-muted rounded-full h-2 ml-auto">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((benchmark.return / 50) * 100, 100)}%`,
                            backgroundColor: benchmark.color
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Comparison Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h5 className="font-medium text-text-primary mb-4">Risk vs Return Comparison</h5>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tickFormatter={formatPercentage}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="portfolioReturn"
                stroke="var(--color-primary)"
                strokeWidth={2}
                name="Portfolio Return %"
              />
              <Line
                type="monotone"
                dataKey="benchmarkReturn"
                stroke="var(--color-accent)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Benchmark Return %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'performance':
        return renderPerformanceChart();
      case 'correlation':
        return renderCorrelationMatrix();
      case 'risk':
        return renderRiskAnalysis();
      case 'benchmarks':
        return renderBenchmarks();
      default:
        return renderPerformanceChart();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-muted'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default PerformanceAnalytics;