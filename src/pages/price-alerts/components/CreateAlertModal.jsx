import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateAlertModal = ({ isOpen, onClose, onCreateAlert }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    condition: 'above',
    targetValue: '',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    expiresIn: '7d',
    note: ''
  });

  const [errors, setErrors] = useState({});

  const cryptocurrencies = [
    { value: 'BTC', label: 'Bitcoin (BTC)', name: 'Bitcoin' },
    { value: 'ETH', label: 'Ethereum (ETH)', name: 'Ethereum' },
    { value: 'ADA', label: 'Cardano (ADA)', name: 'Cardano' },
    { value: 'SOL', label: 'Solana (SOL)', name: 'Solana' },
    { value: 'DOT', label: 'Polkadot (DOT)', name: 'Polkadot' },
    { value: 'LINK', label: 'Chainlink (LINK)', name: 'Chainlink' },
    { value: 'MATIC', label: 'Polygon (MATIC)', name: 'Polygon' },
    { value: 'AVAX', label: 'Avalanche (AVAX)', name: 'Avalanche' }
  ];

  const conditionOptions = [
    { value: 'above', label: 'Price Above' },
    { value: 'below', label: 'Price Below' },
    { value: 'percentage_up', label: 'Percentage Increase' },
    { value: 'percentage_down', label: 'Percentage Decrease' },
    { value: 'volume', label: 'Volume Threshold' },
    { value: 'technical', label: 'Technical Indicator' }
  ];

  const expirationOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '1d', label: '1 Day' },
    { value: '3d', label: '3 Days' },
    { value: '7d', label: '1 Week' },
    { value: '30d', label: '1 Month' },
    { value: 'never', label: 'Never' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCryptoSelect = (value) => {
    const selected = cryptocurrencies.find(crypto => crypto.value === value);
    setFormData(prev => ({
      ...prev,
      symbol: value,
      name: selected?.name || ''
    }));
  };

  const handleNotificationChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: checked
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.symbol) {
      newErrors.symbol = 'Please select a cryptocurrency';
    }

    if (!formData.targetValue) {
      newErrors.targetValue = 'Please enter a target value';
    } else if (isNaN(formData.targetValue) || parseFloat(formData.targetValue) <= 0) {
      newErrors.targetValue = 'Please enter a valid positive number';
    }

    if (!formData.notifications.email && !formData.notifications.push && !formData.notifications.sms) {
      newErrors.notifications = 'Please select at least one notification method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newAlert = {
      id: Date.now(),
      symbol: formData.symbol,
      name: formData.name,
      condition: formData.condition,
      targetValue: parseFloat(formData.targetValue),
      notifications: formData.notifications,
      status: 'active',
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: formData.expiresIn !== 'never' ? 
        new Date(Date.now() + getExpirationMs(formData.expiresIn)).toISOString() : null,
      note: formData.note,
      currentPrice: getCurrentPrice(formData.symbol),
      triggerHistory: []
    };

    onCreateAlert(newAlert);
    onClose();
    
    // Reset form
    setFormData({
      symbol: '',
      name: '',
      condition: 'above',
      targetValue: '',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      expiresIn: '7d',
      note: ''
    });
    setErrors({});
  };

  const getExpirationMs = (expiration) => {
    const multipliers = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '3d': 3 * 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    return multipliers[expiration] || 0;
  };

  const getCurrentPrice = (symbol) => {
    const mockPrices = {
      'BTC': 44850,
      'ETH': 2845,
      'ADA': 0.52,
      'SOL': 98.45,
      'DOT': 7.23,
      'LINK': 14.67,
      'MATIC': 0.89,
      'AVAX': 36.78
    };
    return mockPrices[symbol] || 0;
  };

  const getConditionLabel = () => {
    switch (formData.condition) {
      case 'above': case'below':
        return 'Target Price ($)';
      case 'percentage_up': case'percentage_down':
        return 'Percentage (%)';
      case 'volume':
        return 'Volume (Million $)';
      case 'technical':
        return 'Indicator Value';
      default:
        return 'Target Value';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-400" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-500 flex items-center justify-center p-4">
        <div className="bg-background border border-border rounded-lg shadow-elevation w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Create Price Alert</h2>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Cryptocurrency Selection */}
            <Select
              label="Cryptocurrency"
              placeholder="Select cryptocurrency"
              options={cryptocurrencies}
              value={formData.symbol}
              onChange={handleCryptoSelect}
              error={errors.symbol}
              required
              searchable
            />

            {/* Alert Condition */}
            <Select
              label="Alert Condition"
              options={conditionOptions}
              value={formData.condition}
              onChange={(value) => handleInputChange('condition', value)}
              required
            />

            {/* Target Value */}
            <Input
              label={getConditionLabel()}
              type="number"
              placeholder="Enter target value"
              value={formData.targetValue}
              onChange={(e) => handleInputChange('targetValue', e.target.value)}
              error={errors.targetValue}
              required
              step="0.01"
            />

            {/* Current Price Display */}
            {formData.symbol && (
              <div className="bg-surface rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Current Price</span>
                  <span className="font-mono text-lg font-semibold text-text-primary">
                    ${getCurrentPrice(formData.symbol).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Notification Methods */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Notification Methods
              </label>
              <div className="space-y-2">
                <Checkbox
                  label="Email notifications"
                  checked={formData.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                />
                <Checkbox
                  label="Push notifications"
                  checked={formData.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                />
                <Checkbox
                  label="SMS notifications"
                  checked={formData.notifications.sms}
                  onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                />
              </div>
              {errors.notifications && (
                <p className="text-sm text-error mt-1">{errors.notifications}</p>
              )}
            </div>

            {/* Expiration */}
            <Select
              label="Alert Expiration"
              options={expirationOptions}
              value={formData.expiresIn}
              onChange={(value) => handleInputChange('expiresIn', value)}
              required
            />

            {/* Note */}
            <Input
              label="Note (Optional)"
              placeholder="Add a note for this alert"
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              maxLength={200}
            />

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                iconName="Bell"
                iconPosition="left"
              >
                Create Alert
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAlertModal;