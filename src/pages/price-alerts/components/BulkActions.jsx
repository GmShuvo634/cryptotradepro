import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ 
  selectedAlerts, 
  onBulkAction, 
  onClearSelection,
  totalAlerts 
}) => {
  const [showConfirmation, setShowConfirmation] = useState(null);

  const handleBulkAction = (action) => {
    if (action === 'delete') {
      setShowConfirmation('delete');
    } else {
      onBulkAction(action, selectedAlerts);
      onClearSelection();
    }
  };

  const confirmDelete = () => {
    onBulkAction('delete', selectedAlerts);
    onClearSelection();
    setShowConfirmation(null);
  };

  const bulkActions = [
    {
      id: 'pause',
      label: 'Pause Selected',
      icon: 'Pause',
      color: 'text-warning',
      description: 'Temporarily disable selected alerts'
    },
    {
      id: 'resume',
      label: 'Resume Selected',
      icon: 'Play',
      color: 'text-success',
      description: 'Reactivate paused alerts'
    },
    {
      id: 'duplicate',
      label: 'Duplicate Selected',
      icon: 'Copy',
      color: 'text-primary',
      description: 'Create copies of selected alerts'
    },
    {
      id: 'export',
      label: 'Export Selected',
      icon: 'Download',
      color: 'text-text-primary',
      description: 'Export alert data to CSV'
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: 'Trash2',
      color: 'text-error',
      description: 'Permanently remove selected alerts'
    }
  ];

  if (selectedAlerts.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-surface border border-border rounded-lg shadow-elevation p-4 min-w-80">
          {/* Selection Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {selectedAlerts.length}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {selectedAlerts.length} of {totalAlerts} selected
                </p>
                <p className="text-xs text-text-secondary">
                  Choose an action to apply to selected alerts
                </p>
              </div>
            </div>
            
            <button
              onClick={onClearSelection}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
            >
              <Icon name="X" size={16} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {bulkActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleBulkAction(action.id)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-lg border border-border hover:bg-surface/50 transition-colors group ${
                  action.id === 'delete' ? 'hover:border-error/50' : 'hover:border-primary/50'
                }`}
                title={action.description}
              >
                <Icon 
                  name={action.icon} 
                  size={18} 
                  className={`${action.color} group-hover:scale-110 transition-transform`}
                />
                <span className={`text-xs font-medium ${action.color}`}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-text-secondary">Active</p>
                <p className="text-sm font-semibold text-success">
                  {selectedAlerts.filter(id => {
                    // This would need access to the actual alert data
                    // For now, we'll show a placeholder
                    return true;
                  }).length}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Paused</p>
                <p className="text-sm font-semibold text-warning">
                  {selectedAlerts.length - selectedAlerts.filter(id => true).length}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Total Value</p>
                <p className="text-sm font-semibold text-text-primary">
                  ${(selectedAlerts.length * 1250).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmation === 'delete' && (
        <>
          <div className="fixed inset-0 bg-black/50 z-400" onClick={() => setShowConfirmation(null)} />
          <div className="fixed inset-0 z-500 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-lg shadow-elevation w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center">
                    <Icon name="AlertTriangle" size={24} className="text-error" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      Delete Selected Alerts
                    </h3>
                    <p className="text-sm text-text-secondary">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-text-primary mb-2">
                    You are about to permanently delete <strong>{selectedAlerts.length}</strong> alerts.
                  </p>
                  <p className="text-xs text-text-secondary">
                    All associated history and notifications will also be removed.
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={confirmDelete}
                    iconName="Trash2"
                    iconPosition="left"
                  >
                    Delete {selectedAlerts.length} Alerts
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BulkActions;