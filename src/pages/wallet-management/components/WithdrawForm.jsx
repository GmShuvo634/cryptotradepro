import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const WithdrawForm = ({ asset, onSubmit, addressBook }) => {
  const [formData, setFormData] = useState({
    address: '',
    amount: '',
    memo: '',
    network: asset.networks[0]?.id || '',
    saveToAddressBook: false,
    addressLabel: '',
    twoFactorCode: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressBook, setShowAddressBook] = useState(false);

  const networkOptions = asset.networks.map(network => ({
    value: network.id,
    label: `${network.name} (${network.symbol})`,
    description: `Fee: ${network.withdrawalFee} ${network.symbol}`
  }));

  const selectedNetwork = asset.networks.find(n => n.id === formData.network);
  const maxAmount = asset.balance - (selectedNetwork?.withdrawalFee || 0);
  const usdValue = formData.amount ? (parseFloat(formData.amount) * asset.price).toFixed(2) : '0.00';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Withdrawal address is required';
    } else if (formData.address.length < 26) {
      newErrors.address = 'Invalid address format';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData.amount) > maxAmount) {
      newErrors.amount = `Insufficient balance. Max: ${maxAmount.toFixed(8)} ${asset.symbol}`;
    } else if (parseFloat(formData.amount) < selectedNetwork?.minWithdrawal) {
      newErrors.amount = `Minimum withdrawal: ${selectedNetwork.minWithdrawal} ${asset.symbol}`;
    }

    if (selectedNetwork?.requiresMemo && !formData.memo.trim()) {
      newErrors.memo = 'Memo is required for this network';
    }

    if (!formData.twoFactorCode.trim()) {
      newErrors.twoFactorCode = '2FA code is required';
    } else if (formData.twoFactorCode.length !== 6) {
      newErrors.twoFactorCode = '2FA code must be 6 digits';
    }

    if (formData.saveToAddressBook && !formData.addressLabel.trim()) {
      newErrors.addressLabel = 'Address label is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectFromAddressBook = (address) => {
    setFormData(prev => ({ ...prev, address: address.address, memo: address.memo || '' }));
    setShowAddressBook(false);
  };

  const setMaxAmount = () => {
    setFormData(prev => ({ ...prev, amount: maxAmount.toFixed(8) }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">{asset.symbol.slice(0, 2)}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Withdraw {asset.name}</h3>
          <p className="text-text-secondary">
            Available: {asset.balance.toFixed(8)} {asset.symbol}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Select
            label="Network"
            description="Choose the blockchain network for withdrawal"
            options={networkOptions}
            value={formData.network}
            onChange={(value) => handleInputChange('network', value)}
            error={errors.network}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-text-primary">
              Withdrawal Address
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              iconName="Book"
              onClick={() => setShowAddressBook(!showAddressBook)}
            >
              Address Book
            </Button>
          </div>
          <Input
            type="text"
            placeholder="Enter withdrawal address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            error={errors.address}
            required
          />
          
          {showAddressBook && addressBook.length > 0 && (
            <div className="mt-2 bg-surface border border-border rounded-lg max-h-40 overflow-y-auto">
              {addressBook.map((address, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectFromAddressBook(address)}
                  className="w-full text-left p-3 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                >
                  <div className="font-medium text-text-primary">{address.label}</div>
                  <div className="text-sm text-text-secondary font-mono truncate">
                    {address.address}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedNetwork?.requiresMemo && (
          <div>
            <Input
              label="Memo/Tag"
              type="text"
              placeholder="Enter memo or tag"
              value={formData.memo}
              onChange={(e) => handleInputChange('memo', e.target.value)}
              error={errors.memo}
              description="Required for this network"
              required
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-text-primary">
              Amount
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={setMaxAmount}
            >
              Max
            </Button>
          </div>
          <Input
            type="number"
            placeholder="0.00000000"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            error={errors.amount}
            step="0.00000001"
            min="0"
            required
          />
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-text-secondary">
              ≈ ${usdValue} USD
            </span>
            <span className="text-text-secondary">
              Fee: {selectedNetwork?.withdrawalFee || 0} {selectedNetwork?.symbol || asset.symbol}
            </span>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Amount:</span>
              <span className="text-text-primary font-mono">
                {formData.amount || '0'} {asset.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Network Fee:</span>
              <span className="text-text-primary font-mono">
                {selectedNetwork?.withdrawalFee || 0} {selectedNetwork?.symbol || asset.symbol}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold">
              <span className="text-text-primary">You'll Receive:</span>
              <span className="text-text-primary font-mono">
                {formData.amount ? (parseFloat(formData.amount) - (selectedNetwork?.withdrawalFee || 0)).toFixed(8) : '0'} {asset.symbol}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Save to Address Book"
            checked={formData.saveToAddressBook}
            onChange={(e) => handleInputChange('saveToAddressBook', e.target.checked)}
          />

          {formData.saveToAddressBook && (
            <Input
              label="Address Label"
              type="text"
              placeholder="e.g., My Exchange Wallet"
              value={formData.addressLabel}
              onChange={(e) => handleInputChange('addressLabel', e.target.value)}
              error={errors.addressLabel}
              required
            />
          )}
        </div>

        <div>
          <Input
            label="2FA Code"
            type="text"
            placeholder="Enter 6-digit code"
            value={formData.twoFactorCode}
            onChange={(e) => handleInputChange('twoFactorCode', e.target.value)}
            error={errors.twoFactorCode}
            maxLength={6}
            required
          />
        </div>

        {errors.submit && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-error text-sm">{errors.submit}</span>
            </div>
          </div>
        )}

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div className="text-sm">
              <p className="text-warning font-medium mb-1">Security Notice:</p>
              <ul className="text-text-secondary space-y-1">
                <li>• Double-check the withdrawal address</li>
                <li>• Withdrawals cannot be reversed</li>
                <li>• Processing time: {selectedNetwork?.processingTime || '5-30 minutes'}</li>
                <li>• Daily limit: {asset.dailyWithdrawalLimit} {asset.symbol}</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          fullWidth
          iconName="ArrowUpRight"
          iconPosition="left"
        >
          {isSubmitting ? 'Processing Withdrawal...' : 'Withdraw'}
        </Button>
      </form>
    </div>
  );
};

export default WithdrawForm;