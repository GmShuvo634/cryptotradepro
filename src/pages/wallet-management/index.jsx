import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import WalletBalanceCard from './components/WalletBalanceCard';
import DepositAddressCard from './components/DepositAddressCard';
import WithdrawForm from './components/WithdrawForm';
import TransactionHistory from './components/TransactionHistory';
import AddressBookManager from './components/AddressBookManager';
import SecuritySettings from './components/SecuritySettings';

const WalletManagement = () => {
  const [activeTab, setActiveTab] = useState('balances');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [walletData, setWalletData] = useState({
    totalBalance: 0,
    assets: [],
    transactions: [],
    addressBook: [],
    securitySettings: {}
  });

  useEffect(() => {
    // Mock wallet data
    const mockWalletData = {
      totalBalance: 125847.32,
      assets: [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          balance: 2.85647321,
          locked: 0.05000000,
          price: 44850.00,
          usdValue: 128234.56,
          change24h: 2.45,
          dailyWithdrawalLimit: 50000,
          networks: [
            {
              id: 'bitcoin',
              name: 'Bitcoin',
              symbol: 'BTC',
              address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
              minDeposit: 0.0001,
              fee: 0.0005,
              confirmations: 3,
              estimatedTime: '10-30 minutes',
              withdrawalFee: 0.0005,
              minWithdrawal: 0.001,
              processingTime: '5-30 minutes',
              requiresMemo: false
            }
          ]
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: 15.24567890,
          locked: 2.50000000,
          price: 2845.00,
          usdValue: 43374.56,
          change24h: -1.23,
          dailyWithdrawalLimit: 30000,
          networks: [
            {
              id: 'ethereum',
              name: 'Ethereum',
              symbol: 'ETH',
              address: '0x742d35Cc6634C0532925a3b8D4C8C1b8C8C8C8C8',
              minDeposit: 0.01,
              fee: 0.005,
              confirmations: 12,
              estimatedTime: '2-5 minutes',
              withdrawalFee: 0.005,
              minWithdrawal: 0.01,
              processingTime: '2-10 minutes',
              requiresMemo: false
            }
          ]
        },
        {
          symbol: 'USDT',
          name: 'Tether USD',
          balance: 25000.00000000,
          locked: 0.00000000,
          price: 1.00,
          usdValue: 25000.00,
          change24h: 0.01,
          dailyWithdrawalLimit: 100000,
          networks: [
            {
              id: 'ethereum',
              name: 'Ethereum (ERC-20)',
              symbol: 'ETH',
              address: '0x742d35Cc6634C0532925a3b8D4C8C1b8C8C8C8C8',
              minDeposit: 10,
              fee: 5,
              confirmations: 12,
              estimatedTime: '2-5 minutes',
              withdrawalFee: 5,
              minWithdrawal: 10,
              processingTime: '2-10 minutes',
              requiresMemo: false
            },
            {
              id: 'tron',
              name: 'Tron (TRC-20)',
              symbol: 'TRX',
              address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
              minDeposit: 1,
              fee: 1,
              confirmations: 20,
              estimatedTime: '1-3 minutes',
              withdrawalFee: 1,
              minWithdrawal: 10,
              processingTime: '1-5 minutes',
              requiresMemo: false
            }
          ]
        },
        {
          symbol: 'BNB',
          name: 'Binance Coin',
          balance: 45.67890123,
          locked: 0.00000000,
          price: 315.50,
          usdValue: 14412.34,
          change24h: 3.67,
          dailyWithdrawalLimit: 20000,
          networks: [
            {
              id: 'binance-smart-chain',
              name: 'Binance Smart Chain',
              symbol: 'BNB',
              address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
              minDeposit: 0.01,
              fee: 0.001,
              confirmations: 15,
              estimatedTime: '1-3 minutes',
              withdrawalFee: 0.001,
              minWithdrawal: 0.01,
              processingTime: '1-5 minutes',
              requiresMemo: false
            }
          ]
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          balance: 1250.00000000,
          locked: 0.00000000,
          price: 0.485,
          usdValue: 606.25,
          change24h: -2.15,
          dailyWithdrawalLimit: 5000,
          networks: [
            {
              id: 'cardano',
              name: 'Cardano',
              symbol: 'ADA',
              address: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a',
              memo: '1234567890',
              minDeposit: 1,
              fee: 1,
              confirmations: 15,
              estimatedTime: '2-5 minutes',
              withdrawalFee: 1,
              minWithdrawal: 10,
              processingTime: '2-10 minutes',
              requiresMemo: true
            }
          ]
        }
      ],
      transactions: [
        {
          id: 1,
          type: 'deposit',
          asset: 'BTC',
          amount: 0.5,
          usdValue: 22425.00,
          fee: 0.0005,
          status: 'completed',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          hash: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
          confirmations: 6,
          requiredConfirmations: 3
        },
        {
          id: 2,
          type: 'withdrawal',
          asset: 'ETH',
          amount: 2.0,
          usdValue: 5690.00,
          fee: 0.005,
          status: 'processing',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          hash: '2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g',
          confirmations: 2,
          requiredConfirmations: 12
        },
        {
          id: 3,
          type: 'trade',
          asset: 'USDT',
          amount: 1000.0,
          usdValue: 1000.00,
          fee: 0.1,
          status: 'completed',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          hash: '3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h'
        },
        {
          id: 4,
          type: 'deposit',
          asset: 'BNB',
          amount: 10.0,
          usdValue: 3155.00,
          fee: 0.001,
          status: 'pending',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          hash: '4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i',
          confirmations: 8,
          requiredConfirmations: 15
        },
        {
          id: 5,
          type: 'withdrawal',
          asset: 'ADA',
          amount: 500.0,
          usdValue: 242.50,
          fee: 1.0,
          status: 'failed',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          hash: '5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j'
        }
      ],
      addressBook: [
        {
          id: 1,
          label: 'Binance Exchange',
          address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
          network: 'bitcoin',
          memo: '',
          isWhitelisted: true,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          label: 'Personal Cold Wallet',
          address: '0x742d35Cc6634C0532925a3b8D4C8C1b8C8C8C8C8',
          network: 'ethereum',
          memo: '',
          isWhitelisted: true,
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
        },
        {
          id: 3,
          label: 'Trading Bot Wallet',
          address: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a',
          network: 'cardano',
          memo: '1234567890',
          isWhitelisted: false,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        }
      ],
      securitySettings: {
        dailyWithdrawalLimit: 50000,
        remainingDailyLimit: 35000,
        largeWithdrawalThreshold: 10000,
        require2FAForWithdrawals: true,
        requireWhitelistForLargeWithdrawals: true,
        emailNotifications: true,
        smsNotifications: false,
        autoLockOnSuspiciousActivity: true
      }
    };

    setWalletData(mockWalletData);
  }, []);

  const tabs = [
    { id: 'balances', label: 'Balances', icon: 'Wallet' },
    { id: 'deposit', label: 'Deposit', icon: 'ArrowDownLeft' },
    { id: 'withdraw', label: 'Withdraw', icon: 'ArrowUpRight' },
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'addresses', label: 'Address Book', icon: 'Book' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  const handleSend = (asset) => {
    setSelectedAsset(asset);
    setActiveTab('withdraw');
  };

  const handleReceive = (asset) => {
    setSelectedAsset(asset);
    setActiveTab('deposit');
  };

  const handleTrade = (asset) => {
    // Navigate to trading interface with selected asset
    console.log('Navigate to trading with asset:', asset.symbol);
  };

  const handleNetworkChange = (assetSymbol, network) => {
    console.log('Network changed for', assetSymbol, 'to', network.name);
  };

  const handleWithdrawSubmit = async (withdrawalData) => {
    console.log('Processing withdrawal:', withdrawalData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Add transaction to history
    const newTransaction = {
      id: Date.now(),
      type: 'withdrawal',
      asset: selectedAsset.symbol,
      amount: parseFloat(withdrawalData.amount),
      usdValue: parseFloat(withdrawalData.amount) * selectedAsset.price,
      fee: selectedAsset.networks.find(n => n.id === withdrawalData.network)?.withdrawalFee || 0,
      status: 'processing',
      timestamp: new Date(),
      hash: Math.random().toString(36).substring(2, 66)
    };
    setWalletData(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));
    setActiveTab('history');
  };

  const handleExportTransactions = () => {
    console.log('Exporting transaction history');
  };

  const handleViewTransactionDetails = (transaction) => {
    console.log('Viewing transaction details:', transaction);
  };

  const handleAddAddress = (addressData) => {
    const newAddress = {
      id: Date.now(),
      ...addressData,
      createdAt: new Date()
    };
    setWalletData(prev => ({
      ...prev,
      addressBook: [...prev.addressBook, newAddress]
    }));
  };

  const handleEditAddress = (id, addressData) => {
    setWalletData(prev => ({
      ...prev,
      addressBook: prev.addressBook.map(addr => 
        addr.id === id ? { ...addr, ...addressData } : addr
      )
    }));
  };

  const handleDeleteAddress = (id) => {
    setWalletData(prev => ({
      ...prev,
      addressBook: prev.addressBook.filter(addr => addr.id !== id)
    }));
  };

  const handleToggleWhitelist = (id) => {
    setWalletData(prev => ({
      ...prev,
      addressBook: prev.addressBook.map(addr => 
        addr.id === id ? { ...addr, isWhitelisted: !addr.isWhitelisted } : addr
      )
    }));
  };

  const handleUpdateSecuritySettings = (settings, twoFactorCode) => {
    console.log('Updating security settings with 2FA:', twoFactorCode);
    setWalletData(prev => ({
      ...prev,
      securitySettings: { ...prev.securitySettings, ...settings }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Wallet Management</h1>
              <p className="text-text-secondary">Secure cryptocurrency custody and management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-text-secondary">Total Portfolio Value</p>
                <p className="text-2xl font-semibold text-text-primary">
                  ${walletData.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-success">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-text-secondary'
                }`}
              >
                <Icon name={tab.icon} size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'balances' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {walletData.assets.map((asset) => (
                <WalletBalanceCard
                  key={asset.symbol}
                  asset={asset}
                  onSend={handleSend}
                  onReceive={handleReceive}
                  onTrade={handleTrade}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deposit' && (
          <div className="space-y-6">
            {selectedAsset ? (
              <DepositAddressCard
                asset={selectedAsset}
                onNetworkChange={handleNetworkChange}
              />
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Icon name="ArrowDownLeft" size={48} className="text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">Select an Asset to Deposit</h3>
                <p className="text-text-secondary mb-6">Choose from your available assets to generate a deposit address</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {walletData.assets.map((asset) => (
                    <Button
                      key={asset.symbol}
                      variant="outline"
                      onClick={() => setSelectedAsset(asset)}
                      className="flex flex-col items-center p-4 h-auto"
                    >
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-2">
                        <span className="text-white font-semibold text-xs">{asset.symbol.slice(0, 2)}</span>
                      </div>
                      <span className="text-sm">{asset.symbol}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="space-y-6">
            {selectedAsset ? (
              <WithdrawForm
                asset={selectedAsset}
                onSubmit={handleWithdrawSubmit}
                addressBook={walletData.addressBook.filter(addr => 
                  selectedAsset.networks.some(network => network.id === addr.network)
                )}
              />
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Icon name="ArrowUpRight" size={48} className="text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">Select an Asset to Withdraw</h3>
                <p className="text-text-secondary mb-6">Choose from your available assets to create a withdrawal</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {walletData.assets.map((asset) => (
                    <Button
                      key={asset.symbol}
                      variant="outline"
                      onClick={() => setSelectedAsset(asset)}
                      className="flex flex-col items-center p-4 h-auto"
                    >
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-2">
                        <span className="text-white font-semibold text-xs">{asset.symbol.slice(0, 2)}</span>
                      </div>
                      <span className="text-sm">{asset.symbol}</span>
                      <span className="text-xs text-text-secondary mt-1">
                        {asset.balance.toFixed(4)}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <TransactionHistory
            transactions={walletData.transactions}
            onExport={handleExportTransactions}
            onViewDetails={handleViewTransactionDetails}
          />
        )}

        {activeTab === 'addresses' && (
          <AddressBookManager
            addresses={walletData.addressBook}
            onAdd={handleAddAddress}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
            onToggleWhitelist={handleToggleWhitelist}
          />
        )}

        {activeTab === 'security' && (
          <SecuritySettings
            settings={walletData.securitySettings}
            onUpdateSettings={handleUpdateSecuritySettings}
          />
        )}
      </div>
    </div>
  );
};

export default WalletManagement;