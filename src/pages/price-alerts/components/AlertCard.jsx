import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertCard = ({ alert, onEdit, onDelete, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getConditionIcon = (condition) => {
    switch (condition) {
      case 'above': return 'TrendingUp';
      case 'below': return 'TrendingDown';
      case 'percentage_up': return 'ArrowUp';
      case 'percentage_down': return 'ArrowDown';
      case 'volume': return 'BarChart3';
      case 'technical': return 'Activity';
      default: return 'Bell';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'above': case'percentage_up':
        return 'text-success';
      case 'below': case'percentage_down':
        return 'text-error';
      case 'volume':
        return 'text-warning';
      case 'technical':
        return 'text-primary';
      default:
        return 'text-text-secondary';
    }
  };

  const formatCondition = (condition, targetValue, currentPrice) => {
    switch (condition) {
      case 'above':
        return `Above $${targetValue.toLocaleString()}`;
      case 'below':
        return `Below $${targetValue.toLocaleString()}`;
      case 'percentage_up':
        return `+${targetValue}% increase`;
      case 'percentage_down':
        return `-${targetValue}% decrease`;
      case 'volume':
        return `Volume &gt; ${targetValue}M`;
      case 'technical':
        return `RSI ${targetValue}`;
      default:
        return 'Custom condition';
    }
  };

  const calculateProgress = () => {
    if (!alert.currentPrice || !alert.targetValue) return 0;
    
    if (alert.condition === 'above') {
      return Math.min((alert.currentPrice / alert.targetValue) * 100, 100);
    } else if (alert.condition === 'below') {
      return Math.min(((alert.targetValue - alert.currentPrice) / alert.targetValue) * 100, 100);
    }
    return 50;
  };

  const getTimeRemaining = () => {
    if (!alert.expiresAt) return null;
    const now = new Date();
    const expires = new Date(alert.expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-200 ${
      !alert.isActive ? 'opacity-60' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-text-primary">
              {alert.symbol.slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{alert.symbol}</h3>
            <p className="text-sm text-text-secondary">{alert.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
            alert.status === 'active' ? 'bg-success/20 text-success' :
            alert.status === 'triggered'? 'bg-warning/20 text-warning' : 'bg-muted text-text-secondary'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              alert.status === 'active' ? 'bg-success' :
              alert.status === 'triggered'? 'bg-warning' : 'bg-text-secondary'
            }`}></div>
            <span className="capitalize">{alert.status}</span>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>
        </div>
      </div>

      {/* Alert Condition */}
      <div className="flex items-center space-x-2 mb-3">
        <Icon 
          name={getConditionIcon(alert.condition)} 
          size={16} 
          className={getConditionColor(alert.condition)}
        />
        <span className="text-sm text-text-primary">
          {formatCondition(alert.condition, alert.targetValue, alert.currentPrice)}
        </span>
      </div>

      {/* Current Price vs Target */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-text-secondary">Current Price</p>
          <p className="font-mono text-lg font-semibold text-text-primary">
            ${alert.currentPrice?.toLocaleString() || '0.00'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-secondary">Target</p>
          <p className="font-mono text-lg font-semibold text-text-primary">
            ${alert.targetValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-secondary">Progress</span>
          <span className="text-xs text-text-secondary">{Math.round(calculateProgress())}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              alert.condition === 'above' || alert.condition === 'percentage_up' ?'bg-success' :'bg-error'
            }`}
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border pt-3 mt-3 space-y-3">
          {/* Notification Methods */}
          <div>
            <p className="text-xs text-text-secondary mb-2">Notifications</p>
            <div className="flex items-center space-x-2">
              {alert.notifications.email && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-surface rounded-full text-xs">
                  <Icon name="Mail" size={12} />
                  <span>Email</span>
                </div>
              )}
              {alert.notifications.push && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-surface rounded-full text-xs">
                  <Icon name="Smartphone" size={12} />
                  <span>Push</span>
                </div>
              )}
              {alert.notifications.sms && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-surface rounded-full text-xs">
                  <Icon name="MessageSquare" size={12} />
                  <span>SMS</span>
                </div>
              )}
            </div>
          </div>

          {/* Time Information */}
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
            {getTimeRemaining() && (
              <span className={getTimeRemaining() === 'Expired' ? 'text-error' : ''}>
                {getTimeRemaining()}
              </span>
            )}
          </div>

          {/* Trigger History */}
          {alert.triggerHistory && alert.triggerHistory.length > 0 && (
            <div>
              <p className="text-xs text-text-secondary mb-2">Recent Triggers</p>
              <div className="space-y-1">
                {alert.triggerHistory.slice(0, 2).map((trigger, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">
                      {new Date(trigger.timestamp).toLocaleString()}
                    </span>
                    <span className="font-mono text-text-primary">
                      ${trigger.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(alert.id)}
            className="text-xs"
          >
            {alert.isActive ? 'Pause' : 'Resume'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(alert)}
            className="text-xs"
          >
            Edit
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(alert.id)}
          className="text-xs text-error hover:text-error"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AlertCard;