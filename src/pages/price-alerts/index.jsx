import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AlertCard from './components/AlertCard';
import CreateAlertModal from './components/CreateAlertModal';
import AlertFilters from './components/AlertFilters';
import AlertHistory from './components/AlertHistory';
import AlertStats from './components/AlertStats';
import BulkActions from './components/BulkActions';

const PriceAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');
  const [filters, setFilters] = useState({
    status: 'all',
    condition: 'all',
    search: '',
    sortBy: 'created_desc'
  });

  // Initialize mock data
  useEffect(() => {
    const mockAlerts = [
      {
        id: 1,
        symbol: 'BTC',
        name: 'Bitcoin',
        condition: 'above',
        targetValue: 45000,
        currentPrice: 44850,
        status: 'active',
        isActive: true,
        createdAt: '2025-01-28T10:00:00Z',
        expiresAt: '2025-02-04T10:00:00Z',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        note: 'Bull market breakout target',
        triggerHistory: []
      },
      {
        id: 2,
        symbol: 'ETH',
        name: 'Ethereum',
        condition: 'below',
        targetValue: 2800,
        currentPrice: 2845,
        status: 'active',
        isActive: true,
        createdAt: '2025-01-27T15:30:00Z',
        expiresAt: '2025-02-03T15:30:00Z',
        notifications: {
          email: true,
          push: true,
          sms: true
        },
        note: 'Support level watch',
        triggerHistory: []
      },
      {
        id: 3,
        symbol: 'ADA',
        name: 'Cardano',
        condition: 'percentage_up',
        targetValue: 15,
        currentPrice: 0.52,
        status: 'triggered',
        isActive: true,
        createdAt: '2025-01-26T09:15:00Z',
        expiresAt: null,
        notifications: {
          email: true,
          push: false,
          sms: false
        },
        note: 'Momentum play',
        triggerHistory: [
          {
            timestamp: '2025-01-29T08:45:00Z',
            price: 0.598
          }
        ]
      },
      {
        id: 4,
        symbol: 'SOL',
        name: 'Solana',
        condition: 'above',
        targetValue: 100,
        currentPrice: 98.45,
        status: 'active',
        isActive: false,
        createdAt: '2025-01-25T14:20:00Z',
        expiresAt: '2025-02-01T14:20:00Z',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        note: 'Paused for review',
        triggerHistory: []
      },
      {
        id: 5,
        symbol: 'DOT',
        name: 'Polkadot',
        condition: 'volume',
        targetValue: 500,
        currentPrice: 7.23,
        status: 'active',
        isActive: true,
        createdAt: '2025-01-24T11:45:00Z',
        expiresAt: '2025-01-31T11:45:00Z',
        notifications: {
          email: false,
          push: true,
          sms: false
        },
        note: 'Volume breakout signal',
        triggerHistory: []
      }
    ];

    const mockHistory = [
      {
        id: 101,
        symbol: 'BTC',
        condition: 'above',
        targetValue: 43000,
        triggerPrice: 43150,
        status: 'triggered',
        timestamp: '2025-01-28T16:30:00Z',
        createdAt: '2025-01-20T10:00:00Z',
        note: 'Previous resistance level',
        notificationsSent: {
          email: true,
          push: true,
          sms: false
        }
      },
      {
        id: 102,
        symbol: 'ETH',
        condition: 'below',
        targetValue: 2900,
        status: 'expired',
        timestamp: '2025-01-27T23:59:59Z',
        createdAt: '2025-01-20T15:30:00Z',
        note: 'Support test alert',
        notificationsSent: {
          email: true,
          push: false,
          sms: false
        }
      },
      {
        id: 103,
        symbol: 'LINK',
        condition: 'percentage_up',
        targetValue: 20,
        triggerPrice: 17.85,
        status: 'triggered',
        timestamp: '2025-01-26T12:15:00Z',
        createdAt: '2025-01-22T09:00:00Z',
        note: 'Momentum breakout',
        notificationsSent: {
          email: true,
          push: true,
          sms: true
        }
      }
    ];

    setAlerts(mockAlerts);
    setAlertHistory(mockHistory);
  }, []);

  // Filter and sort alerts
  const filteredAlerts = alerts.filter(alert => {
    if (filters.status !== 'all' && alert.status !== filters.status) return false;
    if (filters.condition !== 'all' && alert.condition !== filters.condition) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return alert.symbol.toLowerCase().includes(searchLower) ||
             alert.name.toLowerCase().includes(searchLower) ||
             alert.note?.toLowerCase().includes(searchLower);
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'created_asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'created_desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'symbol_asc':
        return a.symbol.localeCompare(b.symbol);
      case 'symbol_desc':
        return b.symbol.localeCompare(a.symbol);
      case 'target_asc':
        return a.targetValue - b.targetValue;
      case 'target_desc':
        return b.targetValue - a.targetValue;
      default:
        return 0;
    }
  });

  // Calculate alert counts for filters
  const alertCounts = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    triggered: alerts.filter(a => a.status === 'triggered').length,
    paused: alerts.filter(a => !a.isActive).length,
    expired: alerts.filter(a => a.status === 'expired').length
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      condition: 'all',
      search: '',
      sortBy: 'created_desc'
    });
  };

  const handleCreateAlert = (newAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleEditAlert = (alert) => {
    // In a real app, this would open an edit modal
    console.log('Edit alert:', alert);
  };

  const handleDeleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setSelectedAlerts(prev => prev.filter(id => id !== alertId));
  };

  const handleToggleAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, isActive: !alert.isActive, status: alert.isActive ? 'paused' : 'active' }
        : alert
    ));
  };

  const handleSelectAlert = (alertId) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map(alert => alert.id));
    }
  };

  const handleBulkAction = (action, alertIds) => {
    switch (action) {
      case 'pause':
        setAlerts(prev => prev.map(alert => 
          alertIds.includes(alert.id) 
            ? { ...alert, isActive: false, status: 'paused' }
            : alert
        ));
        break;
      case 'resume':
        setAlerts(prev => prev.map(alert => 
          alertIds.includes(alert.id) 
            ? { ...alert, isActive: true, status: 'active' }
            : alert
        ));
        break;
      case 'delete':
        setAlerts(prev => prev.filter(alert => !alertIds.includes(alert.id)));
        break;
      case 'duplicate':
        const alertsToDuplicate = alerts.filter(alert => alertIds.includes(alert.id));
        const duplicatedAlerts = alertsToDuplicate.map(alert => ({
          ...alert,
          id: Date.now() + Math.random(),
          createdAt: new Date().toISOString(),
          note: `${alert.note} (Copy)`
        }));
        setAlerts(prev => [...duplicatedAlerts, ...prev]);
        break;
      case 'export':
        // In a real app, this would export to CSV
        console.log('Export alerts:', alertIds);
        break;
    }
  };

  const handleClearHistory = () => {
    setAlertHistory([]);
  };

  const tabs = [
    { id: 'alerts', label: 'Active Alerts', count: alertCounts.active },
    { id: 'history', label: 'History', count: alertHistory.length }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Price Alerts</h1>
              <p className="text-text-secondary mt-1">
                Monitor cryptocurrency prices with customizable notifications
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Settings"
                iconPosition="left"
                className="hidden md:flex"
              >
                Alert Settings
              </Button>
              
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Create Alert
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="font-medium">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-1 bg-surface text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'alerts' ? (
          <>
            {/* Alert Stats */}
            <AlertStats alerts={alerts} />

            {/* Filters */}
            <AlertFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              alertCounts={alertCounts}
            />

            {/* Bulk Selection Header */}
            {filteredAlerts.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAlerts.length === filteredAlerts.length && filteredAlerts.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-text-secondary">
                      Select all ({filteredAlerts.length})
                    </span>
                  </label>
                  
                  {selectedAlerts.length > 0 && (
                    <span className="text-sm text-primary">
                      {selectedAlerts.length} selected
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Refresh Prices
                  </Button>
                </div>
              </div>
            )}

            {/* Alerts Grid */}
            {filteredAlerts.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Icon name="Bell" size={64} className="text-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {filters.search || filters.status !== 'all' || filters.condition !== 'all' ?'No alerts match your filters' :'No price alerts yet'
                  }
                </h3>
                <p className="text-text-secondary mb-6">
                  {filters.search || filters.status !== 'all' || filters.condition !== 'all' ?'Try adjusting your search criteria or filters to find alerts.' :'Create your first price alert to get notified when cryptocurrencies reach your target prices.'
                  }
                </p>
                {(!filters.search && filters.status === 'all' && filters.condition === 'all') && (
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Create Your First Alert
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="relative">
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedAlerts.includes(alert.id)}
                        onChange={() => handleSelectAlert(alert.id)}
                        className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                      />
                    </div>
                    
                    <AlertCard
                      alert={alert}
                      onEdit={handleEditAlert}
                      onDelete={handleDeleteAlert}
                      onToggle={handleToggleAlert}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <AlertHistory
            history={alertHistory}
            onClearHistory={handleClearHistory}
          />
        )}
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedAlerts={selectedAlerts}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedAlerts([])}
        totalAlerts={filteredAlerts.length}
      />

      {/* Create Alert Modal */}
      <CreateAlertModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAlert={handleCreateAlert}
      />
    </div>
  );
};

export default PriceAlerts;