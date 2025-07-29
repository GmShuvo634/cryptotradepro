import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const TransactionHistory = ({ transactions, onExport, onViewDetails }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  const filterOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'deposit', label: 'Deposits' },
    { value: 'withdrawal', label: 'Withdrawals' },
    { value: 'trade', label: 'Trades' },
    { value: 'transfer', label: 'Transfers' }
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'amount_desc', label: 'Highest Amount' },
    { value: 'amount_asc', label: 'Lowest Amount' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'failed': return 'XCircle';
      case 'processing': return 'Loader';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'pending': return 'text-warning';
      case 'failed': return 'text-error';
      case 'processing': return 'text-primary';
      default: return 'text-text-secondary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit': return 'ArrowDownLeft';
      case 'withdrawal': return 'ArrowUpRight';
      case 'trade': return 'TrendingUp';
      case 'transfer': return 'Send';
      default: return 'Circle';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'deposit': return 'text-success bg-success/10';
      case 'withdrawal': return 'text-error bg-error/10';
      case 'trade': return 'text-primary bg-primary/10';
      case 'transfer': return 'text-warning bg-warning/10';
      default: return 'text-text-secondary bg-muted';
    }
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

  const formatAmount = (amount, symbol) => {
    return `${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 8 
    })} ${symbol}`;
  };

  const filteredTransactions = transactions
    .filter(tx => {
      if (filter !== 'all' && tx.type !== filter) return false;
      if (searchTerm && !tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !tx.asset.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc': return new Date(b.timestamp) - new Date(a.timestamp);
        case 'date_asc': return new Date(a.timestamp) - new Date(b.timestamp);
        case 'amount_desc': return b.amount - a.amount;
        case 'amount_asc': return a.amount - b.amount;
        default: return 0;
      }
    });

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Transaction History</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Filter by Type"
            options={filterOptions}
            value={filter}
            onChange={setFilter}
          />
          <Select
            label="Sort by"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
          <Input
            label="Search"
            type="search"
            placeholder="Search by hash or asset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon name="FileText" size={48} className="text-text-secondary mb-4" />
            <p className="text-text-secondary">No transactions found</p>
          </div>
        ) : (
          <div className="min-w-full">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-6 border-b border-border hover:bg-surface/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(transaction.type)}`}>
                    <Icon name={getTypeIcon(transaction.type)} size={20} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-text-primary capitalize">
                        {transaction.type}
                      </p>
                      <div className={`flex items-center space-x-1 ${getStatusColor(transaction.status)}`}>
                        <Icon name={getStatusIcon(transaction.status)} size={14} />
                        <span className="text-xs capitalize">{transaction.status}</span>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {formatDate(transaction.timestamp)}
                    </p>
                    <p className="text-xs text-text-secondary font-mono">
                      {transaction.hash.slice(0, 16)}...{transaction.hash.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-mono font-semibold ${
                    transaction.type === 'deposit' ? 'text-success' : 
                    transaction.type === 'withdrawal'? 'text-error' : 'text-text-primary'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                    {formatAmount(transaction.amount, transaction.asset)}
                  </p>
                  <p className="text-sm text-text-secondary">
                    ${transaction.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  {transaction.fee > 0 && (
                    <p className="text-xs text-text-secondary">
                      Fee: {transaction.fee} {transaction.asset}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {transaction.confirmations !== undefined && (
                    <div className="text-center">
                      <p className="text-xs text-text-secondary">Confirmations</p>
                      <p className="text-sm font-medium text-text-primary">
                        {transaction.confirmations}/{transaction.requiredConfirmations}
                      </p>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ExternalLink"
                    onClick={() => onViewDetails(transaction)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>Showing {filteredTransactions.length} transactions</span>
            <Button variant="ghost" size="sm">
              Load More
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;