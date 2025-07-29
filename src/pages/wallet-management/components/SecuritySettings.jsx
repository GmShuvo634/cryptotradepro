import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecuritySettings = ({ settings, onUpdateSettings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(settings);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.dailyWithdrawalLimit <= 0) {
      newErrors.dailyWithdrawalLimit = 'Daily limit must be greater than 0';
    }

    if (formData.requireWhitelistForLargeWithdrawals && formData.largeWithdrawalThreshold <= 0) {
      newErrors.largeWithdrawalThreshold = 'Threshold must be greater than 0';
    }

    if (!twoFactorCode.trim()) {
      newErrors.twoFactorCode = '2FA code is required to save changes';
    } else if (twoFactorCode.length !== 6) {
      newErrors.twoFactorCode = '2FA code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onUpdateSettings(formData, twoFactorCode);
    setIsEditing(false);
    setTwoFactorCode('');
  };

  const handleCancel = () => {
    setFormData(settings);
    setIsEditing(false);
    setTwoFactorCode('');
    setErrors({});
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Security Settings</h3>
          <p className="text-text-secondary">Manage your wallet security preferences</p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Edit Settings
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Daily Withdrawal Limit (USD)"
              type="number"
              value={formData.dailyWithdrawalLimit}
              onChange={(e) => handleInputChange('dailyWithdrawalLimit', parseFloat(e.target.value))}
              error={errors.dailyWithdrawalLimit}
              min="0"
              step="100"
              required
            />
            <Input
              label="Large Withdrawal Threshold (USD)"
              type="number"
              value={formData.largeWithdrawalThreshold}
              onChange={(e) => handleInputChange('largeWithdrawalThreshold', parseFloat(e.target.value))}
              error={errors.largeWithdrawalThreshold}
              min="0"
              step="100"
              description="Withdrawals above this amount require additional verification"
            />
          </div>

          <div className="space-y-4">
            <Checkbox
              label="Require 2FA for all withdrawals"
              description="Always require two-factor authentication for withdrawal requests"
              checked={formData.require2FAForWithdrawals}
              onChange={(e) => handleInputChange('require2FAForWithdrawals', e.target.checked)}
            />
            <Checkbox
              label="Require whitelist for large withdrawals"
              description="Large withdrawals can only be sent to whitelisted addresses"
              checked={formData.requireWhitelistForLargeWithdrawals}
              onChange={(e) => handleInputChange('requireWhitelistForLargeWithdrawals', e.target.checked)}
            />
            <Checkbox
              label="Email notifications for all transactions"
              description="Receive email alerts for deposits, withdrawals, and trades"
              checked={formData.emailNotifications}
              onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
            />
            <Checkbox
              label="SMS notifications for withdrawals"
              description="Receive SMS alerts for withdrawal requests and confirmations"
              checked={formData.smsNotifications}
              onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
            />
            <Checkbox
              label="Lock account after suspicious activity"
              description="Automatically lock account if suspicious activity is detected"
              checked={formData.autoLockOnSuspiciousActivity}
              onChange={(e) => handleInputChange('autoLockOnSuspiciousActivity', e.target.checked)}
            />
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-sm">
                <p className="text-warning font-medium mb-1">Security Notice:</p>
                <p className="text-text-secondary">
                  Changes to security settings require 2FA verification and may take up to 24 hours to take effect.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="2FA Code"
            type="text"
            placeholder="Enter 6-digit code"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            error={errors.twoFactorCode}
            maxLength={6}
            required
          />

          <div className="flex items-center space-x-2">
            <Button
              type="submit"
              variant="default"
              size="sm"
              iconName="Save"
              iconPosition="left"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="DollarSign" size={16} className="text-primary" />
                <span className="font-medium text-text-primary">Daily Withdrawal Limit</span>
              </div>
              <p className="text-2xl font-semibold text-text-primary">
                ${settings.dailyWithdrawalLimit.toLocaleString()}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Remaining today: ${settings.remainingDailyLimit.toLocaleString()}
              </p>
            </div>
            <div className="bg-surface rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="font-medium text-text-primary">Large Withdrawal Threshold</span>
              </div>
              <p className="text-2xl font-semibold text-text-primary">
                ${settings.largeWithdrawalThreshold.toLocaleString()}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Requires additional verification
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center space-x-3">
                <Icon name="Shield" size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-text-primary">2FA for Withdrawals</p>
                  <p className="text-sm text-text-secondary">Two-factor authentication required</p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${settings.require2FAForWithdrawals ? 'text-success' : 'text-text-secondary'}`}>
                <Icon name={settings.require2FAForWithdrawals ? "CheckCircle" : "Circle"} size={20} />
                <span className="text-sm">{settings.require2FAForWithdrawals ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center space-x-3">
                <Icon name="List" size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-text-primary">Whitelist for Large Withdrawals</p>
                  <p className="text-sm text-text-secondary">Restrict large withdrawals to whitelisted addresses</p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${settings.requireWhitelistForLargeWithdrawals ? 'text-success' : 'text-text-secondary'}`}>
                <Icon name={settings.requireWhitelistForLargeWithdrawals ? "CheckCircle" : "Circle"} size={20} />
                <span className="text-sm">{settings.requireWhitelistForLargeWithdrawals ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-text-primary">Email Notifications</p>
                  <p className="text-sm text-text-secondary">Receive email alerts for transactions</p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${settings.emailNotifications ? 'text-success' : 'text-text-secondary'}`}>
                <Icon name={settings.emailNotifications ? "CheckCircle" : "Circle"} size={20} />
                <span className="text-sm">{settings.emailNotifications ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center space-x-3">
                <Icon name="Smartphone" size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-text-primary">SMS Notifications</p>
                  <p className="text-sm text-text-secondary">Receive SMS alerts for withdrawals</p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${settings.smsNotifications ? 'text-success' : 'text-text-secondary'}`}>
                <Icon name={settings.smsNotifications ? "CheckCircle" : "Circle"} size={20} />
                <span className="text-sm">{settings.smsNotifications ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Icon name="Lock" size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-text-primary">Auto-Lock on Suspicious Activity</p>
                  <p className="text-sm text-text-secondary">Automatically lock account if threats detected</p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${settings.autoLockOnSuspiciousActivity ? 'text-success' : 'text-text-secondary'}`}>
                <Icon name={settings.autoLockOnSuspiciousActivity ? "CheckCircle" : "Circle"} size={20} />
                <span className="text-sm">{settings.autoLockOnSuspiciousActivity ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;