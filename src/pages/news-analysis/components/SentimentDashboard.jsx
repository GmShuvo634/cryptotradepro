import React from 'react';
import Icon from '../../../components/AppIcon';

const SentimentDashboard = ({ sentimentData }) => {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return { icon: 'TrendingUp', color: 'text-success' };
      case 'bearish': return { icon: 'TrendingDown', color: 'text-error' };
      case 'neutral': return { icon: 'Minus', color: 'text-text-secondary' };
      default: return { icon: 'Activity', color: 'text-text-secondary' };
    }
  };

  const getSentimentPercentage = (value, total) => {
    return Math.round((value / total) * 100);
  };

  const totalSentiment = sentimentData.bullish + sentimentData.bearish + sentimentData.neutral;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Market Sentiment</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-text-secondary">Live</span>
        </div>
      </div>

      {/* Overall Sentiment */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-text-primary mb-2">
          {sentimentData.overall}
        </div>
        <div className="text-sm text-text-secondary">Overall Market Mood</div>
        <div className={`inline-flex items-center space-x-1 mt-2 px-3 py-1 rounded-full text-sm font-medium ${
          sentimentData.overall === 'Bullish' ? 'bg-success/20 text-success' :
          sentimentData.overall === 'Bearish'? 'bg-error/20 text-error' : 'bg-muted text-text-secondary'
        }`}>
          <Icon 
            name={getSentimentIcon(sentimentData.overall.toLowerCase()).icon} 
            size={16} 
          />
          <span>{sentimentData.change}</span>
        </div>
      </div>

      {/* Sentiment Breakdown */}
      <div className="space-y-4 mb-6">
        {[
          { key: 'bullish', label: 'Bullish', value: sentimentData.bullish, color: 'bg-success' },
          { key: 'bearish', label: 'Bearish', value: sentimentData.bearish, color: 'bg-error' },
          { key: 'neutral', label: 'Neutral', value: sentimentData.neutral, color: 'bg-muted' }
        ].map((item) => {
          const percentage = getSentimentPercentage(item.value, totalSentiment);
          const sentimentIcon = getSentimentIcon(item.key);
          
          return (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name={sentimentIcon.icon} size={16} className={sentimentIcon.color} />
                  <span className="text-sm font-medium text-text-primary">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary">{item.value}</span>
                  <span className="text-sm font-medium text-text-primary">{percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Fear & Greed Index */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-text-primary">Fear & Greed Index</span>
          <span className="text-sm text-text-secondary">Last 24h</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="w-full bg-surface rounded-full h-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-error via-warning to-success rounded-full" />
              <div
                className="absolute top-0 w-1 h-3 bg-white border border-border rounded-full transform -translate-x-1/2 transition-all duration-500"
                style={{ left: `${sentimentData.fearGreedIndex}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>Fear</span>
              <span>Neutral</span>
              <span>Greed</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-text-primary">
              {sentimentData.fearGreedIndex}
            </div>
            <div className="text-xs text-text-secondary">
              {sentimentData.fearGreedIndex < 25 ? 'Extreme Fear' :
               sentimentData.fearGreedIndex < 45 ? 'Fear' :
               sentimentData.fearGreedIndex < 55 ? 'Neutral' :
               sentimentData.fearGreedIndex < 75 ? 'Greed' : 'Extreme Greed'}
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Metrics */}
      <div className="border-t border-border pt-4 mt-4">
        <h3 className="text-sm font-medium text-text-primary mb-3">Social Media Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">{sentimentData.socialVolume}</div>
            <div className="text-xs text-text-secondary">Mentions (24h)</div>
            <div className="text-xs text-success">+{sentimentData.socialVolumeChange}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">{sentimentData.socialDominance}%</div>
            <div className="text-xs text-text-secondary">Social Dominance</div>
            <div className="text-xs text-error">{sentimentData.socialDominanceChange}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentDashboard;