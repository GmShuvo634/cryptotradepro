import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ViewToggle = ({ currentView, onViewChange, itemsPerPage, onItemsPerPageChange }) => {
  const viewOptions = [
    { key: 'table', label: 'Table', icon: 'Table' },
    { key: 'grid', label: 'Grid', icon: 'Grid3X3' },
    { key: 'list', label: 'List', icon: 'List' }
  ];

  const itemsPerPageOptions = [25, 50, 100, 250];

  return (
    <div className="flex items-center justify-between bg-surface border border-border rounded-lg p-4 mb-4">
      {/* View Toggle */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-text-secondary">View:</span>
        <div className="flex items-center space-x-1 bg-background rounded-lg p-1">
          {viewOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => onViewChange(option.key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === option.key
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <Icon name={option.icon} size={16} />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Items Per Page */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-text-secondary hidden sm:inline">Show:</span>
        <div className="flex items-center space-x-1">
          {itemsPerPageOptions.map((count) => (
            <button
              key={count}
              onClick={() => onItemsPerPageChange(count)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                itemsPerPage === count
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
        <span className="text-sm text-text-secondary hidden sm:inline">per page</span>
      </div>

      {/* Additional Options */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" iconName="RefreshCw">
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        <Button variant="ghost" size="sm" iconName="Download">
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </div>
  );
};

export default ViewToggle;