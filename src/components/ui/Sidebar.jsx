import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Markets',
      path: '/markets-overview',
      icon: 'TrendingUp',
      tooltip: 'Real-time market data and analysis',
      badge: null
    },
    {
      label: 'Trading',
      path: '/trading-interface',
      icon: 'BarChart3',
      tooltip: 'Professional trading interface with advanced charting',
      badge: null
    },
    {
      label: 'Portfolio',
      path: '/portfolio-management',
      icon: 'PieChart',
      tooltip: 'Comprehensive asset tracking and performance analytics',
      badge: null
    },
    {
      label: 'Wallet',
      path: '/wallet-management',
      icon: 'Wallet',
      tooltip: 'Secure cryptocurrency custody and management',
      badge: null
    },
    {
      label: 'Alerts',
      path: '/price-alerts',
      icon: 'Bell',
      tooltip: 'Price monitoring and notification management',
      badge: 3
    },
    {
      label: 'Research',
      path: '/news-analysis',
      icon: 'FileText',
      tooltip: 'News aggregation and market analysis',
      badge: null
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-background border-r border-border z-50 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">CryptoTradePro</h1>
                <p className="text-xs text-text-secondary">Professional Trading</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <div key={item.path} className="relative group">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary border-l-2 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-elevation opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-100 whitespace-nowrap">
                    <span className="text-sm text-text-primary">{item.label}</span>
                    <p className="text-xs text-text-secondary mt-1">{item.tooltip}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border">
          {/* Account Summary */}
          {!isCollapsed && (
            <div className="bg-surface rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Portfolio Value</span>
                <Icon name="TrendingUp" size={16} className="text-success" />
              </div>
              <div className="font-mono text-lg font-semibold text-text-primary">$125,847.32</div>
              <div className="text-sm text-success">+2.45% (24h)</div>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 5).map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'text-primary' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="relative">
                <Icon name={item.icon} size={20} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
          
          {/* More Menu for Mobile */}
          <button className="flex flex-col items-center space-y-1 p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors">
            <Icon name="MoreHorizontal" size={20} />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;