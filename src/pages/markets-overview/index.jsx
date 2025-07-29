import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import NotificationCenter from '../../components/ui/NotificationCenter';
import MarketFilters from './components/MarketFilters';
import MarketTable from './components/MarketTable';
import MarketStats from './components/MarketStats';
import ViewToggle from './components/ViewToggle';
import WatchlistPanel from './components/WatchlistPanel';
import QuickTradeModal from './components/QuickTradeModal';

const MarketsOverview = () => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentView, setCurrentView] = useState('table');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [watchlist, setWatchlist] = useState([]);
  const [isQuickTradeOpen, setIsQuickTradeOpen] = useState(false);
  const [selectedCoinForTrade, setSelectedCoinForTrade] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    marketCap: 'all',
    exchange: 'all',
    category: 'all',
    priceMin: '',
    priceMax: '',
    changeMin: '',
    changeMax: '',
    volumeMin: ''
  });

  // Mock market data
  const mockMarketData = [
    {
      id: 'bitcoin',
      rank: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      price: 44850.32,
      change24h: 2.45,
      volume24h: 28500000000,
      marketCap: 875000000000,
      sparkline: [44200, 44350, 44100, 44500, 44800, 44650, 44850],
      category: 'layer1',
      exchanges: ['binance', 'coinbase', 'kraken']
    },
    {
      id: 'ethereum',
      rank: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      price: 2845.67,
      change24h: -1.23,
      volume24h: 15200000000,
      marketCap: 342000000000,
      sparkline: [2890, 2870, 2820, 2800, 2830, 2860, 2845],
      category: 'layer1',
      exchanges: ['binance', 'coinbase', 'kraken']
    },
    {
      id: 'binancecoin',
      rank: 3,
      name: 'BNB',
      symbol: 'BNB',
      image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
      price: 315.42,
      change24h: 3.78,
      volume24h: 1800000000,
      marketCap: 48500000000,
      sparkline: [308, 312, 318, 320, 316, 314, 315],
      category: 'exchange',
      exchanges: ['binance']
    },
    {
      id: 'solana',
      rank: 4,
      name: 'Solana',
      symbol: 'SOL',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      price: 98.76,
      change24h: 5.67,
      volume24h: 2100000000,
      marketCap: 42800000000,
      sparkline: [92, 94, 96, 99, 101, 100, 98],
      category: 'layer1',
      exchanges: ['binance', 'coinbase', 'kraken']
    },
    {
      id: 'ripple',
      rank: 5,
      name: 'XRP',
      symbol: 'XRP',
      image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      price: 0.6234,
      change24h: -2.14,
      volume24h: 1500000000,
      marketCap: 33600000000,
      sparkline: [0.64, 0.63, 0.62, 0.61, 0.62, 0.63, 0.62],
      category: 'payment',
      exchanges: ['binance', 'coinbase', 'kraken']
    },
    {
      id: 'cardano',
      rank: 6,
      name: 'Cardano',
      symbol: 'ADA',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      price: 0.4567,
      change24h: 1.89,
      volume24h: 890000000,
      marketCap: 16200000000,
      sparkline: [0.45, 0.46, 0.44, 0.45, 0.46, 0.47, 0.46],
      category: 'layer1',
      exchanges: ['binance', 'coinbase', 'kraken']
    },
    {
      id: 'dogecoin',
      rank: 7,
      name: 'Dogecoin',
      symbol: 'DOGE',
      image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
      price: 0.0823,
      change24h: 8.45,
      volume24h: 1200000000,
      marketCap: 11800000000,
      sparkline: [0.076, 0.078, 0.081, 0.084, 0.086, 0.084, 0.082],
      category: 'meme',
      exchanges: ['binance', 'coinbase', 'kraken']
    },
    {
      id: 'avalanche',
      rank: 8,
      name: 'Avalanche',
      symbol: 'AVAX',
      image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
      price: 36.78,
      change24h: -0.67,
      volume24h: 650000000,
      marketCap: 13500000000,
      sparkline: [37.2, 37.0, 36.5, 36.8, 37.1, 36.9, 36.8],
      category: 'layer1',
      exchanges: ['binance', 'coinbase', 'kraken']
    },
    {
      id: 'chainlink',
      rank: 9,
      name: 'Chainlink',
      symbol: 'LINK',
      image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
      price: 14.56,
      change24h: 4.23,
      volume24h: 580000000,
      marketCap: 8200000000,
      sparkline: [14.0, 14.2, 14.4, 14.7, 14.8, 14.6, 14.6],
      category: 'defi',
      exchanges: ['binance', 'coinbase', 'kraken']
    },
    {
      id: 'polygon',
      rank: 10,
      name: 'Polygon',
      symbol: 'MATIC',
      image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
      price: 0.8945,
      change24h: -3.12,
      volume24h: 420000000,
      marketCap: 8800000000,
      sparkline: [0.92, 0.91, 0.89, 0.88, 0.90, 0.91, 0.89],
      category: 'layer2',
      exchanges: ['binance', 'coinbase', 'kraken']
    }
  ];

  // Mock market stats
  const mockMarketStats = {
    totalMarketCap: 1850000000000,
    marketCapChange24h: 1.85,
    totalVolume24h: 89500000000,
    volumeChange24h: -2.34,
    btcDominance: 47.3,
    btcDominanceChange: 0.12,
    ethDominance: 18.5,
    fearGreedIndex: 68,
    fearGreedYesterday: 65,
    activeExchanges: 127
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = mockMarketData.filter(coin => {
      // Search filter
      if (filters.search && !coin.name.toLowerCase().includes(filters.search.toLowerCase()) && 
          !coin.symbol.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Market cap filter
      if (filters.marketCap !== 'all') {
        const marketCap = coin.marketCap;
        switch (filters.marketCap) {
          case 'large':
            if (marketCap < 10000000000) return false;
            break;
          case 'mid':
            if (marketCap < 1000000000 || marketCap >= 10000000000) return false;
            break;
          case 'small':
            if (marketCap < 100000000 || marketCap >= 1000000000) return false;
            break;
          case 'micro':
            if (marketCap >= 100000000) return false;
            break;
        }
      }

      // Price range filter
      if (filters.priceMin && coin.price < parseFloat(filters.priceMin)) return false;
      if (filters.priceMax && coin.price > parseFloat(filters.priceMax)) return false;

      // Change range filter
      if (filters.changeMin && coin.change24h < parseFloat(filters.changeMin)) return false;
      if (filters.changeMax && coin.change24h > parseFloat(filters.changeMax)) return false;

      // Volume filter
      if (filters.volumeMin && coin.volume24h < parseFloat(filters.volumeMin)) return false;

      // Category filter
      if (filters.category !== 'all' && coin.category !== filters.category) return false;

      // Exchange filter
      if (filters.exchange !== 'all' && !coin.exchanges.includes(filters.exchange)) return false;

      return true;
    });

    // Sort data
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [filters, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddToWatchlist = (coin) => {
    if (!watchlist.find(item => item.id === coin.id)) {
      setWatchlist(prev => [...prev, coin]);
    }
  };

  const handleRemoveFromWatchlist = (coinId) => {
    setWatchlist(prev => prev.filter(item => item.id !== coinId));
  };

  const handleQuickTrade = (coin) => {
    setSelectedCoinForTrade(coin);
    setIsQuickTradeOpen(true);
  };

  const handleExecuteTrade = (tradeData) => {
    console.log('Executing trade:', tradeData);
    // Here you would integrate with your trading API
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Initialize with some watchlist items
  useEffect(() => {
    setWatchlist([mockMarketData[0], mockMarketData[1], mockMarketData[3]]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <QuickActionToolbar />
      
      {/* Main Content */}
      <main className="ml-0 md:ml-60 mt-24 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Markets Overview</h1>
            <p className="text-text-secondary">
              Real-time cryptocurrency market data with advanced filtering and analysis tools
            </p>
          </div>

          {/* Market Statistics */}
          <MarketStats stats={mockMarketStats} />

          {/* Watchlist Panel */}
          <WatchlistPanel
            watchlist={watchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            onQuickTrade={handleQuickTrade}
          />

          {/* Market Filters */}
          <MarketFilters
            onFiltersChange={handleFiltersChange}
            activeFilters={filters}
          />

          {/* View Toggle */}
          <ViewToggle
            currentView={currentView}
            onViewChange={setCurrentView}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-text-secondary">
              Showing {paginatedData.length} of {filteredAndSortedData.length} cryptocurrencies
            </div>
            <div className="text-sm text-text-secondary">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Market Table */}
          <MarketTable
            data={paginatedData}
            onSort={handleSort}
            sortConfig={sortConfig}
            onAddToWatchlist={handleAddToWatchlist}
            onQuickTrade={handleQuickTrade}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-text-secondary">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface transition-colors"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-primary text-white' :'border border-border hover:bg-surface'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Quick Trade Modal */}
      <QuickTradeModal
        isOpen={isQuickTradeOpen}
        onClose={() => setIsQuickTradeOpen(false)}
        coin={selectedCoinForTrade}
        onExecuteTrade={handleExecuteTrade}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
};

export default MarketsOverview;