import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate real-time notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'price_alert',
        title: 'BTC Price Alert',
        message: 'Bitcoin has reached your target price of $45,000',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        read: false,
        priority: 'high',
        data: { symbol: 'BTC', price: 45000, change: '+2.5%' }
      },
      {
        id: 2,
        type: 'trade_executed',
        title: 'Trade Executed',
        message: 'Successfully sold 0.5 ETH at $2,850 per coin',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: 'medium',
        data: { symbol: 'ETH', amount: 0.5, price: 2850, type: 'sell' }
      },
      {
        id: 3,
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will begin in 2 hours',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true,
        priority: 'low',
        data: { maintenanceTime: '15:00 UTC' }
      },
      {
        id: 4,
        type: 'security',
        title: 'New Login Detected',
        message: 'New login from Chrome on Windows in New York, US',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        priority: 'high',
        data: { location: 'New York, US', device: 'Chrome on Windows' }
      },
      {
        id: 5,
        type: 'portfolio',
        title: 'Portfolio Update',
        message: 'Your portfolio value increased by 3.2% today',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        priority: 'medium',
        data: { change: '+3.2%', value: '$125,847.32' }
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'price_alert': return 'Bell';
      case 'trade_executed': return 'TrendingUp';
      case 'system': return 'Settings';
      case 'security': return 'Shield';
      case 'portfolio': return 'PieChart';
      default: return 'Info';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    switch (type) {
      case 'price_alert': return 'text-warning';
      case 'trade_executed': return 'text-success';
      case 'system': return 'text-text-secondary';
      case 'security': return 'text-error';
      case 'portfolio': return 'text-primary';
      default: return 'text-text-secondary';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-300" onClick={onClose} />
      
      {/* Notification Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-400 shadow-elevation">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
            <p className="text-sm text-text-secondary">
              {notifications.filter(n => !n.read).length} unread
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 p-4 border-b border-border">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'price_alert', label: 'Alerts' },
            { key: 'trade_executed', label: 'Trades' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === tab.key
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all read
          </Button>
          <Button variant="ghost" size="sm" iconName="Settings">
            Settings
          </Button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Icon name="Bell" size={48} className="text-text-secondary mb-4" />
              <p className="text-text-secondary">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-surface/50 cursor-pointer border-l-2 transition-colors ${
                    notification.read 
                      ? 'border-transparent' 
                      : notification.priority === 'high' ?'border-error bg-error/5' :'border-primary bg-primary/5'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      notification.priority === 'high' ? 'bg-error/20' :
                      notification.type === 'trade_executed' ? 'bg-success/20' :
                      notification.type === 'price_alert'? 'bg-warning/20' : 'bg-muted'
                    }`}>
                      <Icon 
                        name={getNotificationIcon(notification.type)} 
                        size={16} 
                        className={getNotificationColor(notification.type, notification.priority)}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-text-primary text-sm">
                            {notification.title}
                          </p>
                          <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          {/* Additional Data */}
                          {notification.data && (
                            <div className="mt-2 text-xs font-mono text-text-secondary">
                              {notification.type === 'price_alert' && (
                                <span className="text-success">
                                  {notification.data.symbol}: ${notification.data.price.toLocaleString()} ({notification.data.change})
                                </span>
                              )}
                              {notification.type === 'trade_executed' && (
                                <span className={notification.data.type === 'sell' ? 'text-error' : 'text-success'}>
                                  {notification.data.type.toUpperCase()}: {notification.data.amount} {notification.data.symbol} @ ${notification.data.price}
                                </span>
                              )}
                              {notification.type === 'portfolio' && (
                                <span className="text-success">
                                  {notification.data.change} → {notification.data.value}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <p className="text-xs text-text-secondary mt-2">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 text-text-secondary hover:text-error transition-colors"
                          >
                            <Icon name="X" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;