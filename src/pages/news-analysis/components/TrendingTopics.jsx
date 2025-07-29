import React from 'react';
import Icon from '../../../components/AppIcon';

const TrendingTopics = ({ topics }) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return { icon: 'TrendingUp', color: 'text-success' };
    if (trend < 0) return { icon: 'TrendingDown', color: 'text-error' };
    return { icon: 'Minus', color: 'text-text-secondary' };
  };

  const getTopicIcon = (category) => {
    switch (category) {
      case 'bitcoin': return 'Bitcoin';
      case 'ethereum': return 'Zap';
      case 'defi': return 'Layers';
      case 'nft': return 'Image';
      case 'regulation': return 'Scale';
      case 'mining': return 'Cpu';
      case 'altcoins': return 'Coins';
      default: return 'Hash';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Trending Topics</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-sm text-text-secondary">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {topics.map((topic, index) => {
          const trendIcon = getTrendIcon(topic.trend);
          
          return (
            <div
              key={topic.id}
              className="flex items-center justify-between p-3 hover:bg-surface/50 rounded-lg cursor-pointer transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-text-secondary w-6">
                    #{index + 1}
                  </span>
                  <div className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                    <Icon name={getTopicIcon(topic.category)} size={16} />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-text-secondary">
                      {topic.mentions} mentions
                    </span>
                    <span className="text-xs text-text-secondary">
                      {topic.volume} volume
                    </span>
                    <span className="px-2 py-0.5 bg-surface text-text-secondary text-xs rounded-full">
                      {topic.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className={`flex items-center space-x-1 ${trendIcon.color}`}>
                    <Icon name={trendIcon.icon} size={16} />
                    <span className="text-sm font-medium">
                      {Math.abs(topic.trend)}%
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary">
                    {topic.timeframe}
                  </div>
                </div>
                <Icon name="ChevronRight" size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Trending Hashtags */}
      <div className="mt-6 border-t border-border pt-6">
        <h3 className="text-sm font-medium text-text-primary mb-4">Trending Hashtags</h3>
        <div className="flex flex-wrap gap-2">
          {topics.slice(0, 8).map((topic) => (
            <button
              key={`hashtag-${topic.id}`}
              className="px-3 py-1.5 bg-surface hover:bg-primary/10 text-text-secondary hover:text-primary text-sm rounded-full transition-colors"
            >
              #{topic.title.toLowerCase().replace(/\s+/g, '')}
            </button>
          ))}
        </div>
      </div>

      {/* Market Impact */}
      <div className="mt-6 border-t border-border pt-6">
        <h3 className="text-sm font-medium text-text-primary mb-4">Market Impact</h3>
        <div className="space-y-3">
          {topics.slice(0, 3).map((topic) => (
            <div key={`impact-${topic.id}`} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary/20 text-primary rounded flex items-center justify-center">
                  <Icon name={getTopicIcon(topic.category)} size={12} />
                </div>
                <span className="text-sm text-text-primary">{topic.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-surface rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${
                      topic.marketImpact > 70 ? 'bg-error' :
                      topic.marketImpact > 40 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${topic.marketImpact}%` }}
                  />
                </div>
                <span className="text-xs text-text-secondary w-8">
                  {topic.marketImpact}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingTopics;