import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Loader } from 'lucide-react';
import aiService from '../services/aiService';
import './AIInsightsWidget.css';

const AIInsightsWidget = ({ project, tasks }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (project && tasks && tasks.length > 0) {
      loadInsights();
    }
  }, [project, tasks]);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiService.generateProjectInsights(project, tasks);
      setInsights(data);
    } catch (err) {
      setError(err.message);
      console.error('AI Insights Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ai-insights-widget loading">
        <div className="widget-header">
          <Sparkles size={20} />
          <h3>AI Insights</h3>
        </div>
        <div className="loading-state">
          <Loader className="spinner" size={24} />
          <p>Analyzing project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-insights-widget error">
        <div className="widget-header">
          <Sparkles size={20} />
          <h3>AI Insights</h3>
        </div>
        <div className="error-state">
          <AlertTriangle size={24} />
          <p>{error}</p>
          <button onClick={loadInsights} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="ai-insights-widget">
      <div className="widget-header">
        <Sparkles size={20} />
        <h3>AI Insights</h3>
        <button onClick={loadInsights} className="refresh-btn">Refresh</button>
      </div>

      <div className="insights-content">
        {/* Health Score */}
        <div className="health-score">
          <TrendingUp size={18} />
          <div>
            <div className="score-label">Project Health</div>
            <div className="score-value">{insights.healthScore}/10</div>
          </div>
          <div className={`health-indicator health-${insights.healthScore >= 7 ? 'good' : insights.healthScore >= 4 ? 'medium' : 'poor'}`}>
            {insights.healthScore >= 7 ? '🟢 Good' : insights.healthScore >= 4 ? '🟡 Fair' : '🔴 At Risk'}
          </div>
        </div>

        {/* Risks */}
        {insights.risks && insights.risks.length > 0 && (
          <div className="insight-section">
            <div className="section-title">
              <AlertTriangle size={16} />
              Risks
            </div>
            <ul className="insight-list">
              {insights.risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {insights.recommendations && insights.recommendations.length > 0 && (
          <div className="insight-section">
            <div className="section-title">
              <Lightbulb size={16} />
              Recommendations
            </div>
            <ul className="insight-list">
              {insights.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Predicted Completion */}
        {insights.predictedCompletion && (
          <div className="completion-date">
            <span>Predicted Completion:</span>
            <strong>{insights.predictedCompletion}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightsWidget;
