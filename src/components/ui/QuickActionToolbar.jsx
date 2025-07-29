import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';


const QuickActionToolbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const getContextualActions = () => {
    switch (location.pathname) {
      case '/markets-overview':
        return [
          { icon: 'Plus', label: 'Add to Watchlist', action: () => console.log('Add to watchlist') },
          { icon: 'Zap', label: 'Quick Buy', action: () => console.log('Quick buy') },
          { icon: 'Bell', label: 'Set Alert', action: () => console.log('Set alert') },
          { icon: 'BarChart3', label: 'Open Chart', action: () => console.log('Open chart') }
        ];
      case '/trading-interface':
        return [
          { icon: 'TrendingUp', label: 'Quick Buy', action: () => console.log('Quick buy') },
          { icon: 'TrendingDown', label: 'Quick Sell', action: () => console.log('Quick sell') },
          { icon: 'Target', label: 'Set Stop Loss', action: () => console.log('Set stop loss') },
          { icon: 'Bell', label: 'Price Alert', action: () => console.log('Price alert') }
        ];
      case '/portfolio-management':
        return [
          { icon: 'RefreshCw', label: 'Refresh Data', action: () => console.log('Refresh data') },
          { icon: 'Download', label: 'Export Report', action: () => console.log('Export report') },
          { icon: 'PieChart', label: 'Rebalance', action: () => console.log('Rebalance') },
          { icon: 'Settings', label: 'Portfolio Settings', action: () => console.log('Portfolio settings') }
        ];
      case '/wallet-management':
        return [
          { icon: 'ArrowDownLeft', label: 'Deposit', action: () => console.log('Deposit') },
          { icon: 'ArrowUpRight', label: 'Withdraw', action: () => console.log('Withdraw') },
          { icon: 'Send', label: 'Transfer', action: () => console.log('Transfer') },
          { icon: 'QrCode', label: 'Receive', action: () => console.log('Receive') }
        ];
      case '/price-alerts':
        return [
          { icon: 'Plus', label: 'New Alert', action: () => console.log('New alert') },
          { icon: 'Settings', label: 'Alert Settings', action: () => console.log('Alert settings') },
          { icon: 'Volume2', label: 'Sound Test', action: () => console.log('Sound test') },
          { icon: 'Smartphone', label: 'Push Settings', action: () => console.log('Push settings') }
        ];
      case '/news-analysis':
        return [
          { icon: 'RefreshCw', label: 'Refresh News', action: () => console.log('Refresh news') },
          { icon: 'Filter', label: 'Filter Sources', action: () => console.log('Filter sources') },
          { icon: 'Bookmark', label: 'Save Article', action: () => console.log('Save article') },
          { icon: 'Share', label: 'Share Analysis', action: () => console.log('Share analysis') }
        ];
      default:
        return [
          { icon: 'Home', label: 'Dashboard', action: () => console.log('Dashboard') },
          { icon: 'Search', label: 'Search', action: () => console.log('Search') },
          { icon: 'Bell', label: 'Alerts', action: () => console.log('Alerts') },
          { icon: 'Settings', label: 'Settings', action: () => console.log('Settings') }
        ];
    }
  };

  const actions = getContextualActions();

  return (
    <>
      {/* Desktop Quick Action Toolbar */}
      <div className="fixed bottom-6 right-6 z-60 hidden md:block">
        <div className={`flex flex-col items-end space-y-3 transition-all duration-300 ${
          isExpanded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 pointer-events-none'
        }`}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex items-center space-x-3 bg-surface hover:bg-surface/80 border border-border rounded-lg px-4 py-3 shadow-elevation transition-all duration-200 hover:shadow-lg group"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span className="text-sm font-medium text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {action.label}
              </span>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name={action.icon} size={20} color="white" />
              </div>
            </button>
          ))}
        </div>

        {/* Main FAB */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-elevation flex items-center justify-center transition-all duration-300 ${
            isExpanded ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <Icon name="Plus" size={24} color="white" />
        </button>
      </div>

      {/* Mobile Quick Action Toolbar */}
      <div className="fixed bottom-20 right-4 z-60 md:hidden">
        <div className={`flex flex-col items-end space-y-2 transition-all duration-300 ${
          isExpanded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 pointer-events-none'
        }`}>
          {actions.slice(0, 3).map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="w-12 h-12 bg-surface hover:bg-surface/80 border border-border rounded-full shadow-elevation flex items-center justify-center transition-all duration-200"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <Icon name={action.icon} size={20} className="text-primary" />
            </button>
          ))}
        </div>

        {/* Mobile FAB */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-12 h-12 bg-primary hover:bg-primary/90 rounded-full shadow-elevation flex items-center justify-center transition-all duration-300 ${
            isExpanded ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <Icon name="Plus" size={20} color="white" />
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 z-50 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default QuickActionToolbar;