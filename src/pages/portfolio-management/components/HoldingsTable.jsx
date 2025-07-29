import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const HoldingsTable = ({ holdings, onSort, onFilter }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'value', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value, decimals = 8) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }).format(value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  const filteredAndSortedHoldings = useMemo(() => {
    let filtered = holdings.filter(holding => {
      const matchesSearch = holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           holding.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'gainers' && holding.unrealizedPnL > 0) ||
                           (filterType === 'losers' && holding.unrealizedPnL < 0) ||
                           (filterType === 'stablecoins' && ['USDT', 'USDC', 'BUSD', 'DAI'].includes(holding.symbol));
      
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [holdings, searchTerm, filterType, sortConfig]);

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <Icon name="ArrowUpDown" size={16} className="text-text-secondary" />;
    }
    return (
      <Icon 
        name={sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
        size={16} 
        className="text-primary" 
      />
    );
  };

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-text-primary">Holdings</h3>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative">
            <Input
              type="search"
              placeholder="Search assets..."
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

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Assets</option>
              <option value="gainers">Gainers</option>
              <option value="losers">Losers</option>
              <option value="stablecoins">Stablecoins</option>
            </select>
            
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-text-secondary">
                  <button
                    onClick={() => handleSort('symbol')}
                    className="flex items-center space-x-2 hover:text-text-primary transition-colors"
                  >
                    <span>Asset</span>
                    <SortIcon column="symbol" />
                  </button>
                </th>
                <th className="text-right p-4 font-medium text-text-secondary">
                  <button
                    onClick={() => handleSort('quantity')}
                    className="flex items-center space-x-2 hover:text-text-primary transition-colors ml-auto"
                  >
                    <span>Quantity</span>
                    <SortIcon column="quantity" />
                  </button>
                </th>
                <th className="text-right p-4 font-medium text-text-secondary">
                  <button
                    onClick={() => handleSort('currentPrice')}
                    className="flex items-center space-x-2 hover:text-text-primary transition-colors ml-auto"
                  >
                    <span>Price</span>
                    <SortIcon column="currentPrice" />
                  </button>
                </th>
                <th className="text-right p-4 font-medium text-text-secondary">
                  <button
                    onClick={() => handleSort('value')}
                    className="flex items-center space-x-2 hover:text-text-primary transition-colors ml-auto"
                  >
                    <span>Value</span>
                    <SortIcon column="value" />
                  </button>
                </th>
                <th className="text-right p-4 font-medium text-text-secondary">
                  <button
                    onClick={() => handleSort('costBasis')}
                    className="flex items-center space-x-2 hover:text-text-primary transition-colors ml-auto"
                  >
                    <span>Cost Basis</span>
                    <SortIcon column="costBasis" />
                  </button>
                </th>
                <th className="text-right p-4 font-medium text-text-secondary">
                  <button
                    onClick={() => handleSort('unrealizedPnL')}
                    className="flex items-center space-x-2 hover:text-text-primary transition-colors ml-auto"
                  >
                    <span>Unrealized P&L</span>
                    <SortIcon column="unrealizedPnL" />
                  </button>
                </th>
                <th className="text-right p-4 font-medium text-text-secondary">
                  <button
                    onClick={() => handleSort('allocation')}
                    className="flex items-center space-x-2 hover:text-text-primary transition-colors ml-auto"
                  >
                    <span>Allocation</span>
                    <SortIcon column="allocation" />
                  </button>
                </th>
                <th className="text-center p-4 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedHoldings.map((holding, index) => (
                <tr 
                  key={holding.symbol}
                  className="border-b border-border hover:bg-surface/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {holding.symbol.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{holding.symbol}</p>
                        <p className="text-sm text-text-secondary">{holding.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <p className="font-mono text-text-primary">
                      {formatNumber(holding.quantity)}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <div className="space-y-1">
                      <p className="font-mono text-text-primary">
                        {formatCurrency(holding.currentPrice)}
                      </p>
                      <p className={`text-sm font-mono ${
                        holding.priceChange24h >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {holding.priceChange24h >= 0 ? '+' : ''}{holding.priceChange24h.toFixed(2)}%
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <p className="font-mono text-text-primary font-semibold">
                      {formatCurrency(holding.value)}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <p className="font-mono text-text-primary">
                      {formatCurrency(holding.costBasis)}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <div className="space-y-1">
                      <p className={`font-mono font-semibold ${
                        holding.unrealizedPnL >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {holding.unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(holding.unrealizedPnL)}
                      </p>
                      <p className={`text-sm font-mono ${
                        holding.unrealizedPnLPercent >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        ({holding.unrealizedPnLPercent >= 0 ? '+' : ''}{holding.unrealizedPnLPercent.toFixed(2)}%)
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="space-y-2">
                      <p className="font-mono text-text-primary">{holding.allocation.toFixed(2)}%</p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(holding.allocation, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="TrendingUp">
                        Buy
                      </Button>
                      <Button variant="ghost" size="sm" iconName="TrendingDown">
                        Sell
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedHoldings.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No holdings found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="bg-surface rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-text-secondary mb-1">Total Assets</p>
            <p className="font-semibold text-text-primary">{filteredAndSortedHoldings.length}</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Total Value</p>
            <p className="font-semibold text-text-primary font-mono">
              {formatCurrency(filteredAndSortedHoldings.reduce((sum, h) => sum + h.value, 0))}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Total P&L</p>
            <p className={`font-semibold font-mono ${
              filteredAndSortedHoldings.reduce((sum, h) => sum + h.unrealizedPnL, 0) >= 0 
                ? 'text-success' : 'text-error'
            }`}>
              {formatCurrency(filteredAndSortedHoldings.reduce((sum, h) => sum + h.unrealizedPnL, 0))}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Avg. Return</p>
            <p className={`font-semibold font-mono ${
              filteredAndSortedHoldings.reduce((sum, h) => sum + h.unrealizedPnLPercent, 0) / filteredAndSortedHoldings.length >= 0 
                ? 'text-success' : 'text-error'
            }`}>
              {(filteredAndSortedHoldings.reduce((sum, h) => sum + h.unrealizedPnLPercent, 0) / filteredAndSortedHoldings.length || 0).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingsTable;