import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertStats = ({ alerts }) => {
  const calculateStats = () => {
    const total = alerts.length;
    const active = alerts.filter(alert => alert.status === 'active').length;
    const triggered = alerts.filter(alert => alert.status === 'triggered').length;
    const paused = alerts.filter(alert => !alert.isActive).length;
    
    // Calculate success rate (triggered alerts / total created alerts)
    const successRate = total > 0 ? Math.round((triggered / total) * 100) : 0;
    
    // Calculate alerts expiring soon (within 24 hours)
    const expiringSoon = alerts.filter(alert => {
      if (!alert.expiresAt) return false;
      const now = new Date();
      const expires = new Date(alert.expiresAt);
      const hoursUntilExpiry = (expires - now) / (1000 * 60 * 60);
      return hoursUntilExpiry > 0 && hoursUntilExpiry <= 24;
    }).length;

    // Most common condition
    const conditionCounts = alerts.reduce((acc, alert) => {
      acc[alert.condition] = (acc[alert.condition] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommonCondition = Object.entries(conditionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

    return {
      total,
      active,
      triggered,
      paused,
      successRate,
      expiringSoon,
      mostCommonCondition
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      label: 'Total Alerts',
      value: stats.total,
      icon: 'Bell',
      color: 'text-primary',
      bgColor: 'bg-primary/20'
    },
    {
      label: 'Active',
      value: stats.active,
      icon: 'Play',
      color: 'text-success',
      bgColor: 'bg-success/20'
    },
    {
      label: 'Triggered',
      value: stats.triggered,
      icon: 'CheckCircle',
      color: 'text-warning',
      bgColor: 'bg-warning/20'
    },
    {
      label: 'Paused',
      value: stats.paused,
      icon: 'Pause',
      color: 'text-text-secondary',
      bgColor: 'bg-muted'
    }
  ];

  const getConditionLabel = (condition) => {
    switch (condition) {
      case 'above': return 'Price Above';
      case 'below': return 'Price Below';
      case 'percentage_up': return 'Percentage Up';
      case 'percentage_down': return 'Percentage Down';
      case 'volume': return 'Volume';
      case 'technical': return 'Technical';
      default: return 'None';
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Main Stats */}
      {statCards.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <Icon name={stat.icon} size={20} className={stat.color} />
            </div>
          </div>
        </div>
      ))}

      {/* Additional Stats Row */}
      <div className="col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Success Rate */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Success Rate</p>
              <p className="text-xl font-bold text-text-primary mt-1">
                {stats.successRate}%
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Alerts triggered successfully
              </p>
            </div>
            <div className="p-3 rounded-lg bg-success/20">
              <Icon name="Target" size={20} className="text-success" />
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Expiring Soon</p>
              <p className="text-xl font-bold text-text-primary mt-1">
                {stats.expiringSoon}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Within 24 hours
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              stats.expiringSoon > 0 ? 'bg-warning/20' : 'bg-muted'
            }`}>
              <Icon 
                name="Clock" 
                size={20} 
                className={stats.expiringSoon > 0 ? 'text-warning' : 'text-text-secondary'} 
              />
            </div>
          </div>
        </div>

        {/* Most Common Condition */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Most Used</p>
              <p className="text-sm font-semibold text-text-primary mt-1">
                {getConditionLabel(stats.mostCommonCondition)}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Alert condition type
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/20">
              <Icon name="TrendingUp" size={20} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertStats;