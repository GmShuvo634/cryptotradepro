import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AddressBookManager = ({ addresses, onAdd, onEdit, onDelete, onToggleWhitelist }) => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNetwork, setFilterNetwork] = useState('all');
  const [formData, setFormData] = useState({
    label: '',
    address: '',
    network: '',
    memo: '',
    isWhitelisted: false
  });
  const [errors, setErrors] = useState({});

  const networkOptions = [
    { value: 'all', label: 'All Networks' },
    { value: 'bitcoin', label: 'Bitcoin (BTC)' },
    { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'binance-smart-chain', label: 'Binance Smart Chain (BSC)' },
    { value: 'polygon', label: 'Polygon (MATIC)' },
    { value: 'solana', label: 'Solana (SOL)' }
  ];

  const addNetworkOptions = networkOptions.slice(1); // Remove 'all' option for adding

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Label is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length < 26) {
      newErrors.address = 'Invalid address format';
    }

    if (!formData.network) {
      newErrors.network = 'Network is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingAddress) {
      onEdit(editingAddress.id, formData);
      setEditingAddress(null);
    } else {
      onAdd(formData);
      setIsAddingAddress(false);
    }

    setFormData({
      label: '',
      address: '',
      network: '',
      memo: '',
      isWhitelisted: false
    });
  };

  const handleEdit = (address) => {
    setFormData({
      label: address.label,
      address: address.address,
      network: address.network,
      memo: address.memo || '',
      isWhitelisted: address.isWhitelisted
    });
    setEditingAddress(address);
    setIsAddingAddress(true);
  };

  const handleCancel = () => {
    setIsAddingAddress(false);
    setEditingAddress(null);
    setFormData({
      label: '',
      address: '',
      network: '',
      memo: '',
      isWhitelisted: false
    });
    setErrors({});
  };

  const filteredAddresses = addresses.filter(address => {
    if (filterNetwork !== 'all' && address.network !== filterNetwork) return false;
    if (searchTerm && !address.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !address.address.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getNetworkIcon = (network) => {
    switch (network) {
      case 'bitcoin': return 'Bitcoin';
      case 'ethereum': return 'Ethereum';
      case 'binance-smart-chain': return 'Binance';
      case 'polygon': return 'Polygon';
      case 'solana': return 'Solana';
      default: return 'Circle';
    }
  };

  const getNetworkColor = (network) => {
    switch (network) {
      case 'bitcoin': return 'text-orange-500 bg-orange-500/10';
      case 'ethereum': return 'text-blue-500 bg-blue-500/10';
      case 'binance-smart-chain': return 'text-yellow-500 bg-yellow-500/10';
      case 'polygon': return 'text-purple-500 bg-purple-500/10';
      case 'solana': return 'text-green-500 bg-green-500/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Address Book</h3>
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setIsAddingAddress(true)}
          >
            Add Address
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Search Addresses"
            type="search"
            placeholder="Search by label or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            label="Filter by Network"
            options={networkOptions}
            value={filterNetwork}
            onChange={setFilterNetwork}
          />
        </div>
      </div>

      {isAddingAddress && (
        <div className="p-6 border-b border-border bg-surface/50">
          <h4 className="text-md font-semibold text-text-primary mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Label"
                type="text"
                placeholder="e.g., My Exchange Wallet"
                value={formData.label}
                onChange={(e) => handleInputChange('label', e.target.value)}
                error={errors.label}
                required
              />
              <Select
                label="Network"
                options={addNetworkOptions}
                value={formData.network}
                onChange={(value) => handleInputChange('network', value)}
                error={errors.network}
                required
              />
            </div>
            <Input
              label="Address"
              type="text"
              placeholder="Enter wallet address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={errors.address}
              required
            />
            <Input
              label="Memo/Tag (Optional)"
              type="text"
              placeholder="Enter memo or tag if required"
              value={formData.memo}
              onChange={(e) => handleInputChange('memo', e.target.value)}
              description="Only required for certain networks"
            />
            <Checkbox
              label="Add to withdrawal whitelist"
              description="Whitelisted addresses can be used without 2FA verification"
              checked={formData.isWhitelisted}
              onChange={(e) => handleInputChange('isWhitelisted', e.target.checked)}
            />
            <div className="flex items-center space-x-2">
              <Button
                type="submit"
                variant="default"
                size="sm"
                iconName={editingAddress ? "Save" : "Plus"}
                iconPosition="left"
              >
                {editingAddress ? 'Update Address' : 'Add Address'}
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
        </div>
      )}

      <div className="overflow-x-auto">
        {filteredAddresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon name="Book" size={48} className="text-text-secondary mb-4" />
            <p className="text-text-secondary">No addresses saved</p>
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setIsAddingAddress(true)}
              className="mt-2"
            >
              Add your first address
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredAddresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center justify-between p-4 hover:bg-surface/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNetworkColor(address.network)}`}>
                    <Icon name="Wallet" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-text-primary">{address.label}</p>
                      {address.isWhitelisted && (
                        <div className="flex items-center space-x-1 bg-success/10 text-success px-2 py-1 rounded-full">
                          <Icon name="Shield" size={12} />
                          <span className="text-xs">Whitelisted</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary capitalize">
                      {address.network.replace('-', ' ')}
                    </p>
                    <p className="text-xs text-text-secondary font-mono">
                      {address.address.slice(0, 16)}...{address.address.slice(-8)}
                    </p>
                    {address.memo && (
                      <p className="text-xs text-text-secondary">
                        Memo: {address.memo}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={address.isWhitelisted ? "ShieldOff" : "Shield"}
                    onClick={() => onToggleWhitelist(address.id)}
                  >
                    {address.isWhitelisted ? 'Remove from Whitelist' : 'Add to Whitelist'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Edit"
                    onClick={() => handleEdit(address)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    onClick={() => onDelete(address.id)}
                    className="text-error hover:text-error"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBookManager;