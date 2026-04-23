import React from 'react';
import '../styles/AnalyticsPanel.css';

const AnalyticsPanel = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="analytics-panel">
        <h3>Analytics</h3>
        <p>Cargando métricas del ecosistema...</p>
      </div>
    );
  }

  return (
    <div className="analytics-panel">
      <div className="panel-header">
        <h3>Analytics</h3>
        <span>Resultados de investigación</span>
      </div>

      <div className="analytics-section">
        <h4>Tecnologías más importantes</h4>
        <div className="analytics-list">
          {(analytics.nodeImportance || []).slice(0, 5).map((item) => (
            <div key={item.nodeName} className="analytics-item">
              <div>
                <strong>{item.nodeName}</strong>
                <small>{item.category}</small>
              </div>
              <span>{item.degree}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-section">
        <h4>Tecnologías puente</h4>
        <div className="analytics-list">
          {(analytics.bridgeNodes || []).slice(0, 5).map((item) => (
            <div key={item.nodeName} className="analytics-item">
              <div>
                <strong>{item.nodeName}</strong>
                <small>{(item.connectedClusters || []).join(', ')}</small>
              </div>
              <span>{Math.round((item.betweenness || 0) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-section">
        <h4>Clústeres detectados</h4>
        <div className="analytics-list">
          {(analytics.clusters || []).slice(0, 5).map((cluster) => (
            <div key={cluster.clusterId} className="analytics-item">
              <div>
                <strong>Cluster {cluster.clusterId}</strong>
                <small>{(cluster.nodes || []).slice(0, 3).join(', ')}</small>
              </div>
              <span>{cluster.size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;