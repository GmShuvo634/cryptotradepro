import React from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const AnalysisCard = ({ analysis }) => {
  const getAnalysisTypeIcon = (type) => {
    switch (type) {
      case 'technical': return 'TrendingUp';
      case 'fundamental': return 'BarChart3';
      case 'institutional': return 'Building';
      case 'sentiment': return 'Heart';
      default: return 'FileText';
    }
  };

  const getAnalysisTypeColor = (type) => {
    switch (type) {
      case 'technical': return 'bg-primary/20 text-primary';
      case 'fundamental': return 'bg-success/20 text-success';
      case 'institutional': return 'bg-warning/20 text-warning';
      case 'sentiment': return 'bg-accent/20 text-accent';
      default: return 'bg-muted text-text-secondary';
    }
  };

  const getCredibilityBadge = (score) => {
    if (score >= 90) return { text: 'Expert', color: 'bg-success text-white' };
    if (score >= 70) return { text: 'Verified', color: 'bg-primary text-white' };
    if (score >= 50) return { text: 'Contributor', color: 'bg-warning text-white' };
    return { text: 'Community', color: 'bg-muted text-text-secondary' };
  };

  const credibilityBadge = getCredibilityBadge(analysis.credibilityScore);

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover-lift">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getAnalysisTypeColor(analysis.type)}`}>
            <Icon name={getAnalysisTypeIcon(analysis.type)} size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{analysis.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-text-secondary">by {analysis.author}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${credibilityBadge.color}`}>
                {credibilityBadge.text}
              </span>
            </div>
          </div>
        </div>
        <span className="text-xs text-text-secondary">{analysis.publishedAt}</span>
      </div>

      {/* Summary */}
      <p className="text-text-secondary mb-4 line-clamp-3">
        {analysis.summary}
      </p>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {analysis.keyMetrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-lg font-semibold text-text-primary font-mono">
              {metric.value}
            </div>
            <div className="text-xs text-text-secondary">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Price Targets */}
      {analysis.priceTargets && (
        <div className="bg-surface rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-text-primary mb-2">Price Targets</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-error font-mono text-sm">${analysis.priceTargets.bearish}</div>
              <div className="text-xs text-text-secondary">Bearish</div>
            </div>
            <div>
              <div className="text-text-primary font-mono text-sm">${analysis.priceTargets.neutral}</div>
              <div className="text-xs text-text-secondary">Neutral</div>
            </div>
            <div>
              <div className="text-success font-mono text-sm">${analysis.priceTargets.bullish}</div>
              <div className="text-xs text-text-secondary">Bullish</div>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {analysis.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-surface text-text-secondary text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="ThumbsUp" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{analysis.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MessageCircle" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{analysis.comments}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Eye" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{analysis.views}</span>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Read Full Analysis
        </Button>
      </div>
    </div>
  );
};

export default AnalysisCard;