import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TransactionHistory = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'buy': return 'TrendingUp';
      case 'sell': return 'TrendingDown';
      case 'deposit': return 'ArrowDownLeft';
      case 'withdrawal': return 'ArrowUpRight';
      case 'transfer': return 'Send';
      case 'stake': return 'Lock';
      case 'unstake': return 'Unlock';
      case 'reward': return 'Gift';
      default: return 'Activity';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'buy': case'deposit': case'reward': case'stake':
        return 'text-success';
      case 'sell': case'withdrawal': case'unstake':
        return 'text-error';
      case 'transfer':
        return 'text-warning';
      default:
        return 'text-text-secondary';
    }
  };

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(tx => {
      const matchesSearch = tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tx.txHash.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || tx.type === filterType;
      
      const now = new Date();
      let dateThreshold = new Date();
      switch (dateRange) {
        case '7d':
          dateThreshold.setDate(now.getDate() - 7);
          break;
        case '30d':
          dateThreshold.setDate(now.getDate() - 30);
          break;
        case '90d':
          dateThreshold.setDate(now.getDate() - 90);
          break;
        case '1y':
          dateThreshold.setFullYear(now.getFullYear() - 1);
          break;
        default:
          dateThreshold = new Date(0);
      }
      
      const matchesDate = new Date(tx.timestamp) >= dateThreshold;
      
      return matchesSearch && matchesType && matchesDate;
    });

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [transactions, searchTerm, filterType, dateRange]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const transactionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'buy', label: 'Buy' },
    { value: 'sell', label: 'Sell' },
    { value: 'deposit', label: 'Deposit' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'stake', label: 'Stake' },
    { value: 'reward', label: 'Reward' }
  ];

  const dateRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <h3 className="text-lg font-semibold text-text-primary">Transaction History</h3>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative">
            <Input
              type="search"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {transactionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-card border border-border rounded-lg">
        {paginatedTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Activity" size={48} className="text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No transactions found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paginatedTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-surface/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Transaction Icon */}
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'buy' || transaction.type === 'deposit' || transaction.type === 'reward' ?'bg-success/20' 
                        : transaction.type === 'sell'|| transaction.type === 'withdrawal' ?'bg-error/20' :'bg-warning/20'
                    }`}>
                      <Icon 
                        name={getTransactionIcon(transaction.type)} 
                        size={20} 
                        className={getTransactionColor(transaction.type)}
                      />
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-text-primary capitalize">
                          {transaction.type}
                        </span>
                        <span className="font-semibold text-text-primary">
                          {transaction.asset}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-text-secondary">
                        <span>{formatDate(transaction.timestamp)}</span>
                        <span className="font-mono">
                          {transaction.quantity} {transaction.asset}
                        </span>
                        {transaction.price && (
                          <span className="font-mono">
                            @ {formatCurrency(transaction.price)}
                          </span>
                        )}
                      </div>
                      {transaction.txHash && (
                        <div className="flex items-center space-x-2 text-xs text-text-secondary">
                          <span>TX:</span>
                          <span className="font-mono">
                            {transaction.txHash.substring(0, 8)}...{transaction.txHash.substring(-8)}
                          </span>
                          <button className="text-primary hover:text-primary/80">
                            <Icon name="ExternalLink" size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transaction Value and Status */}
                  <div className="text-right space-y-1">
                    <div className={`font-mono font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'buy' || transaction.type === 'deposit' || transaction.type === 'reward' ? '+' : '-'}
                      {formatCurrency(transaction.value)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' 
                          ? 'bg-success/20 text-success'
                          : transaction.status === 'pending' ?'bg-warning/20 text-warning' :'bg-error/20 text-error'
                      }`}>
                        {transaction.status}
                      </div>
                      {transaction.fee && (
                        <span className="text-xs text-text-secondary font-mono">
                          Fee: {formatCurrency(transaction.fee)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-text-secondary">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                iconName="ChevronLeft"
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-surface'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Total Transactions</p>
          <p className="text-lg font-semibold text-text-primary">{filteredTransactions.length}</p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Total Volume</p>
          <p className="text-lg font-semibold text-text-primary font-mono">
            {formatCurrency(filteredTransactions.reduce((sum, tx) => sum + tx.value, 0))}
          </p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Total Fees</p>
          <p className="text-lg font-semibold text-error font-mono">
            {formatCurrency(filteredTransactions.reduce((sum, tx) => sum + (tx.fee || 0), 0))}
          </p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">Avg. Transaction</p>
          <p className="text-lg font-semibold text-text-primary font-mono">
            {formatCurrency(filteredTransactions.reduce((sum, tx) => sum + tx.value, 0) / filteredTransactions.length || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;