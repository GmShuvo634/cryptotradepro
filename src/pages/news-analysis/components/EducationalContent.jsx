import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EducationalContent = ({ content }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-success/20 text-success';
      case 'intermediate': return 'bg-warning/20 text-warning';
      case 'advanced': return 'bg-error/20 text-error';
      default: return 'bg-muted text-text-secondary';
    }
  };

  const getDifficultyIcon = (level) => {
    switch (level) {
      case 'beginner': return 'Play';
      case 'intermediate': return 'BarChart3';
      case 'advanced': return 'Zap';
      default: return 'BookOpen';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Educational Content</h2>
        <Button variant="outline" size="sm" iconName="ExternalLink">
          View All Courses
        </Button>
      </div>

      <div className="space-y-4">
        {content.learningPaths.map((path) => (
          <div key={path.id} className="border border-border rounded-lg overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-surface/50 transition-colors"
              onClick={() => toggleSection(path.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getDifficultyColor(path.difficulty)}`}>
                    <Icon name={getDifficultyIcon(path.difficulty)} size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{path.title}</h3>
                    <p className="text-sm text-text-secondary">{path.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                        {path.difficulty}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} className="text-text-secondary" />
                        <span className="text-xs text-text-secondary">{path.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={14} className="text-text-secondary" />
                        <span className="text-xs text-text-secondary">{path.enrolled} enrolled</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-text-primary">{path.progress}%</div>
                    <div className="w-16 bg-surface rounded-full h-1 mt-1">
                      <div
                        className="bg-primary h-1 rounded-full transition-all duration-300"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  </div>
                  <Icon
                    name={expandedSections[path.id] ? "ChevronUp" : "ChevronDown"}
                    size={20}
                    className="text-text-secondary"
                  />
                </div>
              </div>
            </div>

            {expandedSections[path.id] && (
              <div className="border-t border-border p-4 bg-surface/30">
                <div className="space-y-3">
                  {path.modules.map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          module.completed ? 'bg-success text-white' : 'bg-muted text-text-secondary'
                        }`}>
                          {module.completed ? (
                            <Icon name="Check" size={16} />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-text-primary">{module.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Icon name="Play" size={12} className="text-text-secondary" />
                            <span className="text-xs text-text-secondary">{module.duration}</span>
                            {module.type === 'video' && (
                              <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded">
                                Video
                              </span>
                            )}
                            {module.type === 'quiz' && (
                              <span className="px-1.5 py-0.5 bg-warning/20 text-warning text-xs rounded">
                                Quiz
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={module.completed ? "outline" : "default"}
                        size="sm"
                        iconName={module.completed ? "RotateCcw" : "Play"}
                      >
                        {module.completed ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 border-t border-border pt-6">
        <h3 className="text-sm font-medium text-text-primary mb-4">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.quickTips.map((tip, index) => (
            <div key={index} className="bg-surface rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Lightbulb" size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-1">{tip.title}</h4>
                  <p className="text-xs text-text-secondary">{tip.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-6 border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-primary">Your Learning Progress</h3>
          <Button variant="ghost" size="sm" iconName="Trophy">
            View Achievements
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-text-primary">{content.progress.completed}</div>
            <div className="text-xs text-text-secondary">Completed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text-primary">{content.progress.inProgress}</div>
            <div className="text-xs text-text-secondary">In Progress</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text-primary">{content.progress.certificates}</div>
            <div className="text-xs text-text-secondary">Certificates</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalContent;