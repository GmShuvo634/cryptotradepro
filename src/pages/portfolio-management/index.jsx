import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import NotificationCenter from '../../components/ui/NotificationCenter';
import PortfolioSummaryCards from './components/PortfolioSummaryCards';
import AllocationCharts from './components/AllocationCharts';
import HoldingsTable from './components/HoldingsTable';
import TransactionHistory from './components/TransactionHistory';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PortfolioManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedPortfolio, setSelectedPortfolio] = useState('main');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Mock portfolio data
  const portfolioData = {
    totalValue: 125847.32,
    totalChange: 3247.85,
    totalChangePercent: 2.65,
    unrealizedPnL: 18432.67,
    unrealizedChange: 1234.56,
    unrealizedChangePercent: 7.2,
    realizedPnL: 5678.90,
    realizedChange: 234.56,
    realizedChangePercent: 4.3,
    totalReturn: 24125.57,
    totalReturnChange: 1469.12,
    totalReturnPercent: 23.7,
    totalAssets: 12,
    bestPerformer: 45.3,
    worstPerformer: -8.7,
    diversityScore: 7.8
  };

  // Mock allocation data
  const allocationData = [
    { name: 'BTC', value: 56832.45, percentage: 45.2, change: 2.3 },
    { name: 'ETH', value: 35367.89, percentage: 28.1, change: 4.7 },
    { name: 'ADA', value: 10445.23, percentage: 8.3, change: -1.2 },
    { name: 'DOT', value: 8923.67, percentage: 7.1, change: 3.8 },
    { name: 'LINK', value: 6789.12, percentage: 5.4, change: 1.9 },
    { name: 'UNI', value: 4234.56, percentage: 3.4, change: -0.8 },
    { name: 'MATIC', value: 3254.40, percentage: 2.5, change: 6.2 }
  ];

  // Mock holdings data
  const holdings = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      quantity: 1.2847,
      currentPrice: 44250.00,
      value: 56832.45,
      costBasis: 48500.00,
      unrealizedPnL: 8332.45,
      unrealizedPnLPercent: 17.2,
      allocation: 45.2,
      priceChange24h: 2.3
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      quantity: 12.4567,
      currentPrice: 2840.50,
      value: 35367.89,
      costBasis: 31200.00,
      unrealizedPnL: 4167.89,
      unrealizedPnLPercent: 13.4,
      allocation: 28.1,
      priceChange24h: 4.7
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      quantity: 18432.56,
      currentPrice: 0.567,
      value: 10445.23,
      costBasis: 11200.00,
      unrealizedPnL: -754.77,
      unrealizedPnLPercent: -6.7,
      allocation: 8.3,
      priceChange24h: -1.2
    },
    {
      symbol: 'DOT',
      name: 'Polkadot',
      quantity: 1234.78,
      currentPrice: 7.23,
      value: 8923.67,
      costBasis: 8100.00,
      unrealizedPnL: 823.67,
      unrealizedPnLPercent: 10.2,
      allocation: 7.1,
      priceChange24h: 3.8
    },
    {
      symbol: 'LINK',
      name: 'Chainlink',
      quantity: 456.89,
      currentPrice: 14.86,
      value: 6789.12,
      costBasis: 6200.00,
      unrealizedPnL: 589.12,
      unrealizedPnLPercent: 9.5,
      allocation: 5.4,
      priceChange24h: 1.9
    }
  ];

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      type: 'buy',
      asset: 'BTC',
      quantity: 0.5,
      price: 44000.00,
      value: 22000.00,
      fee: 22.00,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      txHash: '0x1234567890abcdef1234567890abcdef12345678'
    },
    {
      id: 2,
      type: 'sell',
      asset: 'ETH',
      quantity: 2.0,
      price: 2850.00,
      value: 5700.00,
      fee: 5.70,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'completed',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef12'
    },
    {
      id: 3,
      type: 'deposit',
      asset: 'USDC',
      quantity: 10000.00,
      price: 1.00,
      value: 10000.00,
      fee: 0.00,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      txHash: '0x567890abcdef1234567890abcdef1234567890ab'
    },
    {
      id: 4,
      type: 'stake',
      asset: 'ADA',
      quantity: 5000.00,
      price: 0.55,
      value: 2750.00,
      fee: 2.75,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
      txHash: '0x90abcdef1234567890abcdef1234567890abcdef'
    },
    {
      id: 5,
      type: 'reward',
      asset: 'ADA',
      quantity: 125.50,
      price: 0.56,
      value: 70.28,
      fee: 0.00,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'completed',
      txHash: '0xdef1234567890abcdef1234567890abcdef12345'
    }
  ];

  // Mock performance data
  const performanceData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    portfolioValue: 100000 + Math.random() * 30000 + i * 800,
    benchmark: 100000 + Math.random() * 25000 + i * 600,
    portfolioReturn: (Math.random() - 0.5) * 10 + i * 0.3,
    benchmarkReturn: (Math.random() - 0.5) * 8 + i * 0.2
  }));

  // Mock correlation data
  const correlationData = {
    assets: ['BTC', 'ETH', 'ADA', 'DOT', 'LINK'],
    matrix: [
      [1.00, 0.85, 0.72, 0.68, 0.74],
      [0.85, 1.00, 0.78, 0.71, 0.69],
      [0.72, 0.78, 1.00, 0.65, 0.58],
      [0.68, 0.71, 0.65, 1.00, 0.62],
      [0.74, 0.69, 0.58, 0.62, 1.00]
    ]
  };

  // Mock risk metrics
  const riskMetrics = {
    volatility: 18.2,
    valueAtRisk: 8432.50,
    beta: 1.24,
    distribution: [
      { range: '-20% to -15%', frequency: 2 },
      { range: '-15% to -10%', frequency: 5 },
      { range: '-10% to -5%', frequency: 12 },
      { range: '-5% to 0%', frequency: 18 },
      { range: '0% to 5%', frequency: 25 },
      { range: '5% to 10%', frequency: 20 },
      { range: '10% to 15%', frequency: 12 },
      { range: '15% to 20%', frequency: 6 }
    ],
    recommendations: [
      {
        type: 'warning',
        title: 'High Correlation Risk',
        description: 'Your portfolio shows high correlation between major holdings. Consider diversifying into uncorrelated assets.'
      },
      {
        type: 'info',
        title: 'Rebalancing Opportunity',
        description: 'Bitcoin allocation has grown beyond target. Consider taking profits and rebalancing.'
      },
      {
        type: 'info',
        title: 'Volatility Management',
        description: 'Current portfolio volatility is above average. Consider adding stable assets to reduce risk.'
      }
    ]
  };

  const portfolios = [
    { id: 'main', name: 'Main Portfolio', value: 125847.32 },
    { id: 'trading', name: 'Trading Portfolio', value: 45632.18 },
    { id: 'longterm', name: 'Long-term Holdings', value: 89234.56 }
  ];

  const sections = [
    { key: 'overview', label: 'Overview', icon: 'BarChart3' },
    { key: 'allocation', label: 'Allocation', icon: 'PieChart' },
    { key: 'holdings', label: 'Holdings', icon: 'Wallet' },
    { key: 'transactions', label: 'Transactions', icon: 'Activity' },
    { key: 'analytics', label: 'Analytics', icon: 'TrendingUp' }
  ];

  const handleSort = (key, direction) => {
    console.log('Sorting by:', key, direction);
  };

  const handleFilter = (filters) => {
    console.log('Filtering:', filters);
  };

  const handleRebalance = () => {
    console.log('Rebalancing portfolio...');
  };

  const handleExportReport = () => {
    console.log('Exporting portfolio report...');
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update portfolio data in real application
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Portfolio Management - CryptoTradePro</title>
        <meta name="description" content="Comprehensive portfolio tracking and performance analysis for cryptocurrency investments" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <QuickActionToolbar />
        <NotificationCenter 
          isOpen={isNotificationOpen} 
          onClose={() => setIsNotificationOpen(false)} 
        />

        {/* Main Content */}
        <main className="ml-0 md:ml-60 pt-24 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-text-primary mb-2">Portfolio Management</h1>
                <p className="text-text-secondary">
                  Comprehensive asset tracking and performance analysis for informed investment decisions
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                {/* Portfolio Selector */}
                <select
                  value={selectedPortfolio}
                  onChange={(e) => setSelectedPortfolio(e.target.value)}
                  className="bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {portfolios.map(portfolio => (
                    <option key={portfolio.id} value={portfolio.id}>
                      {portfolio.name}
                    </option>
                  ))}
                </select>
                
                <Button variant="outline" iconName="RefreshCw" size="sm">
                  Refresh
                </Button>
                
                <Button variant="outline" iconName="Download" size="sm" onClick={handleExportReport}>
                  Export
                </Button>
                
                <Button variant="outline" iconName="Settings" size="sm">
                  Settings
                </Button>
              </div>
            </div>

            {/* Section Navigation */}
            <div className="flex items-center space-x-1 bg-surface rounded-lg p-1 mb-8 overflow-x-auto">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeSection === section.key
                      ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={section.icon} size={16} />
                  <span>{section.label}</span>
                </button>
              ))}
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <PortfolioSummaryCards
                  portfolioData={portfolioData}
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={setSelectedPeriod}
                />
              )}

              {/* Allocation Section */}
              {activeSection === 'allocation' && (
                <AllocationCharts
                  allocationData={allocationData}
                  onRebalance={handleRebalance}
                />
              )}

              {/* Holdings Section */}
              {activeSection === 'holdings' && (
                <HoldingsTable
                  holdings={holdings}
                  onSort={handleSort}
                  onFilter={handleFilter}
                />
              )}

              {/* Transactions Section */}
              {activeSection === 'transactions' && (
                <TransactionHistory transactions={transactions} />
              )}

              {/* Analytics Section */}
              {activeSection === 'analytics' && (
                <PerformanceAnalytics
                  performanceData={performanceData}
                  correlationData={correlationData}
                  riskMetrics={riskMetrics}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PortfolioManagement;