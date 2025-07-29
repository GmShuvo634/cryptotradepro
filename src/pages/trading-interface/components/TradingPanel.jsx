import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TradingPanel = ({ selectedPair, currentPrice }) => {
  const [activeTab, setActiveTab] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [total, setTotal] = useState('');
  const [leverage, setLeverage] = useState('1');

  const orderTypes = [
    { value: 'market', label: 'Market' },
    { value: 'limit', label: 'Limit' },
    { value: 'stop', label: 'Stop' },
    { value: 'stop_limit', label: 'Stop Limit' },
    { value: 'oco', label: 'OCO' },
    { value: 'trailing', label: 'Trailing Stop' }
  ];

  const leverageOptions = [
    { value: '1', label: '1x' },
    { value: '2', label: '2x' },
    { value: '5', label: '5x' },
    { value: '10', label: '10x' },
    { value: '20', label: '20x' },
    { value: '50', label: '50x' },
    { value: '100', label: '100x' }
  ];

  const quickAmounts = ['25%', '50%', '75%', '100%'];

  const handleQuickAmount = (percentage) => {
    const availableBalance = 10000; // Mock balance
    const percentValue = parseInt(percentage) / 100;
    const calculatedAmount = (availableBalance * percentValue / currentPrice).toFixed(6);
    setAmount(calculatedAmount);
    setTotal((calculatedAmount * currentPrice).toFixed(2));
  };

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
      setAmount((parseFloat(value) / parseFloat(price)).toFixed(6));
    }
  };

  const calculateFees = () => {
    const totalValue = parseFloat(total) || 0;
    const feeRate = 0.001; // 0.1% fee
    return (totalValue * feeRate).toFixed(2);
  };

  const handleSubmitOrder = () => {
    const orderData = {
      type: activeTab,
      orderType,
      pair: selectedPair,
      amount: parseFloat(amount),
      price: orderType === 'market' ? currentPrice : parseFloat(price),
      total: parseFloat(total),
      leverage: parseInt(leverage),
      timestamp: new Date()
    };
    
    console.log('Submitting order:', orderData);
    // Here you would typically send the order to your trading API
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Trading Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'buy' ?'text-success border-b-2 border-success bg-success/5' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="TrendingUp" size={16} />
            <span>Buy {selectedPair.split('/')[0]}</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'sell' ?'text-error border-b-2 border-error bg-error/5' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="TrendingDown" size={16} />
            <span>Sell {selectedPair.split('/')[0]}</span>
          </div>
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Order Type Selection */}
        <Select
          label="Order Type"
          options={orderTypes}
          value={orderType}
          onChange={setOrderType}
        />

        {/* Leverage Selection (for margin trading) */}
        <Select
          label="Leverage"
          options={leverageOptions}
          value={leverage}
          onChange={setLeverage}
          description="Higher leverage increases both potential profits and losses"
        />

        {/* Price Input (for limit orders) */}
        {orderType !== 'market' && (
          <Input
            label="Price"
            type="number"
            placeholder="0.00"
            value={price}
            onChange={(e) => handlePriceChange(e.target.value)}
            description={`Current price: $${currentPrice.toLocaleString()}`}
          />
        )}

        {/* Stop Price (for stop orders) */}
        {(orderType === 'stop' || orderType === 'stop_limit' || orderType === 'oco') && (
          <Input
            label="Stop Price"
            type="number"
            placeholder="0.00"
            value={stopPrice}
            onChange={(e) => setStopPrice(e.target.value)}
            description="Trigger price for stop order"
          />
        )}

        {/* Amount Input */}
        <div>
          <Input
            label="Amount"
            type="number"
            placeholder="0.000000"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            description={`Available: 0.25 ${selectedPair.split('/')[0]}`}
          />
          
          {/* Quick Amount Buttons */}
          <div className="flex space-x-2 mt-2">
            {quickAmounts.map((percentage) => (
              <button
                key={percentage}
                onClick={() => handleQuickAmount(percentage)}
                className="flex-1 py-1 px-2 text-xs font-medium text-text-secondary hover:text-text-primary bg-surface hover:bg-surface/80 rounded transition-colors"
              >
                {percentage}
              </button>
            ))}
          </div>
        </div>

        {/* Total Input */}
        <Input
          label="Total"
          type="number"
          placeholder="0.00"
          value={total}
          onChange={(e) => handleTotalChange(e.target.value)}
          description={`Available: $10,000.00 USD`}
        />

        {/* Order Summary */}
        <div className="bg-surface rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Order Value:</span>
            <span className="font-mono text-text-primary">${total || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Trading Fee (0.1%):</span>
            <span className="font-mono text-text-primary">${calculateFees()}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-border pt-2">
            <span className="text-text-secondary">Total Cost:</span>
            <span className="font-mono font-semibold text-text-primary">
              ${(parseFloat(total || 0) + parseFloat(calculateFees())).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Risk Warning */}
        {parseInt(leverage) > 1 && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-xs text-warning">
                <p className="font-medium">High Risk Warning</p>
                <p>Trading with {leverage}x leverage can result in significant losses. Only trade with funds you can afford to lose.</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          variant={activeTab === 'buy' ? 'success' : 'destructive'}
          size="lg"
          fullWidth
          onClick={handleSubmitOrder}
          disabled={!amount || (!price && orderType !== 'market')}
          iconName={activeTab === 'buy' ? 'TrendingUp' : 'TrendingDown'}
          iconPosition="left"
        >
          {activeTab === 'buy' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}
        </Button>

        {/* Quick Trade Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Zap"
            iconPosition="left"
          >
            Quick Buy
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Target"
            iconPosition="left"
          >
            Set Alert
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;