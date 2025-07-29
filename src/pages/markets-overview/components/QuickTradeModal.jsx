import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Image from '../../../components/AppImage';

const QuickTradeModal = ({ isOpen, onClose, coin, onExecuteTrade }) => {
  const [tradeType, setTradeType] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState(coin?.price || '');
  const [total, setTotal] = useState('');

  const orderTypeOptions = [
    { value: 'market', label: 'Market Order' },
    { value: 'limit', label: 'Limit Order' },
    { value: 'stop', label: 'Stop Order' }
  ];

  const exchangeOptions = [
    { value: 'binance', label: 'Binance' },
    { value: 'coinbase', label: 'Coinbase Pro' },
    { value: 'kraken', label: 'Kraken' }
  ];

  const [selectedExchange, setSelectedExchange] = useState('binance');

  const handleAmountChange = (value) => {
    setAmount(value);
    if (value && price) {
      setTotal((parseFloat(value) * parseFloat(price)).toFixed(2));
    }
  };

  const handlePriceChange = (value) => {
    setPrice(value);
    if (value && amount) {
      setTotal((parseFloat(amount) * parseFloat(value)).toFixed(2));
    }
  };

  const handleTotalChange = (value) => {
    setTotal(value);
    if (value && price) {
      setAmount((parseFloat(value) / parseFloat(price)).toFixed(8));
    }
  };

  const handleExecuteTrade = () => {
    const tradeData = {
      coin: coin.id,
      type: tradeType,
      orderType,
      amount: parseFloat(amount),
      price: parseFloat(price),
      total: parseFloat(total),
      exchange: selectedExchange
    };
    onExecuteTrade(tradeData);
    onClose();
  };

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  if (!isOpen || !coin) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-300" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-400 flex items-center justify-center p-4">
        <div className="bg-background border border-border rounded-lg shadow-elevation w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <Image
                src={coin.image}
                alt={coin.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Quick Trade</h2>
                <p className="text-sm text-text-secondary">{coin.name} ({coin.symbol.toUpperCase()})</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Current Price */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Current Price</span>
                <div className="text-right">
                  <div className="font-mono text-lg font-semibold text-text-primary">
                    {formatPrice(coin.price)}
                  </div>
                  <div className={`text-sm font-mono ${coin.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}% (24h)
                  </div>
                </div>
              </div>
            </div>

            {/* Trade Type Toggle */}
            <div className="flex bg-surface rounded-lg p-1">
              <button
                onClick={() => setTradeType('buy')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  tradeType === 'buy' ?'bg-success text-white' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                Buy {coin.symbol.toUpperCase()}
              </button>
              <button
                onClick={() => setTradeType('sell')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  tradeType === 'sell' ?'bg-error text-white' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sell {coin.symbol.toUpperCase()}
              </button>
            </div>

            {/* Order Type */}
            <Select
              label="Order Type"
              options={orderTypeOptions}
              value={orderType}
              onChange={setOrderType}
            />

            {/* Exchange Selection */}
            <Select
              label="Exchange"
              options={exchangeOptions}
              value={selectedExchange}
              onChange={setSelectedExchange}
            />

            {/* Trade Inputs */}
            <div className="space-y-4">
              <Input
                label={`Amount (${coin.symbol.toUpperCase()})`}
                type="number"
                placeholder="0.00000000"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
              />

              {orderType !== 'market' && (
                <Input
                  label="Price (USD)"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                />
              )}

              <Input
                label="Total (USD)"
                type="number"
                placeholder="0.00"
                value={total}
                onChange={(e) => handleTotalChange(e.target.value)}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Quick Amount</label>
              <div className="grid grid-cols-4 gap-2">
                {['25%', '50%', '75%', '100%'].map((percentage) => (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Mock calculation based on available balance
                      const mockBalance = tradeType === 'buy' ? 1000 : 0.5; // $1000 USD or 0.5 coins
                      const percentValue = parseInt(percentage) / 100;
                      if (tradeType === 'buy') {
                        const usdAmount = mockBalance * percentValue;
                        const coinAmount = usdAmount / coin.price;
                        setAmount(coinAmount.toFixed(8));
                        setTotal(usdAmount.toFixed(2));
                      } else {
                        const coinAmount = mockBalance * percentValue;
                        const usdAmount = coinAmount * coin.price;
                        setAmount(coinAmount.toFixed(8));
                        setTotal(usdAmount.toFixed(2));
                      }
                    }}
                  >
                    {percentage}
                  </Button>
                ))}
              </div>
            </div>

            {/* Trade Summary */}
            <div className="bg-surface border border-border rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Order Type:</span>
                <span className="text-text-primary capitalize">{orderType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Estimated Fee:</span>
                <span className="text-text-primary">$0.25 (0.1%)</span>
              </div>
              <div className="flex justify-between text-sm font-medium border-t border-border pt-2">
                <span className="text-text-secondary">Total Cost:</span>
                <span className="text-text-primary">${(parseFloat(total || 0) + 0.25).toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button variant="outline" fullWidth onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant={tradeType === 'buy' ? 'success' : 'destructive'}
                fullWidth
                onClick={handleExecuteTrade}
                disabled={!amount || !total}
              >
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {coin.symbol.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickTradeModal;