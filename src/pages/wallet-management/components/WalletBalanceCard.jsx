import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletBalanceCard = ({ asset, onSend, onReceive, onTrade }) => {
  const formatBalance = (balance) => {
    return balance.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 8 
    });
  };

  const formatUSDValue = (value) => {
    return value.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    });
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-text-secondary';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:bg-surface/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{asset.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{asset.name}</h3>
            <p className="text-sm text-text-secondary">{asset.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-semibold text-text-primary">
            {formatBalance(asset.balance)}
          </p>
          <p className="text-sm text-text-secondary">{asset.symbol}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-text-secondary">USD Value</p>
          <p className="font-semibold text-text-primary">
            {formatUSDValue(asset.usdValue)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-secondary">24h Change</p>
          <p className={`font-semibold ${getChangeColor(asset.change24h)}`}>
            {asset.change24h > 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
          </p>
        </div>
      </div>

      {asset.locked > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Lock" size={16} className="text-warning" />
            <span className="text-sm text-warning">
              {formatBalance(asset.locked)} {asset.symbol} locked in orders
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          iconName="ArrowUpRight"
          iconPosition="left"
          onClick={() => onSend(asset)}
          className="flex-1"
        >
          Send
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="ArrowDownLeft"
          iconPosition="left"
          onClick={() => onReceive(asset)}
          className="flex-1"
        >
          Receive
        </Button>
        <Button
          variant="default"
          size="sm"
          iconName="TrendingUp"
          iconPosition="left"
          onClick={() => onTrade(asset)}
          className="flex-1"
        >
          Trade
        </Button>
      </div>
    </div>
  );
};

export default WalletBalanceCard;