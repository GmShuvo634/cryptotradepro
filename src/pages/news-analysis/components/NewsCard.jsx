import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const NewsCard = ({ article, onBookmark, onShare }) => {
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark(article.id, !isBookmarked);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'text-success bg-success/10';
      case 'bearish': return 'text-error bg-error/10';
      case 'neutral': return 'text-text-secondary bg-muted';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getSourceBadgeColor = (credibility) => {
    switch (credibility) {
      case 'high': return 'bg-success/20 text-success';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-error/20 text-error';
      default: return 'bg-muted text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover-lift">
      {/* Article Image */}
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
              {article.sentiment}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceBadgeColor(article.credibility)}`}>
              {article.credibility} credibility
            </span>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="p-4">
        {/* Source and Timestamp */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Globe" size={12} color="white" />
            </div>
            <span className="text-sm font-medium text-text-primary">{article.source}</span>
          </div>
          <span className="text-xs text-text-secondary">{article.timeAgo}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 hover:text-primary cursor-pointer transition-colors">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-text-secondary text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-surface text-text-secondary text-xs rounded-full hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Relevance Score */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-text-secondary">Relevance:</span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={12}
                  className={i < article.relevanceScore ? 'text-warning fill-current' : 'text-muted'}
                />
              ))}
            </div>
            <span className="text-xs text-text-secondary">({article.relevanceScore}/5)</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Eye" size={14} className="text-text-secondary" />
            <span className="text-xs text-text-secondary">{article.views}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName={isBookmarked ? "BookmarkCheck" : "Bookmark"}
              onClick={handleBookmark}
              className={isBookmarked ? 'text-primary' : ''}
            >
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Share"
              onClick={() => onShare(article)}
            >
              Share
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;