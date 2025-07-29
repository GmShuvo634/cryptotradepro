import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import NotificationCenter from '../../components/ui/NotificationCenter';
import TradingChart from './components/TradingChart';
import OrderBook from './components/OrderBook';
import TradingPanel from './components/TradingPanel';
import PositionsPanel from './components/PositionsPanel';
import MarketStats from './components/MarketStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const TradingInterface = () => {
  const [selectedPair, setSelectedPair] = useState('BTC/USD');
  const [currentPrice, setCurrentPrice] = useState(45750.00);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState('standard'); // standard, compact, advanced
  const [panelVisibility, setPanelVisibility] = useState({
    orderBook: true,
    tradingPanel: true,
    positions: true,
    marketStats: true
  });

  const tradingPairs = [
    { value: 'BTC/USD', label: 'BTC/USD - Bitcoin' },
    { value: 'ETH/USD', label: 'ETH/USD - Ethereum' },
    { value: 'BNB/USD', label: 'BNB/USD - Binance Coin' },
    { value: 'ADA/USD', label: 'ADA/USD - Cardano' },
    { value: 'SOL/USD', label: 'SOL/USD - Solana' },
    { value: 'DOT/USD', label: 'DOT/USD - Polkadot' },
    { value: 'AVAX/USD', label: 'AVAX/USD - Avalanche' },
    { value: 'MATIC/USD', label: 'MATIC/USD - Polygon' }
  ];

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 100;
        return Math.max(0, prev + change);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const togglePanel = (panelName) => {
    setPanelVisibility(prev => ({
      ...prev,
      [panelName]: !prev[panelName]
    }));
  };

  const layoutModes = [
    { value: 'standard', label: 'Standard Layout' },
    { value: 'compact', label: 'Compact Layout' },
    { value: 'advanced', label: 'Advanced Layout' }
  ];

  return (
    <>
      <Helmet>
        <title>Trading Interface - CryptoTradePro</title>
        <meta name="description" content="Professional cryptocurrency trading interface with advanced charting, real-time order book, and comprehensive trading tools for BTC, ETH, and other digital assets." />
        <meta name="keywords" content="cryptocurrency trading, bitcoin trading, ethereum trading, crypto charts, order book, trading platform" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <QuickActionToolbar />
        <NotificationCenter 
          isOpen={isNotificationOpen} 
          onClose={() => setIsNotificationOpen(false)} 
        />

        {/* Main Trading Interface */}
        <main className="ml-60 mt-24 p-6 space-y-6">
          {/* Trading Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-black">₿</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">Trading Interface</h1>
                  <p className="text-text-secondary">Professional cryptocurrency trading platform</p>
                </div>
              </div>
              
              <Select
                options={tradingPairs}
                value={selectedPair}
                onChange={setSelectedPair}
                className="w-64"
                searchable
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Layout Controls */}
              <Select
                options={layoutModes}
                value={layoutMode}
                onChange={setLayoutMode}
                className="w-48"
              />

              {/* Panel Visibility Controls */}
              <div className="flex items-center space-x-2 bg-surface rounded-lg p-2">
                {Object.entries(panelVisibility).map(([panel, visible]) => (
                  <button
                    key={panel}
                    onClick={() => togglePanel(panel)}
                    className={`p-2 rounded transition-colors ${
                      visible 
                        ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                    }`}
                    title={`Toggle ${panel.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  >
                    <Icon 
                      name={
                        panel === 'orderBook' ? 'BarChart3' :
                        panel === 'tradingPanel' ? 'TrendingUp' :
                        panel === 'positions'? 'FileText' : 'PieChart'
                      } 
                      size={16} 
                    />
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                iconName="Settings"
                onClick={() => console.log('Open trading settings')}
              >
                Settings
              </Button>
            </div>
          </div>

          {/* Trading Layout */}
          <div className={`grid gap-6 ${
            layoutMode === 'compact' ?'grid-cols-1 lg:grid-cols-2' 
              : layoutMode === 'advanced' ?'grid-cols-12' :'grid-cols-1 lg:grid-cols-4'
          }`}>
            {/* Main Chart Area */}
            <div className={`${
              layoutMode === 'compact' ?'lg:col-span-2' 
                : layoutMode === 'advanced' ?'col-span-8' :'lg:col-span-3'
            }`}>
              <div className="h-[600px]">
                <TradingChart 
                  selectedPair={selectedPair}
                  onPairChange={setSelectedPair}
                />
              </div>
            </div>

            {/* Side Panels */}
            <div className={`space-y-6 ${
              layoutMode === 'advanced' ? 'col-span-4' : ''
            }`}>
              {/* Order Book */}
              {panelVisibility.orderBook && (
                <div className="h-[400px]">
                  <OrderBook selectedPair={selectedPair} />
                </div>
              )}

              {/* Trading Panel */}
              {panelVisibility.tradingPanel && (
                <div className="h-[500px]">
                  <TradingPanel 
                    selectedPair={selectedPair}
                    currentPrice={currentPrice}
                  />
                </div>
              )}

              {/* Market Stats */}
              {panelVisibility.marketStats && layoutMode !== 'compact' && (
                <div>
                  <MarketStats selectedPair={selectedPair} />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Panel - Positions & Orders */}
          {panelVisibility.positions && (
            <div className="h-[300px]">
              <PositionsPanel />
            </div>
          )}

          {/* Market Stats for Compact Layout */}
          {panelVisibility.marketStats && layoutMode === 'compact' && (
            <div>
              <MarketStats selectedPair={selectedPair} />
            </div>
          )}

          {/* Trading Alerts */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Active Alerts</h3>
              <Button variant="outline" size="sm" iconName="Plus">
                New Alert
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  type: 'price',
                  symbol: 'BTC/USD',
                  condition: 'Above $46,000',
                  status: 'active',
                  icon: 'TrendingUp',
                  color: 'text-success'
                },
                {
                  type: 'technical',
                  symbol: 'ETH/USD',
                  condition: 'RSI < 30',
                  status: 'triggered',
                  icon: 'Activity',
                  color: 'text-warning'
                },
                {
                  type: 'volume',
                  symbol: 'BNB/USD',
                  condition: 'Volume > 1M',
                  status: 'active',
                  icon: 'BarChart3',
                  color: 'text-primary'
                }
              ].map((alert, index) => (
                <div key={index} className="bg-surface rounded-lg p-3 flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-muted ${alert.color}`}>
                    <Icon name={alert.icon} size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">{alert.symbol}</div>
                    <div className="text-sm text-text-secondary">{alert.condition}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    alert.status === 'active' ?'bg-success/20 text-success' :'bg-warning/20 text-warning'
                  }`}>
                    {alert.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Mobile Trading Interface */}
        <div className="md:hidden fixed inset-0 bg-background pt-24 pb-20">
          <div className="h-full flex flex-col space-y-4 p-4">
            {/* Mobile Chart */}
            <div className="flex-1">
              <TradingChart 
                selectedPair={selectedPair}
                onPairChange={setSelectedPair}
              />
            </div>
            
            {/* Mobile Trading Panel */}
            <div className="h-80">
              <TradingPanel 
                selectedPair={selectedPair}
                currentPrice={currentPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TradingInterface;