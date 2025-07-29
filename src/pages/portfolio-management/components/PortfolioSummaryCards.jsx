import React from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioSummaryCards = ({ portfolioData, selectedPeriod, onPeriodChange }) => {
  const periods = [
    { key: '24h', label: '24H' },
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: '90d', label: '90D' },
    { key: '1y', label: '1Y' },
    { key: 'all', label: 'All' }
  ];

  const summaryCards = [
    {
      title: 'Total Portfolio Value',
      value: portfolioData.totalValue,
      change: portfolioData.totalChange,
      changePercent: portfolioData.totalChangePercent,
      icon: 'Wallet',
      color: 'primary'
    },
    {
      title: 'Unrealized P&L',
      value: portfolioData.unrealizedPnL,
      change: portfolioData.unrealizedChange,
      changePercent: portfolioData.unrealizedChangePercent,
      icon: 'TrendingUp',
      color: portfolioData.unrealizedPnL >= 0 ? 'success' : 'error'
    },
    {
      title: 'Realized P&L',
      value: portfolioData.realizedPnL,
      change: portfolioData.realizedChange,
      changePercent: portfolioData.realizedChangePercent,
      icon: 'Target',
      color: portfolioData.realizedPnL >= 0 ? 'success' : 'error'
    },
    {
      title: 'Total Return',
      value: portfolioData.totalReturn,
      change: portfolioData.totalReturnChange,
      changePercent: portfolioData.totalReturnPercent,
      icon: 'BarChart3',
      color: portfolioData.totalReturn >= 0 ? 'success' : 'error'
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Portfolio Overview</h2>
        <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => onPeriodChange(period.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                card.color === 'primary' ? 'bg-primary/20' :
                card.color === 'success' ? 'bg-success/20' :
                card.color === 'error'? 'bg-error/20' : 'bg-muted'
              }`}>
                <Icon 
                  name={card.icon} 
                  size={24} 
                  className={
                    card.color === 'primary' ? 'text-primary' :
                    card.color === 'success' ? 'text-success' :
                    card.color === 'error'? 'text-error' : 'text-text-secondary'
                  }
                />
              </div>
              <div className="text-right">
                <div className={`flex items-center space-x-1 text-sm ${
                  card.changePercent >= 0 ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={card.changePercent >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                  />
                  <span>{formatPercentage(card.changePercent)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-secondary">{card.title}</h3>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-text-primary font-mono">
                  {formatCurrency(card.value)}
                </p>
                <p className={`text-sm font-medium ${
                  card.change >= 0 ? 'text-success' : 'text-error'
                }`}>
                  {card.change >= 0 ? '+' : ''}{formatCurrency(card.change)} ({selectedPeriod})
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Assets</p>
          <p className="text-lg font-semibold text-text-primary">{portfolioData.totalAssets}</p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Best Performer</p>
          <p className="text-lg font-semibold text-success">+{portfolioData.bestPerformer}%</p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Worst Performer</p>
          <p className="text-lg font-semibold text-error">{portfolioData.worstPerformer}%</p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Diversity Score</p>
          <p className="text-lg font-semibold text-primary">{portfolioData.diversityScore}/10</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummaryCards;