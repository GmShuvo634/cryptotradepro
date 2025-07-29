import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertHistory = ({ history, onClearHistory }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'triggered': return 'CheckCircle';
      case 'expired': return 'Clock';
      case 'cancelled': return 'XCircle';
      default: return 'Bell';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'triggered': return 'text-success';
      case 'expired': return 'text-warning';
      case 'cancelled': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupHistoryByDate = (history) => {
    const groups = {};
    history.forEach(item => {
      const date = new Date(item.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    return groups;
  };

  const groupedHistory = groupHistoryByDate(history);

  if (history.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Clock" size={48} className="text-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">No Alert History</h3>
        <p className="text-text-secondary">
          Your triggered, expired, and cancelled alerts will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Alert History</h3>
          <p className="text-sm text-text-secondary">
            {history.length} total events
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          iconName="Trash2"
          iconPosition="left"
          className="text-error hover:text-error"
        >
          Clear History
        </Button>
      </div>

      {/* History List */}
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(groupedHistory).map(([date, items]) => (
          <div key={date}>
            {/* Date Header */}
            <div className="sticky top-0 bg-surface/80 backdrop-blur-sm px-4 py-2 border-b border-border">
              <h4 className="text-sm font-medium text-text-primary">
                {new Date(date).toLocaleDateString([], { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
            </div>

            {/* History Items */}
            {items.map((item) => (
              <div key={item.id} className="border-b border-border last:border-b-0">
                <div 
                  className="p-4 hover:bg-surface/50 cursor-pointer transition-colors"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Status Icon */}
                    <div className={`p-2 rounded-lg ${
                      item.status === 'triggered' ? 'bg-success/20' :
                      item.status === 'expired'? 'bg-warning/20' : 'bg-error/20'
                    }`}>
                      <Icon 
                        name={getStatusIcon(item.status)} 
                        size={16} 
                        className={getStatusColor(item.status)}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-text-primary">
                            {item.symbol} Alert {item.status === 'triggered' ? 'Triggered' : 
                             item.status === 'expired' ? 'Expired' : 'Cancelled'}
                          </h4>
                          <p className="text-sm text-text-secondary">
                            {item.condition === 'above' ? 'Price Above' :
                             item.condition === 'below' ? 'Price Below' :
                             item.condition === 'percentage_up' ? 'Percentage Increase' :
                             item.condition === 'percentage_down'? 'Percentage Decrease' : 'Custom Condition'} ${item.targetValue.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-text-secondary">
                            {formatTimestamp(item.timestamp)}
                          </p>
                          {item.status === 'triggered' && (
                            <p className="font-mono text-sm font-semibold text-success">
                              ${item.triggerPrice?.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedItems.has(item.id) && (
                        <div className="mt-3 pt-3 border-t border-border space-y-2">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-text-secondary">Created:</span>
                              <span className="ml-2 text-text-primary">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-text-secondary">Duration:</span>
                              <span className="ml-2 text-text-primary">
                                {Math.floor((new Date(item.timestamp) - new Date(item.createdAt)) / (1000 * 60 * 60 * 24))} days
                              </span>
                            </div>
                          </div>
                          
                          {item.note && (
                            <div className="text-sm">
                              <span className="text-text-secondary">Note:</span>
                              <span className="ml-2 text-text-primary">{item.note}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-text-secondary">Notifications sent:</span>
                            {item.notificationsSent?.email && (
                              <span className="px-2 py-1 bg-surface rounded-full">Email</span>
                            )}
                            {item.notificationsSent?.push && (
                              <span className="px-2 py-1 bg-surface rounded-full">Push</span>
                            )}
                            {item.notificationsSent?.sms && (
                              <span className="px-2 py-1 bg-surface rounded-full">SMS</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand Icon */}
                    <Icon 
                      name={expandedItems.has(item.id) ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-text-secondary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertHistory;