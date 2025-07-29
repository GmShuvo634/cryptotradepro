import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DepositAddressCard = ({ asset, onNetworkChange }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(asset.networks[0]);

  const networkOptions = asset.networks.map(network => ({
    value: network.id,
    label: `${network.name} (${network.symbol})`,
    description: `Fee: ${network.fee} ${network.symbol}`
  }));

  const handleNetworkChange = (networkId) => {
    const network = asset.networks.find(n => n.id === networkId);
    setSelectedNetwork(network);
    onNetworkChange(asset.symbol, network);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateQRCode = (address) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">{asset.symbol.slice(0, 2)}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{asset.name}</h3>
          <p className="text-text-secondary">Deposit {asset.symbol}</p>
        </div>
      </div>

      <div className="mb-6">
        <Select
          label="Network"
          description="Choose the blockchain network for your deposit"
          options={networkOptions}
          value={selectedNetwork.id}
          onChange={handleNetworkChange}
          className="mb-4"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Deposit Address
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-surface border border-border rounded-lg p-3 font-mono text-sm text-text-primary break-all">
                {selectedNetwork.address}
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName={copiedAddress ? "Check" : "Copy"}
                onClick={() => copyToClipboard(selectedNetwork.address)}
              >
                {copiedAddress ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {selectedNetwork.memo && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Memo/Tag
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-surface border border-border rounded-lg p-3 font-mono text-sm text-text-primary">
                  {selectedNetwork.memo}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Copy"
                  onClick={() => copyToClipboard(selectedNetwork.memo)}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-sm">
                <p className="text-warning font-medium mb-1">Important Notes:</p>
                <ul className="text-text-secondary space-y-1">
                  <li>• Minimum deposit: {selectedNetwork.minDeposit} {asset.symbol}</li>
                  <li>• Network fee: {selectedNetwork.fee} {selectedNetwork.symbol}</li>
                  <li>• Confirmations required: {selectedNetwork.confirmations}</li>
                  <li>• Only send {asset.symbol} to this address</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-4">
            <p className="text-sm font-medium text-text-primary mb-2 text-center">
              QR Code
            </p>
            <div className="bg-white p-4 rounded-lg">
              <img
                src={generateQRCode(selectedNetwork.address)}
                alt="Deposit Address QR Code"
                className="w-48 h-48"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Save QR Code
          </Button>
        </div>
      </div>

      <div className="mt-6 bg-muted rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Clock" size={16} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">Processing Time</span>
        </div>
        <p className="text-sm text-text-secondary">
          Deposits typically arrive within {selectedNetwork.estimatedTime} after {selectedNetwork.confirmations} network confirmations.
        </p>
      </div>
    </div>
  );
};

export default DepositAddressCard;