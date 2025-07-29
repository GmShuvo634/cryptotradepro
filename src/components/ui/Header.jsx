import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Price Alert Triggered',
      message: 'BTC reached $45,000',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'trade',
      title: 'Trade Executed',
      message: 'Sold 0.5 ETH at $2,850',
      time: '5 min ago',
      unread: true
    },
    {
      id: 3,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance in 2 hours',
      time: '1 hour ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert': return 'Bell';
      case 'trade': return 'TrendingUp';
      case 'system': return 'Settings';
      default: return 'Info';
    }
  };

  return (
    <>
      {/* Market Status Bar */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-surface border-b border-border z-100 flex items-center px-4 text-xs font-mono">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-text-secondary">Markets Open</span>
          </div>
          <div className="text-text-secondary">BTC: <span className="text-success">$44,850</span></div>
          <div className="text-text-secondary">ETH: <span className="text-success">$2,845</span></div>
          <div className="text-text-secondary">Total Market Cap: <span className="text-text-primary">$1.85T</span></div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-text-secondary">Connected</span>
          </div>
          <span className="text-text-secondary">Last Update: 13:06:13</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="fixed top-8 left-240 right-0 h-16 bg-background border-b border-border z-90 flex items-center justify-between px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search markets, coins, news..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Trade Button */}
          <Button
            variant="outline"
            size="sm"
            iconName="Zap"
            iconPosition="left"
            className="hidden md:flex"
          >
            Quick Trade
          </Button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation z-200">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-text-primary">Notifications</h3>
                    <Button variant="ghost" size="sm">Mark all read</Button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border hover:bg-surface/50 cursor-pointer ${
                        notification.unread ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'alert' ? 'bg-warning/20 text-warning' :
                          notification.type === 'trade'? 'bg-success/20 text-success' : 'bg-muted text-text-secondary'
                        }`}>
                          <Icon name={getNotificationIcon(notification.type)} size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-text-primary text-sm">{notification.title}</p>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-text-secondary text-sm mt-1">{notification.message}</p>
                          <p className="text-text-secondary text-xs mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border">
                  <Button variant="ghost" size="sm" fullWidth>
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-text-primary">John Trader</p>
                <p className="text-xs text-text-secondary">Pro Account</p>
              </div>
              <Icon name="ChevronDown" size={16} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevation z-200">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="white" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">John Trader</p>
                      <p className="text-sm text-text-secondary">john@cryptotradepro.com</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-xs text-success">Pro Account</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors">
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors">
                    <Icon name="Shield" size={16} />
                    <span>Security</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors">
                    <Icon name="CreditCard" size={16} />
                    <span>Billing</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors">
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  <div className="border-t border-border my-2"></div>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors">
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Click outside handlers */}
      {(isNotificationOpen || isProfileOpen) && (
        <div
          className="fixed inset-0 z-80"
          onClick={() => {
            setIsNotificationOpen(false);
            setIsProfileOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Header;