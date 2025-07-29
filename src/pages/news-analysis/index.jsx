import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import NotificationCenter from '../../components/ui/NotificationCenter';
import NewsCard from './components/NewsCard';
import AnalysisCard from './components/AnalysisCard';
import FilterSidebar from './components/FilterSidebar';
import SentimentDashboard from './components/SentimentDashboard';
import EducationalContent from './components/EducationalContent';
import TrendingTopics from './components/TrendingTopics';

const NewsAnalysis = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    categories: [],
    sources: [],
    cryptocurrencies: [],
    sentiments: [],
    timeRange: 'today',
    searchQuery: ''
  });

  // Mock data for news articles
  const newsArticles = [
    {
      id: 1,
      title: "Bitcoin Reaches New All-Time High as Institutional Adoption Accelerates",
      summary: "Bitcoin surged past $65,000 for the first time, driven by increased institutional investment and growing mainstream acceptance. Major corporations continue to add BTC to their treasury reserves.",
      source: "CoinDesk",
      author: "Sarah Johnson",
      timeAgo: "2 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=200&fit=crop",
      sentiment: "bullish",
      credibility: "high",
      relevanceScore: 5,
      views: "12.5K",
      tags: ["bitcoin", "institutional", "adoption", "price"],
      isBookmarked: false
    },
    {
      id: 2,
      title: "Ethereum 2.0 Staking Rewards Hit Record Levels Amid Network Upgrades",
      summary: "Ethereum staking yields have reached unprecedented levels following the latest network upgrade. Validators are earning higher rewards as transaction fees increase and network activity surges.",
      source: "Decrypt",
      author: "Michael Chen",
      timeAgo: "4 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
      sentiment: "bullish",
      credibility: "high",
      relevanceScore: 4,
      views: "8.3K",
      tags: ["ethereum", "staking", "rewards", "upgrade"],
      isBookmarked: true
    },
    {
      id: 3,
      title: "Regulatory Clarity Emerges as SEC Provides New Cryptocurrency Guidelines",
      summary: "The Securities and Exchange Commission has released comprehensive guidelines for cryptocurrency operations, providing much-needed regulatory clarity for the industry.",
      source: "Cointelegraph",
      author: "Lisa Rodriguez",
      timeAgo: "6 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      sentiment: "neutral",
      credibility: "high",
      relevanceScore: 5,
      views: "15.2K",
      tags: ["regulation", "sec", "guidelines", "compliance"],
      isBookmarked: false
    },
    {
      id: 4,
      title: "DeFi Protocol Suffers $50M Exploit in Smart Contract Vulnerability",
      summary: "A major DeFi protocol has been exploited for $50 million due to a smart contract vulnerability. The team is working on recovery measures and has paused all protocol operations.",
      source: "Blockworks",
      author: "David Kim",
      timeAgo: "8 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
      sentiment: "bearish",
      credibility: "medium",
      relevanceScore: 4,
      views: "22.1K",
      tags: ["defi", "exploit", "security", "vulnerability"],
      isBookmarked: false
    }
  ];

  // Mock data for analysis articles
  const analysisArticles = [
    {
      id: 1,
      title: "Bitcoin Technical Analysis: Bull Flag Pattern Suggests $70K Target",
      summary: "Technical analysis reveals a strong bull flag pattern in Bitcoin's price action, with key resistance levels and potential price targets identified for the coming weeks.",
      author: "Alex Thompson",
      type: "technical",
      publishedAt: "3 hours ago",
      credibilityScore: 92,
      likes: 245,
      comments: 67,
      views: "5.2K",
      tags: ["BTC", "Technical Analysis", "Bull Flag", "Price Target"],
      keyMetrics: [
        { label: "Support", value: "$42,500" },
        { label: "Resistance", value: "$48,000" },
        { label: "Target", value: "$70,000" },
        { label: "Stop Loss", value: "$40,000" }
      ],
      priceTargets: {
        bearish: "38,000",
        neutral: "45,000",
        bullish: "70,000"
      }
    },
    {
      id: 2,
      title: "Ethereum Fundamental Analysis: Network Growth Drives Long-term Value",
      summary: "Deep dive into Ethereum's fundamental metrics including network activity, developer adoption, and institutional interest driving long-term value proposition.",
      author: "Maria Santos",
      type: "fundamental",
      publishedAt: "5 hours ago",
      credibilityScore: 88,
      likes: 189,
      comments: 43,
      views: "3.8K",
      tags: ["ETH", "Fundamental Analysis", "Network Growth", "Valuation"],
      keyMetrics: [
        { label: "Active Addresses", value: "750K" },
        { label: "TVL", value: "$45B" },
        { label: "Gas Usage", value: "85%" },
        { label: "Staking Ratio", value: "12%" }
      ]
    }
  ];

  // Mock sentiment data
  const sentimentData = {
    overall: "Bullish",
    change: "+5.2% (24h)",
    bullish: 1247,
    bearish: 432,
    neutral: 821,
    fearGreedIndex: 72,
    socialVolume: "45.2K",
    socialVolumeChange: "12.5%",
    socialDominance: 8.3,
    socialDominanceChange: "-2.1%"
  };

  // Mock trending topics
  const trendingTopics = [
    {
      id: 1,
      title: "Bitcoin ETF Approval",
      category: "bitcoin",
      mentions: 15420,
      volume: "2.3M",
      trend: 25.4,
      timeframe: "24h",
      marketImpact: 85
    },
    {
      id: 2,
      title: "Ethereum Merge Update",
      category: "ethereum",
      mentions: 12350,
      volume: "1.8M",
      trend: 18.7,
      timeframe: "24h",
      marketImpact: 72
    },
    {
      id: 3,
      title: "DeFi Yield Farming",
      category: "defi",
      mentions: 8940,
      volume: "1.2M",
      trend: -5.2,
      timeframe: "24h",
      marketImpact: 45
    },
    {
      id: 4,
      title: "NFT Marketplace Wars",
      category: "nft",
      mentions: 7650,
      volume: "980K",
      trend: 12.3,
      timeframe: "24h",
      marketImpact: 38
    },
    {
      id: 5,
      title: "Crypto Regulation News",
      category: "regulation",
      mentions: 6780,
      volume: "850K",
      trend: 8.9,
      timeframe: "24h",
      marketImpact: 65
    }
  ];

  // Mock educational content
  const educationalContent = {
    learningPaths: [
      {
        id: 1,
        title: "Cryptocurrency Trading Fundamentals",
        description: "Learn the basics of cryptocurrency trading, market analysis, and risk management",
        difficulty: "beginner",
        duration: "4 weeks",
        enrolled: 1250,
        progress: 65,
        modules: [
          { title: "Introduction to Crypto Markets", duration: "45 min", type: "video", completed: true },
          { title: "Reading Charts and Indicators", duration: "60 min", type: "video", completed: true },
          { title: "Risk Management Basics", duration: "30 min", type: "video", completed: false },
          { title: "Trading Psychology", duration: "40 min", type: "video", completed: false },
          { title: "Final Assessment", duration: "20 min", type: "quiz", completed: false }
        ]
      },
      {
        id: 2,
        title: "Advanced Technical Analysis",
        description: "Master advanced charting techniques and trading strategies",
        difficulty: "advanced",
        duration: "6 weeks",
        enrolled: 680,
        progress: 25,
        modules: [
          { title: "Elliott Wave Theory", duration: "90 min", type: "video", completed: true },
          { title: "Fibonacci Retracements", duration: "75 min", type: "video", completed: false },
          { title: "Volume Analysis", duration: "60 min", type: "video", completed: false },
          { title: "Market Structure", duration: "80 min", type: "video", completed: false }
        ]
      }
    ],
    quickTips: [
      {
        title: "Dollar-Cost Averaging",
        content: "Invest a fixed amount regularly to reduce the impact of volatility on your portfolio."
      },
      {
        title: "Never Invest More Than You Can Lose",
        content: "Cryptocurrency markets are highly volatile. Only invest money you can afford to lose completely."
      },
      {
        title: "Do Your Own Research (DYOR)",
        content: "Always research projects thoroughly before investing. Don\'t rely solely on social media or influencer advice."
      },
      {
        title: "Use Stop-Loss Orders",
        content: "Protect your investments by setting stop-loss orders to automatically sell if prices fall below a certain level."
      }
    ],
    progress: {
      completed: 12,
      inProgress: 3,
      certificates: 5
    }
  };

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending' }
  ];

  const tabs = [
    { id: 'news', label: 'News', icon: 'Newspaper', count: newsArticles.length },
    { id: 'analysis', label: 'Analysis', icon: 'BarChart3', count: analysisArticles.length },
    { id: 'education', label: 'Education', icon: 'BookOpen', count: educationalContent.learningPaths.length }
  ];

  const handleBookmark = (articleId, isBookmarked) => {
    console.log(`Article ${articleId} ${isBookmarked ? 'bookmarked' : 'unbookmarked'}`);
  };

  const handleShare = (article) => {
    console.log('Sharing article:', article.title);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    document.title = 'News & Analysis - CryptoTradePro';
  }, []);

  return (
    <>
      <Helmet>
        <title>News & Analysis - CryptoTradePro</title>
        <meta name="description" content="Stay informed with the latest cryptocurrency news, market analysis, and educational content. Get expert insights and real-time market sentiment analysis." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <QuickActionToolbar />
        
        {/* Main Content */}
        <main className="ml-0 lg:ml-60 pt-24 pb-20 lg:pb-6">
          <div className="flex">
            {/* Filter Sidebar */}
            <FilterSidebar
              isOpen={isFilterSidebarOpen}
              onClose={() => setIsFilterSidebarOpen(false)}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />

            {/* Content Area */}
            <div className="flex-1 p-6">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-text-primary">News & Analysis</h1>
                    <p className="text-text-secondary mt-2">
                      Stay informed with the latest cryptocurrency news, market analysis, and educational content
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      iconName="Filter"
                      onClick={() => setIsFilterSidebarOpen(true)}
                      className="lg:hidden"
                    >
                      Filters
                    </Button>
                    <Button
                      variant="outline"
                      iconName="Bell"
                      onClick={() => setIsNotificationCenterOpen(true)}
                    >
                      Alerts
                    </Button>
                  </div>
                </div>

                {/* Search and Controls */}
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="search"
                      placeholder="Search news, analysis, and educational content..."
                      value={filters.searchQuery}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Select
                      options={sortOptions}
                      value={sortBy}
                      onChange={setSortBy}
                      placeholder="Sort by"
                      className="w-40"
                    />
                    <div className="flex items-center bg-surface rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <Icon name="Grid3X3" size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'list' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <Icon name="List" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center space-x-1 mb-6 border-b border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span className="font-medium">{tab.label}</span>
                    <span className="bg-surface text-text-secondary text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="xl:col-span-3">
                  {activeTab === 'news' && (
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' ?'grid-cols-1 lg:grid-cols-2' :'grid-cols-1'
                    }`}>
                      {newsArticles.map((article) => (
                        <NewsCard
                          key={article.id}
                          article={article}
                          onBookmark={handleBookmark}
                          onShare={handleShare}
                        />
                      ))}
                    </div>
                  )}

                  {activeTab === 'analysis' && (
                    <div className="space-y-6">
                      {analysisArticles.map((analysis) => (
                        <AnalysisCard key={analysis.id} analysis={analysis} />
                      ))}
                    </div>
                  )}

                  {activeTab === 'education' && (
                    <EducationalContent content={educationalContent} />
                  )}
                </div>

                {/* Sidebar Content */}
                <div className="space-y-6">
                  <SentimentDashboard sentimentData={sentimentData} />
                  <TrendingTopics topics={trendingTopics} />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Notification Center */}
        <NotificationCenter
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
        />
      </div>
    </>
  );
};

export default NewsAnalysis;